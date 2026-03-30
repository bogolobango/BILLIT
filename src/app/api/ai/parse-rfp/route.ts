import { NextResponse } from "next/server"
import { parseRFP } from "@/lib/ai/parse-rfp"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { rfp_text } = body

    if (!rfp_text || typeof rfp_text !== "string" || rfp_text.trim().length === 0) {
      return NextResponse.json(
        { error: "rfp_text is required and must be a non-empty string" },
        { status: 400 }
      )
    }

    const result = await parseRFP(rfp_text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error parsing RFP:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to parse RFP" },
      { status: 500 }
    )
  }
}
