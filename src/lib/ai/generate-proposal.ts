import Anthropic from "@anthropic-ai/sdk"
import { PROPOSAL_GENERATE_SYSTEM_PROMPT } from "./prompts"
import type {
  ScopingData,
  Profile,
  TeamMember,
  PastProject,
  ProposalContent,
} from "@/lib/types"

export interface GenerateProposalParams {
  rfpText: string
  scopingData: ScopingData
  profile: Profile
  teamMembers: TeamMember[]
  pastProjects: PastProject[]
  pastProposalTexts: string[]
}

export async function generateProposal(
  params: GenerateProposalParams
): Promise<ProposalContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY not set — returning mock data")
    return getMockResult(params)
  }

  try {
    const client = new Anthropic({ apiKey })
    const userMessage = JSON.stringify({
      rfp_text: params.rfpText,
      scoping_data: params.scopingData,
      profile: params.profile,
      team_members: params.teamMembers,
      past_projects: params.pastProjects,
      past_proposal_samples: params.pastProposalTexts,
    })

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: PROPOSAL_GENERATE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("No JSON found in Claude response:", text.slice(0, 200))
      return getMockResult(params)
    }

    const parsed = JSON.parse(jsonMatch[0]) as ProposalContent

    // Ensure sections have proper HTML formatting
    if (parsed.sections) {
      parsed.sections = parsed.sections.map((section) => ({
        ...section,
        content: formatSectionContent(section.content),
      }))
    }

    return parsed
  } catch (error) {
    console.error("Claude API error in generateProposal:", error)
    return getMockResult(params)
  }
}

function formatSectionContent(content: string): string {
  // If content already has HTML tags, return as-is
  if (content.includes("<p>") || content.includes("<ul>")) {
    return content
  }
  // Convert plain text paragraphs to HTML
  return content
    .split(/\n\n+/)
    .map((para) => `<p>${para.trim()}</p>`)
    .join("\n")
}

