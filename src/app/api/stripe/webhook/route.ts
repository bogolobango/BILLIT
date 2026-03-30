import { NextResponse } from "next/server"
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-12-18.acacia",
// })

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      )
    }

    // --- Production implementation (uncomment when ready) ---
    // let event: Stripe.Event
    // try {
    //   event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    // } catch (err) {
    //   console.error("Webhook signature verification failed:", err)
    //   return NextResponse.json(
    //     { error: "Invalid signature" },
    //     { status: 400 }
    //   )
    // }
    //
    // switch (event.type) {
    //   case "checkout.session.completed": {
    //     const session = event.data.object as Stripe.Checkout.Session
    //     const proposalId = session.metadata?.proposal_id
    //     if (proposalId) {
    //       // Update proposal payment status in database
    //       // await supabase
    //       //   .from("proposals")
    //       //   .update({
    //       //     price_paid: session.amount_total ? session.amount_total / 100 : null,
    //       //     stripe_payment_id: session.payment_intent as string,
    //       //   })
    //       //   .eq("id", proposalId)
    //       console.log(`Payment completed for proposal ${proposalId}`)
    //     }
    //     break
    //   }
    //   case "checkout.session.expired": {
    //     const session = event.data.object as Stripe.Checkout.Session
    //     console.log(`Checkout expired for session ${session.id}`)
    //     break
    //   }
    //   default:
    //     console.log(`Unhandled event type: ${event.type}`)
    // }

    // --- MVP stub implementation ---
    const event = JSON.parse(body)

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data?.object
        const proposalId = session?.metadata?.proposal_id
        if (proposalId) {
          // TODO: Update proposal record with payment info in database
          console.log(`Payment completed for proposal: ${proposalId}`)
        }
        break
      }
      case "checkout.session.expired": {
        console.log(`Checkout session expired: ${event.data?.object?.id}`)
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
      { status: 500 }
    )
  }
}
