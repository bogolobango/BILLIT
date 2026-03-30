import Link from "next/link"
import {
  Clock,
  Target,
  FileX,
  Upload,
  PenLine,
  Download,
  Brain,
  ShieldCheck,
  MessageSquareQuote,
  Library,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react"

const painPoints = [
  {
    icon: Clock,
    stat: "40-80 Hours",
    description:
      "Average time AEC firms spend per proposal. That's non-billable time your team can't afford to waste.",
  },
  {
    icon: Target,
    stat: "23% Win Rate",
    description:
      "Industry average for proposal submissions. Most firms respond to too many RFPs they're not positioned to win.",
  },
  {
    icon: FileX,
    stat: "67% Recreated",
    description:
      "Of proposal content already exists somewhere in your firm. But finding and reusing it? That's the real challenge.",
  },
]

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your RFP",
    description:
      "Paste your RFP, email, or project description. Our AI extracts requirements, deadlines, and compliance needs.",
  },
  {
    number: "02",
    icon: PenLine,
    title: "Review & Customize",
    description:
      "AI generates a complete proposal using your firm's voice, past projects, and team credentials. Edit inline.",
  },
  {
    number: "03",
    icon: Download,
    title: "Export & Win",
    description:
      "Download as PDF or Word. Track status. Build your win rate over time.",
  },
]

const features = [
  {
    icon: Brain,
    title: "AEC-Specific AI",
    description:
      "Not a generic AI tool. Built with knowledge of scope phases, fee structures, deliverable types, and AEC terminology.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Matrix",
    description:
      "AI parses RFP requirements and flags what's met, what's missing, and what needs attention before you submit.",
  },
  {
    icon: MessageSquareQuote,
    title: "Your Firm's Voice",
    description:
      "Upload past winning proposals. AI learns your tone, approach, and how you describe your work.",
  },
  {
    icon: Library,
    title: "Smart Content Reuse",
    description:
      "Reference past projects and team credentials. AI weaves them into each new proposal naturally.",
  },
]

const pricingTiers = [
  {
    name: "Starter",
    price: 49,
    description: "For firms exploring AI-assisted proposals",
    features: [
      "Single proposal generation",
      "RFP parsing & scoping",
      "Compliance checklist",
      "PDF export",
      "Basic editing tools",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: 99,
    description: "For firms that need to win consistently",
    features: [
      "Everything in Starter",
      "Firm voice matching",
      "Team & project integration",
      "Word & PDF export",
      "Section regeneration",
      "Priority AI processing",
    ],
    cta: "Start Winning",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 149,
    description: "For firms pursuing high-value contracts",
    features: [
      "Everything in Professional",
      "Advanced compliance analysis",
      "Multi-proposal comparison",
      "Custom section templates",
      "Dedicated support",
      "API access",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-800/50 bg-[#0f172a]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-sm">
              B
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              BILLIT
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/40"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0f172a] pt-16">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Gradient orb */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-blue-600/10 blur-[128px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 lg:pb-40 lg:pt-40">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Proposal Generation for AEC
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              Generate AEC Proposals in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                60 Seconds
              </span>
              , Not 60 Hours
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              AI-powered proposal generation built specifically for Architecture,
              Engineering, and Construction firms. Upload your RFP, and get a
              personalized, compliance-checked proposal draft instantly.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/40 hover:translate-y-[-1px]"
              >
                Start Free Proposal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-slate-700 px-8 text-base font-semibold text-slate-300 transition-all hover:border-slate-500 hover:text-white"
              >
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex flex-col items-center gap-4 border-t border-slate-800 pt-8">
              <p className="text-sm text-slate-500">
                Trusted by architecture, engineering, and construction firms
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-xs text-slate-500">Proposals Generated</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3.2x</div>
                  <div className="text-xs text-slate-500">Faster Than Manual</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">41%</div>
                  <div className="text-xs text-slate-500">Avg Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="relative bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              The Problem
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AEC Proposals Are Broken
            </p>
            <p className="mt-4 text-lg text-slate-600">
              Your firm wins on expertise, not on paperwork. But the industry
              hasn&apos;t caught up.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {painPoints.map((point) => (
              <div
                key={point.stat}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <point.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-3xl font-bold text-slate-900">
                  {point.stat}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              How It Works
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three Steps to a Winning Proposal
            </p>
            <p className="mt-4 text-lg text-slate-600">
              From RFP to polished proposal in minutes, not days.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-16 hidden h-px w-6 bg-slate-300 lg:block" style={{ right: "-12px" }} />
                )}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:shadow-lg hover:border-blue-200">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-4xl font-bold text-blue-100">
                      {step.number}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative bg-[#0f172a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Features
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for AEC, Not Adapted From Generic AI
            </p>
            <p className="mt-4 text-lg text-slate-400">
              Every feature is designed around how architecture, engineering, and
              construction firms actually create proposals.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-blue-800/50 hover:bg-slate-800/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Pricing
            </h2>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pay Per Proposal, Not Per Seat
            </p>
            <p className="mt-4 text-lg text-slate-600">
              No subscriptions. No commitments. Pay only when you generate a
              proposal.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 transition-all ${
                  tier.highlighted
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-600/10 ring-1 ring-blue-600 scale-[1.02]"
                    : "border-slate-200 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {tier.description}
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    ${tier.price}
                  </span>
                  <span className="text-sm text-slate-500"> / proposal</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden bg-[#0f172a] py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stop Losing Proposals to Firms With Better Marketing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Your expertise wins projects. Let AI handle the paperwork.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-600/40 hover:translate-y-[-1px]"
            >
              Generate Your First Proposal Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-xs">
                B
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                BILLIT
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                How It Works
              </a>
              <Link
                href="/login"
                className="text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                Sign In
              </Link>
            </div>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} BILLIT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
