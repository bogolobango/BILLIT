import { NextResponse } from "next/server"
import { generateProposal } from "@/lib/ai/generate-proposal"

export async function POST(request: Request) {
  try {
    const params = await request.json()
    const result = await generateProposal(params)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error generating proposal:", error)
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    )
  }
}
