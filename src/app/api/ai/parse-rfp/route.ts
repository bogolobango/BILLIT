import { NextResponse } from "next/server"
import { parseRFP } from "@/lib/ai/parse-rfp"

export async function POST(request: Request) {
  try {
    const { rfp_text } = await request.json()

    if (!rfp_text || typeof rfp_text !== "string") {
      return NextResponse.json(
        { error: "rfp_text is required" },
        { status: 400 }
      )
    }

    const result = await parseRFP(rfp_text)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error parsing RFP:", error)
    return NextResponse.json(
      { error: "Failed to parse RFP" },
      { status: 500 }
    )
  }
}
