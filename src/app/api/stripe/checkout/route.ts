import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { proposal_id, price_amount } = body as {
      proposal_id: string
      price_amount: number
    }

    if (!proposal_id) {
      return NextResponse.json(
        { error: "proposal_id is required" },
        { status: 400 }
      )
    }

    if (!price_amount || price_amount <= 0) {
      return NextResponse.json(
        { error: "price_amount must be a positive number" },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession(proposal_id, price_amount)

    return NextResponse.json({ url: session.url, session_id: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 }
    )
  }
}
