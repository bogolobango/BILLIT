"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for trying out AI-generated proposals",
    features: [
      "Basic AI proposal generation",
      "PDF export",
      "1 user",
      "Standard RFP parsing",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: 99,
    description: "For firms that win consistently",
    features: [
      "Advanced AI with firm personalization",
      "PDF + Word export",
      "Compliance checking & matrix",
      "Past proposal voice matching",
      "Team member & project library",
      "3 users",
      "Priority support",
    ],
    cta: "Start Winning",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 149,
    description: "For large firms with complex needs",
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Custom proposal templates",
      "Advanced analytics & win tracking",
      "API access",
      "Dedicated account manager",
      "Custom integrations (CRM, Deltek)",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground mt-1">
          Pay per proposal. No monthly commitment. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map(tier => (
          <Card key={tier.name} className={tier.popular ? "border-primary shadow-lg relative" : ""}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-sm text-muted-foreground"> / proposal</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                {tier.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          All plans include a free first proposal to try the platform.
          <br />
          Need a custom plan? <a href="mailto:hello@billit.ai" className="text-primary underline">Contact us</a>.
        </p>
      </div>
    </div>
  )
}
