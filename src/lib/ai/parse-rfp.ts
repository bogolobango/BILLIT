import type { ScopingData, ComplianceItem } from "@/lib/types"

export interface ParseRFPResult {
  scoping_data: ScopingData
  compliance_items: ComplianceItem[]
}

export async function parseRFP(rfpText: string): Promise<ParseRFPResult> {
  // TODO: Replace mock data with Anthropic API call
  // const anthropic = new Anthropic()
  // const message = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4096,
  //   system: RFP_PARSE_SYSTEM_PROMPT,
  //   messages: [{ role: "user", content: rfpText }],
  // })

  // For MVP, return realistic mock data for an AEC project
  const mockResult: ParseRFPResult = {
    scoping_data: {
      project_type: "Healthcare",
      client_name: "Metro Regional Medical Center",
      client_contact: "Sarah Chen, Director of Facilities Planning",
      scope_phases: [
        "Pre-Design / Programming",
        "Schematic Design (SD)",
        "Design Development (DD)",
        "Construction Documents (CD)",
        "Bidding & Negotiation",
        "Construction Administration (CA)",
      ],
      deliverables: [
        "Programming report and space needs assessment",
        "Schematic design drawings and outline specifications",
        "Design development drawings and updated specifications",
        "Complete construction document set (architectural, structural, MEP)",
        "Cost estimates at each phase milestone",
        "LEED certification documentation",
        "Bidding support and contractor evaluation",
        "Construction administration services through substantial completion",
      ],
      fee_structure: "Lump Sum / Fixed Fee",
      estimated_fee_min: 850000,
      estimated_fee_max: 1200000,
      timeline: "24 months from notice to proceed to substantial completion",
      milestones: [
        { name: "Notice to Proceed", date: "2026-06-01" },
        { name: "Programming Complete", date: "2026-08-15" },
        { name: "Schematic Design Complete", date: "2026-11-01" },
        { name: "Design Development Complete", date: "2027-02-15" },
        { name: "Construction Documents Complete", date: "2027-06-01" },
        { name: "Bid Opening", date: "2027-07-15" },
        { name: "Construction Start", date: "2027-09-01" },
        { name: "Substantial Completion", date: "2028-06-01" },
      ],
      location: "Portland, Oregon",
      description:
        "Design of a new 45,000 SF ambulatory care center on the existing medical campus, including outpatient surgery suites, imaging center, primary care clinics, and administrative offices. The facility must achieve LEED Silver certification minimum and comply with OSHPD seismic requirements.",
    },
    compliance_items: [
      {
        id: "comp-1",
        requirement: "Oregon-licensed Architecture firm",
        category: "certification",
        status: "not_met",
        notes: "Principal-in-charge must hold active Oregon architecture license",
      },
      {
        id: "comp-2",
        requirement: "LEED Accredited Professional on project team",
        category: "certification",
        status: "not_met",
        notes: "At least one team member must hold LEED AP BD+C credential",
      },
      {
        id: "comp-3",
        requirement: "Professional liability insurance - $2M minimum",
        category: "insurance",
        status: "not_met",
        notes: "Certificate of insurance required with proposal submission",
      },
      {
        id: "comp-4",
        requirement: "Minimum 3 healthcare projects over $10M in past 5 years",
        category: "document",
        status: "not_met",
        notes: "Must include project references with contact information",
      },
      {
        id: "comp-5",
        requirement: "Proposal submission deadline: May 15, 2026 at 2:00 PM PST",
        category: "deadline",
        status: "not_met",
        notes: "Late submissions will not be accepted",
      },
      {
        id: "comp-6",
        requirement: "Proposal format: maximum 30 pages, 8.5x11, PDF format",
        category: "format",
        status: "not_met",
        notes: "Excludes cover page, table of contents, and resumes in appendix",
      },
      {
        id: "comp-7",
        requirement: "DBE participation plan - 15% target",
        category: "other",
        status: "not_met",
        notes: "Disadvantaged Business Enterprise participation plan required",
      },
      {
        id: "comp-8",
        requirement: "FGI Guidelines compliance documentation",
        category: "document",
        status: "not_met",
        notes: "Demonstrate familiarity with Facility Guidelines Institute standards for healthcare design",
      },
    ],
  }

  return mockResult
}
