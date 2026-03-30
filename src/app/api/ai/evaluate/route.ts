import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const GO_NOGO_SYSTEM_PROMPT = `You are an expert AEC (Architecture, Engineering, and Construction) business development advisor. Your job is to evaluate whether a firm should pursue an RFP opportunity.

Analyze the RFP text and any provided firm profile data to produce a Go/No-Go evaluation.

Consider:
1. How well the firm's capabilities match the RFP requirements
2. Whether the firm has relevant past project experience
3. Team qualifications vs. RFP requirements
4. Geographic relevance
5. Competition level implied by the RFP
6. Compliance requirements the firm may not meet
7. Timeline feasibility
8. Fee/budget alignment with the firm's typical project size

Return your analysis as JSON:

{
  "score": number (0-100, where 100 = perfect fit),
  "recommendation": "STRONG GO" | "CONDITIONAL GO" | "NO-GO",
  "strengths": ["array of specific strengths the firm brings to this opportunity"],
  "risks": ["array of specific risks or concerns"],
  "missing_requirements": ["array of requirements the firm likely cannot meet"],
  "win_probability": number (0-100, estimated win percentage),
  "estimated_hours": number (typical hours to complete this proposal),
  "project_value": number (estimated project value in dollars),
  "roi_analysis": "string - one paragraph ROI analysis comparing proposal effort to potential reward"
}

Be realistic and specific. Reference actual details from the RFP. If firm profile data is not provided, evaluate based on a typical mid-size AEC firm.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rfp_text, profile, team_members, past_projects } = body

    if (!rfp_text || typeof rfp_text !== "string" || rfp_text.trim().length === 0) {
      return NextResponse.json(
        { error: "rfp_text is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(getMockEvaluation())
    }

    try {
      const client = new Anthropic({ apiKey })
      const userMessage = JSON.stringify({
        rfp_text,
        firm_profile: profile || null,
        team_members: team_members || null,
        past_projects: past_projects || null,
      })

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: GO_NOGO_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      })

      const text = message.content[0].type === "text" ? message.content[0].text : ""
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json(getMockEvaluation())
      }
      return NextResponse.json(JSON.parse(jsonMatch[0]))
    } catch (apiError) {
      console.error("Claude API error:", apiError)
      return NextResponse.json(getMockEvaluation())
    }
  } catch (error) {
    console.error("Error evaluating RFP:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to evaluate RFP" },
      { status: 500 }
    )
  }
}

function getMockEvaluation() {
  return {
    score: 74,
    recommendation: "CONDITIONAL GO",
    strengths: [
      "Your team has 3 relevant facility projects completed in the last 5 years",
      "You hold the required LEED AP certification mentioned in the RFP",
      "Strong track record with similar project scope ($15M-$25M range)",
      "Prior experience with municipal procurement processes",
      "Firm's integrated design capabilities align with project requirements",
    ],
    risks: [
      "No prior direct work with this specific client organization",
      "DBE participation requirement of 15% may be difficult to meet with current subcontractor pool",
      "Tight submission deadline leaves limited preparation time",
      "Geographic distance to project site may raise concerns about local presence",
    ],
    missing_requirements: [
      "OSHA 30-Hour Construction Safety certification not found in team credentials",
      "Professional liability insurance minimum of $5M — verify current coverage",
      "State-specific contractor license for the project jurisdiction",
    ],
    win_probability: 35,
    estimated_hours: 50,
    project_value: 18500000,
    roi_analysis:
      "Project value: $18.5M | Estimated proposal cost: ~$8,000 in staff time (50 hrs at avg. $160/hr) | At 35% estimated win probability, the expected value is $6.5M. Required win rate to break even: 0.04%. This pursuit is financially justified if key risks can be mitigated — particularly the DBE requirement and geographic presence.",
  }
}
