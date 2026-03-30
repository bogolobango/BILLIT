import Anthropic from "@anthropic-ai/sdk"
import { RFP_PARSE_SYSTEM_PROMPT } from "./prompts"
import type { ScopingData, ComplianceItem } from "@/lib/types"

export interface ParseRFPResult {
  scoping_data: ScopingData
  compliance_items: ComplianceItem[]
}

export async function parseRFP(rfpText: string): Promise<ParseRFPResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY not set — returning mock data")
    return getMockResult()
  }

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: RFP_PARSE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: rfpText }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No JSON found in Claude response:", text.slice(0, 200))
      return getMockResult()
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Normalize the response structure
    return {
      scoping_data: parsed.scoping_data,
      compliance_items: parsed.compliance_items || [],
    }
  } catch (error) {
    console.error("Claude API error in parseRFP:", error)
    return getMockResult()
  }
}

function getMockResult(): ParseRFPResult {
  return {
    scoping_data: {
      project_type: "Public/Government",
      client_name: "City of Riverside Parks & Recreation Department",
      client_contact: "Maria Chen, Capital Projects Manager",
      scope_phases: [
        "Pre-Design / Programming",
        "Schematic Design (SD)",
        "Design Development (DD)",
        "Construction Documents (CD)",
        "Bidding & Negotiation",
        "Construction Administration (CA)",
      ],
      deliverables: [
        "Programming & needs assessment report",
        "Site analysis and feasibility study",
        "Schematic design package with 3D renderings",
        "Design development drawings and outline specifications",
        "Construction documents (full drawing set and specifications)",
        "Bid-phase support and contractor evaluation",
        "Construction administration through substantial completion",
        "LEED certification documentation (Silver minimum)",
      ],
      fee_structure: "Lump Sum / Fixed Fee",
      estimated_fee_min: 850000,
      estimated_fee_max: 1200000,
      timeline: "24 months from notice to proceed through construction completion",
      milestones: [
        { name: "Proposal Submission Deadline", date: "2026-05-15" },
        { name: "Notice to Proceed", date: "2026-07-01" },
        { name: "Schematic Design Complete", date: "2026-12-01" },
        { name: "Construction Documents Complete", date: "2027-06-01" },
        { name: "Construction Substantial Completion", date: "2028-07-01" },
      ],
      location: "Riverside, California",
      description:
        "Design of a new 45,000 SF community center and recreation facility including gymnasium, multipurpose rooms, senior center wing, childcare facility, outdoor amphitheater, and associated site improvements. LEED Silver certification required. Construction budget: $18.5M.",
    },
    compliance_items: [
      { id: "comp-1", requirement: "Licensed architect in the State of California", category: "certification", status: "needs_attention", notes: "Verify California license is current" },
      { id: "comp-2", requirement: "LEED Accredited Professional on project team", category: "certification", status: "needs_attention", notes: "At least one LEED AP BD+C required" },
      { id: "comp-3", requirement: "Professional liability insurance minimum $2M", category: "insurance", status: "needs_attention", notes: "Review current policy limits" },
      { id: "comp-4", requirement: "Submission deadline: May 15, 2026 at 2:00 PM PST", category: "deadline", status: "met", notes: "Allow buffer for delivery" },
      { id: "comp-5", requirement: "Proposal max 50 pages, PDF format", category: "format", status: "met", notes: "Excludes resumes and project sheets" },
      { id: "comp-6", requirement: "Minimum 3 comparable municipal projects in last 10 years", category: "other", status: "needs_attention", notes: "Review portfolio for qualifying projects" },
      { id: "comp-7", requirement: "DBE participation goal of 15%", category: "other", status: "needs_attention", notes: "Identify DBE-certified subconsultants" },
      { id: "comp-8", requirement: "SF 330 form (Parts I and II) required", category: "document", status: "needs_attention", notes: "Federal SF 330 form required" },
    ],
  }
}
