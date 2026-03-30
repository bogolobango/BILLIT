import type { ProposalContent, ScopingData, Profile, TeamMember, PastProject } from "@/lib/types"

export interface GenerateProposalParams {
  rfpText: string
  scopingData: ScopingData
  profile: Profile
  teamMembers: TeamMember[]
  pastProjects: PastProject[]
  pastProposalTexts: string[]
}

export async function generateProposal(params: GenerateProposalParams): Promise<ProposalContent> {
  // TODO: Replace with Anthropic API call using PROPOSAL_GENERATE_SYSTEM_PROMPT
  // For MVP, return realistic mock proposal content

  const { scopingData, profile, teamMembers, pastProjects } = params
  const companyName = profile.company_name || "Apex Design Group"
  const leadName = teamMembers[0]?.name || "Michael Torres"
  const leadTitle = teamMembers[0]?.title || "Principal Architect"

  return {
    sections: [
      {
        id: "cover-letter",
        title: "Cover Letter",
        content: `<p>Dear ${scopingData.client_contact || "Selection Committee"},</p>
<p>${companyName} is pleased to submit this proposal in response to your Request for Proposals for the ${scopingData.description || "proposed project"}. We are excited about the opportunity to bring our extensive experience in ${scopingData.project_type?.toLowerCase() || "architecture"} design to this important project.</p>
<p>With over ${teamMembers.reduce((sum, m) => sum + (m.years_experience || 0), 0)} combined years of experience in the AEC industry, our team has successfully delivered ${pastProjects.length || "numerous"} projects of similar scope and complexity. We understand the unique challenges of ${scopingData.project_type || "this"} projects and bring a collaborative, client-centered approach to every engagement.</p>
<p>We look forward to the opportunity to discuss our qualifications and approach in detail.</p>
<p>Respectfully submitted,</p>
<p><strong>${leadName}</strong><br/>${leadTitle}<br/>${companyName}</p>`,
        order: 1,
      },
      {
        id: "executive-summary",
        title: "Executive Summary",
        content: `<p>${companyName} proposes a comprehensive design approach for the ${scopingData.description || "proposed project"} that prioritizes functional excellence, sustainability, and long-term value for ${scopingData.client_name || "the client"}.</p>
<p>Our approach is built on three core principles:</p>
<ul>
<li><strong>Evidence-Based Design:</strong> Every design decision will be supported by research, best practices, and stakeholder input to ensure optimal outcomes.</li>
<li><strong>Integrated Project Delivery:</strong> We will coordinate closely with all consultants and stakeholders from day one to minimize change orders and maintain schedule integrity.</li>
<li><strong>Sustainable Performance:</strong> Our design will target LEED Silver certification while optimizing operational efficiency and occupant comfort.</li>
</ul>
<p>Our proposed fee of ${scopingData.estimated_fee_min && scopingData.estimated_fee_max ? `$${(scopingData.estimated_fee_min / 1000).toFixed(0)}K - $${(scopingData.estimated_fee_max / 1000).toFixed(0)}K` : "competitive market rates"} reflects our commitment to delivering exceptional value within ${scopingData.timeline || "the proposed timeline"}.</p>`,
        order: 2,
      },
      {
        id: "understanding-of-project",
        title: "Understanding of Project",
        content: `<p>We understand that ${scopingData.client_name || "the client"} seeks a design partner for a ${scopingData.description || "new facility"} located in ${scopingData.location || "the project site"}.</p>
<p>Based on our review of the RFP and our experience with similar projects, we have identified the following key project drivers:</p>
<ul>
<li><strong>Functional Efficiency:</strong> The facility must support streamlined workflows while accommodating future growth and adaptation.</li>
<li><strong>Code Compliance:</strong> All design work must comply with applicable building codes, accessibility requirements, and industry-specific regulations.</li>
<li><strong>Budget Discipline:</strong> Design decisions must balance quality and innovation with responsible cost management.</li>
<li><strong>Schedule Adherence:</strong> Meeting the ${scopingData.timeline || "project timeline"} requires proactive coordination and decision-making.</li>
<li><strong>Sustainability Goals:</strong> Achieving sustainability targets while maintaining operational cost efficiency.</li>
</ul>
<p>Our team has specific experience addressing each of these drivers on past projects, and we will bring proven strategies to ensure success on this engagement.</p>`,
        order: 3,
      },
      {
        id: "approach-methodology",
        title: "Approach & Methodology",
        content: `<p>Our approach follows a structured, phase-based methodology that ensures thorough coordination and quality control at every stage:</p>
${(scopingData.scope_phases || []).map((phase, i) => `
<h3>${phase}</h3>
<p>${getPhaseDescription(phase, scopingData)}</p>`).join("")}
<p><strong>Quality Assurance:</strong> At each phase milestone, our QA team conducts a thorough review including code compliance, constructability, and alignment with project goals. This disciplined approach has helped us maintain a 95% on-budget delivery rate across our portfolio.</p>`,
        order: 4,
      },
      {
        id: "team-qualifications",
        title: "Team & Qualifications",
        content: `<p>${companyName} will assign a dedicated project team with deep expertise in ${scopingData.project_type || "architectural"} design:</p>
${teamMembers.map(member => `
<h3>${member.name} — ${member.title}</h3>
<p>${member.bio || `${member.name} brings ${member.years_experience || 15} years of experience to the team.`} ${member.certifications?.length ? `Certifications: ${member.certifications.join(", ")}.` : ""}</p>`).join("")}
${teamMembers.length === 0 ? `
<h3>${leadName} — ${leadTitle}</h3>
<p>With 22 years of experience leading complex ${scopingData.project_type?.toLowerCase() || "architectural"} projects, ${leadName} will serve as Principal-in-Charge, providing senior oversight and client communication throughout the project lifecycle. Licensed Architect (OR, WA, CA), LEED AP BD+C.</p>
<h3>Jennifer Walsh — Project Manager</h3>
<p>Jennifer brings 15 years of project management experience with a focus on ${scopingData.project_type?.toLowerCase() || "institutional"} projects. She will manage day-to-day coordination, schedule, and budget tracking. PMP, AIA.</p>
<h3>David Kim — Design Lead</h3>
<p>David is an award-winning designer with 12 years of experience creating functional, beautiful spaces. He will lead the design vision and ensure cohesive aesthetic quality. AIA, WELL AP.</p>` : ""}`,
        order: 5,
      },
      {
        id: "relevant-experience",
        title: "Relevant Experience",
        content: `<p>${companyName} has completed ${pastProjects.length || "numerous"} projects directly relevant to this engagement:</p>
${pastProjects.length > 0 ? pastProjects.map(project => `
<h3>${project.name}</h3>
<p><strong>Client:</strong> ${project.client} | <strong>Value:</strong> $${(project.value / 1000000).toFixed(1)}M | <strong>Location:</strong> ${project.location} | <strong>Completed:</strong> ${project.year_completed}</p>
<p>${project.description}</p>`).join("") : `
<h3>Regional Medical Pavilion — Pacific Health Systems</h3>
<p><strong>Value:</strong> $32M | <strong>Location:</strong> Seattle, WA | <strong>Completed:</strong> 2024</p>
<p>35,000 SF ambulatory care center featuring outpatient surgery suites, diagnostic imaging, and primary care clinics. Achieved LEED Gold certification. Delivered on schedule and 3% under budget.</p>
<h3>Westside Community Health Center — Multnomah County</h3>
<p><strong>Value:</strong> $18M | <strong>Location:</strong> Portland, OR | <strong>Completed:</strong> 2023</p>
<p>22,000 SF community health facility with urgent care, behavioral health, and dental services. FGI-compliant design with emphasis on trauma-informed care environments.</p>
<h3>Cascade Medical Office Building — Providence Health</h3>
<p><strong>Value:</strong> $24M | <strong>Location:</strong> Bend, OR | <strong>Completed:</strong> 2022</p>
<p>28,000 SF medical office building housing specialty clinics and administrative offices. Net-zero energy design with on-site solar and geothermal systems.</p>`}`,
        order: 6,
      },
      {
        id: "fee-proposal",
        title: "Fee Proposal",
        content: `<p>We propose a ${scopingData.fee_structure || "Lump Sum / Fixed Fee"} for the complete scope of services as outlined below:</p>
<table>
<thead><tr><th>Phase</th><th>Fee</th><th>% of Total</th></tr></thead>
<tbody>
${(scopingData.scope_phases || ["Schematic Design", "Design Development", "Construction Documents", "Construction Administration"]).map((phase, i) => {
  const percentages = [5, 15, 20, 35, 5, 20]
  const pct = percentages[i] || 10
  const baseFee = scopingData.estimated_fee_min || 950000
  const fee = Math.round(baseFee * pct / 100)
  return `<tr><td>${phase}</td><td>$${fee.toLocaleString()}</td><td>${pct}%</td></tr>`
}).join("")}
</tbody>
</table>
<p><strong>Total Proposed Fee: $${((scopingData.estimated_fee_min || 950000)).toLocaleString()}</strong></p>
<p><strong>Assumptions:</strong></p>
<ul>
<li>Fee is based on the scope of services described in the RFP</li>
<li>Reimbursable expenses (printing, travel, etc.) are estimated at 3% of fee and billed at cost</li>
<li>Additional services beyond the defined scope will be negotiated prior to commencement</li>
<li>Fee assumes timely client decisions and approvals at each milestone</li>
</ul>`,
        order: 7,
      },
      {
        id: "project-schedule",
        title: "Project Schedule",
        content: `<p>We propose the following milestone-based schedule, aligned with the ${scopingData.timeline || "24-month"} project timeline:</p>
<table>
<thead><tr><th>Milestone</th><th>Target Date</th><th>Duration</th></tr></thead>
<tbody>
${(scopingData.milestones || [
  { name: "Notice to Proceed", date: "Month 1" },
  { name: "Programming Complete", date: "Month 3" },
  { name: "Schematic Design Complete", date: "Month 6" },
  { name: "Design Development Complete", date: "Month 10" },
  { name: "Construction Documents Complete", date: "Month 14" },
  { name: "Bid Opening", date: "Month 16" },
  { name: "Construction Start", date: "Month 18" },
  { name: "Substantial Completion", date: "Month 24" },
]).map((m, i, arr) => `<tr><td>${m.name}</td><td>${m.date}</td><td>${i > 0 ? "—" : "—"}</td></tr>`).join("")}
</tbody>
</table>
<p><strong>Schedule Commitments:</strong></p>
<ul>
<li>Bi-weekly client progress meetings throughout design phases</li>
<li>Phase completion reviews with 5 business days for client feedback</li>
<li>Dedicated CA site visits per the construction schedule</li>
<li>Monthly schedule updates with variance reporting</li>
</ul>`,
        order: 8,
      },
    ],
  }
}

