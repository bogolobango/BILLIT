import type {
  ScopingData,
  Profile,
  TeamMember,
  PastProject,
  ProposalContent,
} from "@/lib/types"
// import Anthropic from "@anthropic-ai/sdk"
// import { PROPOSAL_GENERATE_SYSTEM_PROMPT } from "./prompts"

export interface GenerateProposalParams {
  rfpText: string
  scopingData: ScopingData
  profile: Profile
  teamMembers: TeamMember[]
  pastProjects: PastProject[]
  pastProposalTexts: string[]
}

/**
 * Generate a complete AEC proposal using Claude AI.
 *
 * MVP: Returns realistic mock proposal content.
 * Production: Uncomment the Anthropic API call below.
 */
export async function generateProposal(
  params: GenerateProposalParams
): Promise<ProposalContent> {
  // --- Production implementation (uncomment when ready) ---
  // const client = new Anthropic()
  // const userMessage = JSON.stringify({
  //   rfp_text: params.rfpText,
  //   scoping_data: params.scopingData,
  //   profile: params.profile,
  //   team_members: params.teamMembers,
  //   past_projects: params.pastProjects,
  //   past_proposal_samples: params.pastProposalTexts,
  // })
  // const message = await client.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 8192,
  //   system: PROPOSAL_GENERATE_SYSTEM_PROMPT,
  //   messages: [{ role: "user", content: userMessage }],
  // })
  // const text = message.content[0].type === "text" ? message.content[0].text : ""
  // return JSON.parse(text) as ProposalContent

  // --- MVP mock implementation ---
  await new Promise((resolve) => setTimeout(resolve, 2500))

  const { scopingData, profile, teamMembers, pastProjects } = params
  const companyName = profile?.company_name || "Apex Design Group"
  const clientName =
    scopingData?.client_name || "City of Riverside Parks & Recreation Department"
  const clientContact = scopingData?.client_contact || "Selection Committee"
  const projectLocation = scopingData?.location || "Riverside, California"
  const projectType = scopingData?.project_type || "Public/Government"
  const projectDescription =
    scopingData?.description || "new community center and recreation facility"

  const leadName = teamMembers?.[0]?.name || "Sarah Mitchell, AIA, LEED AP"
  const leadTitle = teamMembers?.[0]?.title || "Principal-in-Charge"

  return {
    sections: [
      {
        id: "section-cover-letter",
        title: "Cover Letter",
        order: 1,
        content: `<p>Dear ${clientContact},</p>

<p>${companyName} is pleased to submit our qualifications and proposal for the design of the ${projectDescription} for ${clientName}. We have reviewed the RFP thoroughly and are excited by the opportunity to create a facility that will serve the community for generations to come.</p>

<p>Our firm brings over two decades of experience designing public recreation and community facilities across Southern California. We understand that this project is more than a building — it is a civic investment in health, equity, and community connection. Our approach combines rigorous technical expertise with a deep commitment to community engagement, ensuring the final design reflects the aspirations and needs of the community's diverse residents.</p>

<p>We have assembled a project team with direct experience in municipal recreation facilities, LEED-certified sustainable design, and ADA-compliant public architecture. We are confident that our team's expertise, combined with our collaborative design process, will deliver a facility that exceeds expectations within the established budget and timeline.</p>

<p>We look forward to the opportunity to discuss our approach with you in greater detail.</p>

<p>Sincerely,<br/>${leadName}<br/>${leadTitle}, ${companyName}</p>`,
      },
      {
        id: "section-executive-summary",
        title: "Executive Summary",
        order: 2,
        content: `<p>${companyName} proposes a comprehensive design approach for the ${projectDescription} in ${projectLocation}. Our team will deliver a LEED Silver-certified facility that serves as a cornerstone of community life — integrating recreation, senior services, childcare, and cultural programming under one thoughtfully designed roof.</p>

<p>Our approach is built on three principles:</p>
<ul>
<li><strong>Community-Driven Design:</strong> We will conduct extensive stakeholder engagement during programming to ensure the facility reflects real community needs.</li>
<li><strong>Environmental Responsibility:</strong> Our sustainable design strategies consistently achieve LEED certification while reducing long-term operational costs by 15-25% annually.</li>
<li><strong>Fiscal Stewardship:</strong> Our experience managing public project budgets means we design to the budget, not around it.</li>
</ul>

<p>The proposed team includes licensed professionals with direct experience on comparable municipal projects ranging from $12M to $35M in construction value. Our track record includes five community recreation facilities completed in the last eight years, all delivered on time and within budget.</p>`,
      },
      {
        id: "section-understanding",
        title: "Understanding of Project",
        order: 3,
        content: `<p>${clientName} seeks to create a modern, inclusive facility that addresses growing demand for recreation programming, senior services, and childcare. The facility represents a significant investment in the community and must serve a diverse range of users — from youth athletics to senior wellness to early childhood development.</p>

<p>We understand that the project site in ${projectLocation} presents both opportunities and constraints. Our site analysis will address solar orientation, prevailing winds, and existing utility infrastructure to optimize building placement and reduce site development costs. Careful attention to stormwater management, parking design, and integration with the surrounding neighborhood context will be essential.</p>

<p>The program requirements demand a design that balances acoustic separation with visual connectivity, creating a facility that feels cohesive rather than compartmentalized. The childcare and senior center functions have specific licensing and code requirements that we have navigated extensively in previous projects.</p>

<p>The LEED Silver certification requirement aligns with our standard practice. We approach sustainability not as an add-on but as an integral part of the design process, identifying strategies during programming that deliver the best return on investment.</p>

<p>Community engagement is central to this project's success. We propose a multi-phase engagement strategy that includes public workshops, online surveys, targeted stakeholder interviews, and pop-up events at existing community locations to reach populations that may not attend traditional public meetings.</p>`,
      },
      {
        id: "section-approach",
        title: "Approach & Methodology",
        order: 4,
        content: `<p>Our design approach follows a structured yet flexible process that ensures quality, accountability, and client alignment at every phase.</p>

<p><strong>Pre-Design and Programming:</strong> We will conduct a comprehensive needs assessment including demographic analysis, program demand projections, and operational modeling. We will facilitate a minimum of four community engagement sessions, supplemented by an online survey platform. The programming phase will culminate in a detailed program document that establishes room-by-room requirements, adjacency preferences, and performance criteria.</p>

<p><strong>Schematic Design:</strong> We will explore multiple design concepts through iterative presentations. We use 3D modeling from day one, allowing stakeholders to visualize options in realistic context. Our SD package will include site plans, floor plans, building sections, exterior perspectives, and a preliminary cost estimate reconciled against the construction budget.</p>

<p><strong>Design Development:</strong> We will refine the selected concept into a coordinated design with structural, mechanical, electrical, and plumbing systems fully integrated. Our sustainability consultant will model energy performance and confirm the LEED Silver pathway. A detailed cost estimate at the DD milestone will provide confidence that the project remains on budget.</p>

<p><strong>Construction Documents:</strong> Documents will be produced using BIM (Revit) to ensure coordination across all disciplines. Our QA/QC process includes internal peer reviews at 50% and 90% CD milestones, constructability reviews, and a final code compliance check.</p>

<p><strong>Bidding and Construction Administration:</strong> We will assist in preparing bid packages, conducting pre-bid conferences, and evaluating bids. During construction, we will provide regular site observations, submittal reviews, RFI responses, change order evaluation, and payment application review. We maintain a structured CA process with documented site reports and a project issue log.</p>`,
      },
      {
        id: "section-team",
        title: "Team & Qualifications",
        order: 5,
        content: `<p>${companyName} has assembled a project team with direct, relevant experience in municipal recreation and community facility design.</p>

${
  teamMembers && teamMembers.length > 0
    ? teamMembers
        .map(
          (m) =>
            `<p><strong>${m.name}</strong> — ${m.title}${m.years_experience ? ` (${m.years_experience} years experience)` : ""}. ${m.bio || "Brings extensive experience to the team."}${m.certifications?.length ? ` Certifications: ${m.certifications.join(", ")}.` : ""}</p>`
        )
        .join("\n\n")
    : `<p><strong>${leadName}</strong> — ${leadTitle}. With over 20 years of experience in public sector architecture, will provide senior oversight and serve as the primary point of contact. Has led the design of eight community recreation facilities across California, including three LEED-certified projects. Holds a California architectural license and LEED AP BD+C credential.</p>

<p><strong>James Park, PE, SE</strong> — Structural Engineering Lead. Brings 15 years of experience in public facility structural design, including gymnasium and natatorium structures that require long-span solutions and specialized vibration analysis.</p>

<p><strong>Dr. Lisa Fernandez, LEED AP</strong> — Sustainability Director. Will lead the LEED certification effort and energy modeling. Has guided over 25 projects to successful LEED certification.</p>`
}

<p>Our team is supported by established subconsultant relationships with firms specializing in landscape architecture, civil engineering, MEP systems, acoustics, and food service design — all of whom have been pre-qualified for this ${projectType.toLowerCase()} project type.</p>`,
      },
      {
        id: "section-experience",
        title: "Relevant Experience",
        order: 6,
        content: `<p>${companyName} has a strong portfolio of completed projects directly relevant to this engagement.</p>

${
  pastProjects && pastProjects.length > 0
    ? pastProjects
        .slice(0, 5)
        .map(
          (p) =>
            `<p><strong>${p.name}</strong> — ${p.client}, ${p.location} (${p.year_completed}). $${(p.value / 1000000).toFixed(1)}M. ${p.description}</p>`
        )
        .join("\n\n")
    : `<p><strong>Oceanside Community Recreation Center</strong> — City of Oceanside, Oceanside, CA (2024). $15.2M. A 38,000 SF community recreation facility featuring a competition gymnasium, group fitness studios, senior activity center, and outdoor recreation terrace. Achieved LEED Gold certification and was delivered 2% under budget.</p>

<p><strong>San Marcos Family Services Center</strong> — City of San Marcos, San Marcos, CA (2023). $22M. A 52,000 SF multi-service facility combining early childhood education, after-school programming, workforce development, and community meeting spaces. Required coordination with multiple funding sources and licensing agencies.</p>

<p><strong>Temecula Civic Center Renovation & Expansion</strong> — City of Temecula, Temecula, CA (2022). $12.8M. A 28,000 SF renovation and 15,000 SF expansion adding a performing arts venue, public meeting rooms, and outdoor amphitheater. LEED Silver certified.</p>`
}

<p>Each of these projects was completed on time and within budget. References are available upon request.</p>`,
      },
      {
        id: "section-fee",
        title: "Fee Proposal",
        order: 7,
        content: `<p>${companyName} proposes a ${scopingData?.fee_structure || "Lump Sum / Fixed Fee"} for the complete scope of architectural and engineering services as described in the RFP.</p>

<p>Our fee is structured by phase as follows:</p>
<ul>
<li><strong>Pre-Design / Programming:</strong> 8% of total design fee</li>
<li><strong>Schematic Design:</strong> 15% of total design fee</li>
<li><strong>Design Development:</strong> 20% of total design fee</li>
<li><strong>Construction Documents:</strong> 35% of total design fee</li>
<li><strong>Bidding & Negotiation:</strong> 5% of total design fee</li>
<li><strong>Construction Administration:</strong> 17% of total design fee</li>
</ul>

<p><strong>Assumptions & Exclusions:</strong></p>
<ul>
<li>Fee is based on the scope of services described in the RFP</li>
<li>Reimbursable expenses (printing, travel, etc.) are estimated at 3% of fee and billed at cost</li>
<li>Additional services beyond the defined scope will be negotiated prior to commencement</li>
<li>Fee assumes timely client decisions and approvals at each milestone</li>
<li>Hazardous materials assessment, traffic studies, and environmental impact analysis are not included but can be provided as supplemental services</li>
</ul>

<p>Detailed fee amounts will be presented during the interview phase as requested in the RFP.</p>`,
      },
      {
        id: "section-schedule",
        title: "Project Schedule",
        order: 8,
        content: `<p>The following schedule outlines our proposed timeline aligned with the ${scopingData?.timeline || "24-month project duration"}.</p>

<ul>
<li><strong>Phase 1 — Pre-Design / Programming (Months 1-3):</strong> Community engagement workshops, needs assessment, site analysis, and program document development.</li>
<li><strong>Phase 2 — Schematic Design (Months 4-6):</strong> Concept development, design alternatives analysis, 3D renderings, and preliminary cost estimate.</li>
<li><strong>Phase 3 — Design Development (Months 7-9):</strong> Design refinement, structural and MEP systems integration, LEED pathway confirmation, and DD cost estimate.</li>
<li><strong>Phase 4 — Construction Documents (Months 10-12):</strong> Production of full construction drawing set and project manual. Includes 50% and 90% QA/QC reviews.</li>
<li><strong>Phase 5 — Bidding & Negotiation (Months 13-14):</strong> Pre-bid conference, addenda, bid evaluation, and contractor recommendation.</li>
<li><strong>Phase 6 — Construction Administration (Months 15-24):</strong> Construction observation, submittal reviews, RFI responses, and project closeout.</li>
</ul>

<p>This schedule includes appropriate review periods at each phase transition and allows for public presentation milestones. Bi-weekly client progress meetings will be held throughout design phases, with monthly schedule updates including variance reporting.</p>`,
      },
    ],
  }
}
