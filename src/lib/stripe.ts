// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-12-18.acacia",
// })

export interface CheckoutSession {
  id: string
  url: string
}

/**
 * Create a Stripe checkout session for a proposal purchase.
 *
 * MVP: Returns a mock session URL.
 * Production: Uncomment the Stripe API call below.
 */
export async function createCheckoutSession(
  proposalId: string,
  priceAmount: number
): Promise<CheckoutSession> {
  // --- Production implementation (uncomment when ready) ---
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name: "BILLIT Proposal Generation",
  //           description: `Proposal ID: ${proposalId}`,
  //         },
  //         unit_amount: priceAmount * 100, // Convert dollars to cents
  //       },
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "payment",
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposals/${proposalId}?payment=success`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposals/${proposalId}?payment=cancelled`,
  //   metadata: {
  //     proposal_id: proposalId,
  //   },
  // })
  //
  // return {
  //   id: session.id,
  //   url: session.url!,
  // }

  // --- MVP mock implementation ---
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: `cs_mock_${Date.now()}_${proposalId}`,
    url: `/proposals/${proposalId}?payment=success`,
  }
}
