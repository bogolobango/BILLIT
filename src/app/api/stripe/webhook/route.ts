import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.text()

    // TODO: Verify Stripe webhook signature
    // const sig = request.headers.get("stripe-signature")!
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    const event = JSON.parse(body)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const proposalId = session.metadata?.proposal_id

        if (proposalId) {
          // TODO: Update proposal record with payment info
          // await supabase.from("proposals").update({
          //   price_paid: session.amount_total / 100,
          //   stripe_payment_id: session.payment_intent,
          // }).eq("id", proposalId)
          console.log(`Payment completed for proposal: ${proposalId}`)
        }
        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    )
  }
}
