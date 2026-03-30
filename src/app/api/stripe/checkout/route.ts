import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { proposal_id, amount } = await request.json()

    if (!proposal_id) {
      return NextResponse.json(
        { error: "proposal_id is required" },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession(proposal_id, amount || 99)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
