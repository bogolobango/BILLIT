import { NextResponse } from "next/server"
import { generateProposal } from "@/lib/ai/generate-proposal"
import type { ScopingData, Profile, TeamMember, PastProject } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      rfp_text,
      scoping_data,
      profile,
      team_members,
      past_projects,
      past_proposal_texts,
    } = body as {
      rfp_text: string
      scoping_data: ScopingData
      profile: Profile
      team_members: TeamMember[]
      past_projects: PastProject[]
      past_proposal_texts: string[]
    }

    if (!rfp_text || !scoping_data || !profile) {
      return NextResponse.json(
        { error: "rfp_text, scoping_data, and profile are required" },
        { status: 400 }
      )
    }

    const result = await generateProposal({
      rfpText: rfp_text,
      scopingData: scoping_data,
      profile,
      teamMembers: team_members || [],
      pastProjects: past_projects || [],
      pastProposalTexts: past_proposal_texts || [],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate proposal",
      },
      { status: 500 }
    )
  }
}
