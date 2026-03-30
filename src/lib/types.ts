export interface Profile {
  id: string
  company_name: string
  logo_url: string | null
  services: string[]
  certifications: string[]
  bio: string
  industry_focus: string
  created_at: string
}

export interface TeamMember {
  id: string
  profile_id: string
  name: string
  title: string
  role: string
  bio: string
  years_experience: number
  certifications: string[]
  photo_url: string | null
}

export interface PastProject {
  id: string
  profile_id: string
  name: string
  client: string
  project_type: string
  value: number
  location: string
  description: string
  year_completed: number
  key_personnel: string[]
}

export interface PastProposal {
  id: string
  profile_id: string
  file_url: string
  file_name: string
  extracted_text: string | null
  uploaded_at: string
}

export type ProposalStatus = "draft" | "review" | "sent" | "won" | "lost"

export interface Proposal {
  id: string
  profile_id: string
  title: string
  client_name: string
  project_type: string
  status: ProposalStatus
  rfp_source_type: "upload" | "paste"
  rfp_text: string | null
  rfp_file_url: string | null
  scoping_data: ScopingData | null
  compliance_checklist: ComplianceItem[] | null
  content: ProposalContent | null
  generated_at: string
  updated_at: string
  price_paid: number | null
  stripe_payment_id: string | null
}

export interface ScopingData {
  project_type: string
  client_name: string
  client_contact: string
  scope_phases: string[]
  deliverables: string[]
  fee_structure: string
  estimated_fee_min: number | null
  estimated_fee_max: number | null
  timeline: string
  milestones: { name: string; date: string }[]
  location: string
  description: string
}

export interface ComplianceItem {
  id: string
  requirement: string
  category: "certification" | "document" | "format" | "insurance" | "deadline" | "other"
  status: "met" | "not_met" | "needs_attention"
  notes: string
}

export interface ProposalSection {
  id: string
  title: string
  content: string
  order: number
}

export interface ProposalContent {
  sections: ProposalSection[]
}

export const PROJECT_TYPES = [
  "Commercial",
  "Residential",
  "Infrastructure",
  "Healthcare",
  "Education",
  "Industrial",
  "Mixed-Use",
  "Public/Government",
  "Hospitality",
  "Retail",
  "Renewable Energy",
  "Transportation",
  "Water/Wastewater",
  "Parks & Recreation",
] as const

export const SCOPE_PHASES = [
  "Pre-Design / Programming",
  "Schematic Design (SD)",
  "Design Development (DD)",
  "Construction Documents (CD)",
  "Bidding & Negotiation",
  "Construction Administration (CA)",
  "Post-Construction / Closeout",
] as const

export const FEE_STRUCTURES = [
  "Lump Sum / Fixed Fee",
  "Hourly / Time & Materials",
  "Percentage of Construction Cost",
  "Cost Plus Fixed Fee",
  "Unit Price",
  "Not-to-Exceed",
] as const

export const PROPOSAL_SECTIONS = [
  "Cover Letter",
  "Executive Summary",
  "Understanding of Project",
  "Approach & Methodology",
  "Team & Qualifications",
  "Relevant Experience",
  "Fee Proposal",
  "Project Schedule",
  "Appendices",
] as const
