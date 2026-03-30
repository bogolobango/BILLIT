"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: 149,
    description: "For firms testing AI-powered proposals",
    features: [
      "AI proposal generation (Claude-powered)",
      "RFP parsing & compliance matrix",
      "PDF + Word export",
      "1 user",
      "Email support",
    ],
    cta: "Generate Proposal",
    popular: false,
  },
  {
    name: "Professional",
    price: 299,
    description: "For firms that win consistently",
    features: [
      "Everything in Starter",
      "Firm voice matching from past proposals",
      "Go/No-Go evaluation scorecard",
      "Website auto-import for firm profile",
      "Win/loss analytics & insights",
      "Team & project content library",
      "5 users",
      "Priority support",
    ],
    cta: "Start Winning",
    popular: true,
  },
  {
    name: "Enterprise",
    price: null,
    priceLabel: "Custom",
    description: "For large firms with complex needs",
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Custom proposal templates",
      "Deltek / CRM integration",
      "SF330 auto-import",
      "Advanced win/loss analytics",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Simple Per-Proposal Pricing</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Your first proposal is free. No credit card required.
          <br />After that, pay only when you generate.
        </p>
      </div>

      {/* Free first proposal banner */}
      <div className="bg-accent border border-blue-200 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-primary">Your First Proposal is Free</span>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Experience the full power of AI-generated AEC proposals — personalized to your firm, compliance-checked, ready to submit. No strings attached.
        </p>
        <Link href="/proposals/new">
          <Button className="mt-4" size="lg">
            Generate Free Proposal
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* ROI Calculator */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">60 hrs</p>
              <p className="text-sm text-muted-foreground mt-1">Average proposal effort</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">$9,000</p>
              <p className="text-sm text-muted-foreground mt-1">In non-billable staff time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">$8,700</p>
              <p className="text-sm text-muted-foreground mt-1">Saved per proposal with BILLIT</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(tier => (
          <Card key={tier.name} className={tier.popular ? "border-primary shadow-md relative ring-1 ring-primary/20" : "shadow-sm"}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="shadow-sm">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                {tier.price !== null ? (
                  <>
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-sm text-muted-foreground"> / proposal</span>
                  </>
                ) : (
                  <span className="text-4xl font-bold">{tier.priceLabel}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={tier.popular ? "default" : "outline"} size="lg">
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Firms typically spend $2,000–$5,000 per proposal in consultant fees.
          <br />
          BILLIT delivers the same quality at a fraction of the cost.
        </p>
        <p className="text-xs text-muted-foreground">
          Need a custom plan? <a href="mailto:hello@billit.ai" className="text-primary underline">Contact us</a>.
        </p>
      </div>
    </div>
  )
}
