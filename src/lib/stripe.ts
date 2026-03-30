export async function createCheckoutSession(
  proposalId: string,
  priceAmount: number
): Promise<{ url: string }> {
  // TODO: Replace with real Stripe integration
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items: [{
  //     price_data: {
  //       currency: "usd",
  //       product_data: { name: `BILLIT Proposal Export - ${proposalId}` },
  //       unit_amount: priceAmount * 100,
  //     },
  //     quantity: 1,
  //   }],
  //   mode: "payment",
  //   success_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposals/${proposalId}/export?success=true`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/proposals/${proposalId}/export?canceled=true`,
  //   metadata: { proposal_id: proposalId },
  // })

  // For MVP, return mock checkout URL
  return {
    url: `/proposals/${proposalId}?payment=success`,
  }
}
