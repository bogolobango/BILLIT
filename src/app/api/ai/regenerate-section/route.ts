import Anthropic from "@anthropic-ai/sdk"
import { SECTION_REGENERATE_SYSTEM_PROMPT } from "@/lib/ai/prompts"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { section_title, current_content, feedback, rfp_text } = body

    if (!section_title || !current_content) {
      return NextResponse.json(
        { error: "section_title and current_content are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // Mock fallback
      const revisedContent = `<p><em><strong>REVISED</strong> — Updated based on feedback: "${feedback || "general improvement"}"</em></p>${current_content}`
      return NextResponse.json({ section_title, content: revisedContent })
    }

    const client = new Anthropic({ apiKey })
    const userMessage = JSON.stringify({
      section_title,
      current_content,
      feedback: feedback || "Improve this section",
      rfp_context: rfp_text?.slice(0, 2000) || "",
    })

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SECTION_REGENERATE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""

    // Try JSON parse first (prompt asks for JSON)
    try {
      const parsed = JSON.parse(text)
      return NextResponse.json({ section_title, content: parsed.content || text })
    } catch {
      // Plain text — wrap paragraphs in <p> tags
      const formatted = text
        .split(/\n\n+/)
        .map((p: string) => `<p>${p.trim()}</p>`)
        .join("\n")
      return NextResponse.json({ section_title, content: formatted })
    }
  } catch (error) {
    console.error("Error regenerating section:", error)
    return NextResponse.json(
      { error: "Failed to regenerate section" },
      { status: 500 }
    )
  }
}