function getMockResult(params: GenerateProposalParams): ProposalContent {
  const companyName = params.profile?.company_name || "Apex Design Group"
  const clientName = params.scopingData?.client_name || "the client"
  const clientContact = params.scopingData?.client_contact || "Selection Committee"
  const location = params.scopingData?.location || "the project site"
  const description = params.scopingData?.description || "the proposed project"
  const leadName = params.teamMembers?.[0]?.name || "Sarah Mitchell, AIA, LEED AP"
  const leadTitle = params.teamMembers?.[0]?.title || "Principal-in-Charge"

  return {
    sections: [
      {
        id: "cover-letter",
        title: "Cover Letter",
        order: 1,
        content: `<p>Dear ${clientContact},</p>
<p>${companyName} is pleased to submit our qualifications and proposal for the ${description}. We have reviewed the RFP thoroughly and are excited by the opportunity to bring our extensive experience to this important project in ${location}.</p>
<p>Our firm brings over two decades of experience designing similar facilities. We understand that this project is more than a building — it is a civic investment in the community. Our approach combines rigorous technical expertise with a deep commitment to stakeholder engagement.</p>
<p>We look forward to the opportunity to discuss our approach in greater detail.</p>
<p>Sincerely,<br/>${leadName}<br/>${leadTitle}, ${companyName}</p>`,
      },
      {
        id: "executive-summary",
        title: "Executive Summary",
        order: 2,
        content: `<p>${companyName} proposes a comprehensive design approach for the ${description} that prioritizes functional excellence, sustainability, and long-term value for ${clientName}.</p>
<p>Our approach is built on three core principles:</p>
<ul>
<li><strong>Community-Driven Design:</strong> Extensive stakeholder engagement to ensure the facility reflects real community needs.</li>
<li><strong>Environmental Responsibility:</strong> Sustainable design strategies targeting LEED certification while reducing operational costs by 15-25%.</li>
<li><strong>Fiscal Stewardship:</strong> We design to the budget, not around it — our track record includes consistent on-budget delivery.</li>
</ul>`,
      },
      {
        id: "understanding",
        title: "Understanding of Project",
        order: 3,
        content: `<p>${clientName} seeks a design partner for the ${description} in ${location}. Based on our review of the RFP and our experience with similar projects, we have identified the following key drivers:</p>
<ul>
<li><strong>Functional Efficiency:</strong> The facility must support diverse programming while accommodating future growth.</li>
<li><strong>Code Compliance:</strong> All design work must comply with applicable building codes, accessibility requirements, and industry regulations.</li>
<li><strong>Budget Discipline:</strong> Design decisions must balance quality with responsible cost management.</li>
<li><strong>Sustainability Goals:</strong> Achieving certification targets while maintaining operational efficiency.</li>
</ul>
<p>Our team has specific experience addressing each of these drivers and will bring proven strategies to ensure success.</p>`,
      },
      {
        id: "approach",
        title: "Approach & Methodology",
        order: 4,
        content: `<p>Our design approach follows a structured yet flexible process that ensures quality and accountability at every phase:</p>
${(params.scopingData?.scope_phases || ["Schematic Design", "Design Development", "Construction Documents"]).map(phase =>
  `<p><strong>${phase}:</strong> We will execute this phase with rigorous coordination, regular client check-ins, and milestone-based quality reviews. Our QA process includes code compliance verification, constructability review, and cost alignment at each gate.</p>`
).join("\n")}
<p>This disciplined approach has helped us maintain a 95% on-budget delivery rate across our portfolio.</p>`,
      },
      {
        id: "team",
        title: "Team & Qualifications",
        order: 5,
        content: `<p>${companyName} will assign a dedicated project team with deep expertise:</p>
${params.teamMembers?.length > 0
  ? params.teamMembers.map(m => `<p><strong>${m.name} — ${m.title}</strong><br/>${m.bio || `${m.years_experience || 15}+ years of experience.`} ${m.certifications?.length ? `Certifications: ${m.certifications.join(", ")}.` : ""}</p>`).join("\n")
  : `<p><strong>${leadName} — ${leadTitle}</strong><br/>22 years of experience leading complex projects. Licensed Architect, LEED AP BD+C.</p>
<p><strong>Jennifer Walsh — Project Manager</strong><br/>15 years of project management experience with a focus on institutional projects. PMP, AIA.</p>
<p><strong>David Kim — Design Lead</strong><br/>Award-winning designer with 12 years of experience. AIA, WELL AP.</p>`
}`,
      },
      {
        id: "experience",
        title: "Relevant Experience",
        order: 6,
        content: `<p>${companyName} has completed projects directly relevant to this engagement:</p>
${params.pastProjects?.length > 0
  ? params.pastProjects.map(p => `<p><strong>${p.name}</strong><br/>Client: ${p.client} | Location: ${p.location} | Value: $${(p.value / 1000000).toFixed(1)}M<br/>${p.description}</p>`).join("\n")
  : `<p><strong>Regional Community Center — City of Pasadena</strong><br/>$22M | 38,000 SF community recreation center with gymnasium, aquatics center, and community rooms. LEED Gold. On time, 2% under budget.</p>
<p><strong>Westside Recreation Complex — Los Angeles County</strong><br/>$15M | 28,000 SF multi-generational recreation facility. Achieved LEED Silver. Extensive community engagement process.</p>
<p><strong>Valley Youth Center — City of Fresno</strong><br/>$9M | 18,000 SF youth and family center with outdoor amphitheater and playground. ADA-compliant design.</p>`
}`,
      },
      {
        id: "fee",
        title: "Fee Proposal",
        order: 7,
        content: `<p>We propose a ${params.scopingData?.fee_structure || "Lump Sum"} for the complete scope of services:</p>
<p>${params.scopingData?.estimated_fee_min && params.scopingData?.estimated_fee_max
  ? `<strong>Proposed Fee Range: $${(params.scopingData.estimated_fee_min / 1000).toFixed(0)}K – $${(params.scopingData.estimated_fee_max / 1000).toFixed(0)}K</strong>`
  : "<strong>Fee to be determined based on final scope confirmation.</strong>"
}</p>
<p><strong>Assumptions:</strong></p>
<ul>
<li>Fee based on scope of services described in the RFP</li>
<li>Reimbursable expenses estimated at 3% of fee, billed at cost</li>
<li>Additional services beyond defined scope negotiated prior to commencement</li>
<li>Fee assumes timely client decisions at each milestone</li>
</ul>`,
      },
      {
        id: "schedule",
        title: "Project Schedule",
        order: 8,
        content: `<p>We propose the following milestone-based schedule aligned with the ${params.scopingData?.timeline || "project"} timeline:</p>
${(params.scopingData?.milestones || [{ name: "Project Kickoff", date: "TBD" }, { name: "Design Complete", date: "TBD" }, { name: "Construction Complete", date: "TBD" }])
  .map(m => `<p><strong>${m.name}:</strong> ${m.date}</p>`).join("\n")}
<p><strong>Schedule Commitments:</strong></p>
<ul>
<li>Bi-weekly client progress meetings throughout design</li>
<li>Phase completion reviews with 5 business days for client feedback</li>
<li>Monthly schedule updates with variance reporting</li>
</ul>`,
      },
    ],
  }
}