function getPhaseDescription(phase: string, scopingData: ScopingData): string {
  const descriptions: Record<string, string> = {
    "Pre-Design / Programming": `We will conduct stakeholder interviews, analyze existing conditions, and develop a comprehensive programming document. This phase establishes the foundation for all subsequent design work, including space needs assessment, adjacency requirements, and operational workflow analysis.`,
    "Schematic Design (SD)": `Building on the approved program, we will develop conceptual design options that address functional requirements, site constraints, and aesthetic goals. We will present ${scopingData.client_name || "the client"} with two to three design alternatives for evaluation, including preliminary floor plans, elevations, and 3D renderings.`,
    "Design Development (DD)": `The approved schematic design will be refined with detailed architectural, structural, and MEP systems. We will coordinate with all consultants to resolve technical issues and prepare updated cost estimates. Material selections and key building systems will be finalized during this phase.`,
    "Construction Documents (CD)": `We will produce a complete set of construction documents suitable for permitting and bidding. Our documentation follows a rigorous quality control process including interdisciplinary coordination reviews, code compliance checks, and constructability reviews.`,
    "Bidding & Negotiation": `We will support the bidding process by preparing bid packages, conducting pre-bid conferences, responding to bidder questions, and evaluating proposals. We will provide a detailed bid analysis and recommendation for contractor selection.`,
    "Construction Administration (CA)": `Our CA services include regular site observations, submittal and RFI review, change order evaluation, and progress payment certification. We maintain detailed field reports and will coordinate closely with the contractor to resolve issues promptly and protect ${scopingData.client_name || "the client"}'s interests.`,
    "Post-Construction / Closeout": `We will conduct final inspections, compile as-built documentation, and ensure all project closeout requirements are met. We remain available for a one-year warranty period to address any post-occupancy issues.`,
  }
  return descriptions[phase] || `This phase will be executed with the same rigor and attention to detail that defines all of our project work.`
}
