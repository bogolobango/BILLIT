import type { ScopingData, ComplianceItem } from "@/lib/types"
// import Anthropic from "@anthropic-ai/sdk"
// import { RFP_PARSE_SYSTEM_PROMPT } from "./prompts"

export interface ParseRFPResult {
  scoping_data: ScopingData
  compliance_items: ComplianceItem[]
}

/**
 * Parse an RFP text using Claude AI to extract structured scoping data
 * and compliance requirements.
 *
 * MVP: Returns realistic mock data for a municipal community center project.
 * Production: Uncomment the Anthropic API call below.
 */
export async function parseRFP(rfpText: string): Promise<ParseRFPResult> {
  // --- Production implementation (uncomment when ready) ---
  // const client = new Anthropic()
  // const message = await client.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4096,
  //   system: RFP_PARSE_SYSTEM_PROMPT,
  //   messages: [{ role: "user", content: rfpText }],
  // })
  // const text = message.content[0].type === "text" ? message.content[0].text : ""
  // return JSON.parse(text) as ParseRFPResult

  // --- MVP mock implementation ---
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const hasText = rfpText.trim().length > 0
  if (!hasText) {
    throw new Error("RFP text is required")
  }

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
        "ADA compliance review and documentation",
        "Community engagement summary report",
      ],
      fee_structure: "Lump Sum / Fixed Fee",
      estimated_fee_min: 850000,
      estimated_fee_max: 1200000,
      timeline: "24 months from notice to proceed through construction completion",
      milestones: [
        { name: "Proposal Submission Deadline", date: "2026-05-15" },
        { name: "Shortlist Notification", date: "2026-06-01" },
        { name: "Interviews", date: "2026-06-15" },
        { name: "Notice to Proceed", date: "2026-07-01" },
        { name: "Programming Complete", date: "2026-09-01" },
        { name: "Schematic Design Complete", date: "2026-12-01" },
        { name: "Design Development Complete", date: "2027-03-01" },
        { name: "Construction Documents Complete", date: "2027-06-01" },
        { name: "Bid Phase Complete", date: "2027-08-01" },
        { name: "Construction Substantial Completion", date: "2028-07-01" },
      ],
      location: "Riverside, California",
      description:
        "Design of a new 45,000 SF community center and recreation facility for the City of Riverside. The project includes a gymnasium, multipurpose rooms, senior center wing, childcare facility, outdoor amphitheater, and associated site improvements including parking, landscaping, and stormwater management. The facility must achieve LEED Silver certification and comply with all applicable accessibility standards. The project has a construction budget of $18.5M and requires extensive community engagement throughout the design process.",
    },
    compliance_items: [
      {
        id: "comp-1",
        requirement: "Licensed architect in the State of California",
        category: "certification",
        status: "needs_attention",
        notes: "Verify California architectural license is current for the principal-in-charge",
      },
      {
        id: "comp-2",
        requirement: "LEED Accredited Professional on the project team",
        category: "certification",
        status: "needs_attention",
        notes: "At least one team member must hold LEED AP BD+C credential",
      },
      {
        id: "comp-3",
        requirement: "Professional liability insurance minimum $2M per occurrence",
        category: "insurance",
        status: "needs_attention",
        notes: "Review current policy limits; municipal projects often require higher coverage",
      },
      {
        id: "comp-4",
        requirement: "Submit 6 bound copies and 1 digital copy (PDF, max 30MB)",
        category: "format",
        status: "met",
        notes: "Standard submission format — ensure PDF is optimized for file size",
      },
      {
        id: "comp-5",
        requirement: "Proposal must not exceed 50 pages excluding resumes and project sheets",
        category: "format",
        status: "met",
        notes: "Monitor page count during proposal development",
      },
      {
        id: "comp-6",
        requirement: "Submission deadline: May 15, 2026 at 2:00 PM PST",
        category: "deadline",
        status: "met",
        notes: "Allow buffer for printing, binding, and delivery",
      },
      {
        id: "comp-7",
        requirement: "SF 330 form (Parts I and II) required",
        category: "document",
        status: "needs_attention",
        notes: "Federal SF 330 form required — ensure all subconsultants are included",
      },
      {
        id: "comp-8",
        requirement: "Minimum 3 comparable municipal projects completed within last 10 years",
        category: "other",
        status: "needs_attention",
        notes: "Review portfolio for qualifying municipal recreation/community center projects",
      },
      {
        id: "comp-9",
        requirement: "DBE participation goal of 15%",
        category: "other",
        status: "needs_attention",
        notes: "Identify and confirm DBE-certified subconsultants for the project team",
      },
      {
        id: "comp-10",
        requirement: "City of Riverside business license",
        category: "certification",
        status: "needs_attention",
        notes: "Obtain City of Riverside business license if not already held",
      },
    ],
  }
}
