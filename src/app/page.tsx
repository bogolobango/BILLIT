import Link from "next/link"
import {
  ArrowRight,
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  Target,
  Users,
  Clock,
  Check,
  Building2,
  Calculator,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0696d7]">
              <Building2 className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-gray-900">BILLIT</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900">How It Works</a>
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900">Features</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/proposals/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0696d7] px-4 text-sm font-medium text-white hover:bg-[#0580b8]">
              Try Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-14">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl leading-[1.15]">
              An RFP just hit your inbox.<br />
              <span className="text-gray-400">You have 2 weeks and no proposal team.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Paste your RFP. Get a complete, personalized proposal back — with your team, your projects, your voice. Ready to submit.
            </p>
            <div className="mt-8">
              <Link
                href="/proposals/new"
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0696d7] px-8 text-base font-semibold text-white shadow-sm hover:bg-[#0580b8]"
              >
                Generate Your First Proposal Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-sm text-gray-400">No credit card. No signup required to start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Paste. Review. Export. Done.
            </h2>
            <p className="mt-3 text-gray-600">
              Three steps from RFP to ready-to-submit proposal.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: FileText,
                step: "1",
                title: "Paste your RFP",
                desc: "Copy-paste the RFP, email, or project description. AI extracts requirements, deadlines, scope, and compliance needs in seconds.",
              },
              {
                icon: Sparkles,
                step: "2",
                title: "Review the draft",
                desc: "AI generates a complete proposal with your firm name, team bios, past projects, and fee structure. Regenerate any section with one click.",
              },
              {
                icon: Download,
                step: "3",
                title: "Export & submit",
                desc: "Download as Word or PDF. Done. What used to take your weekend now takes your lunch break.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0696d7] text-white text-sm font-bold">
                    {item.step}
                  </div>
                  <item.icon className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Not another generic AI tool.
            </h2>
            <p className="mt-3 text-gray-600">
              Built for how A/E firms actually write proposals. Not adapted from a marketing template.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Building2,
                title: "Your firm, not a template",
                desc: "AI references your actual team members, certifications, and past projects by name. The output reads like you wrote it — because it learned from your past proposals.",
              },
              {
                icon: ShieldCheck,
                title: "Compliance checklist",
                desc: "AI parses every requirement from the RFP — certifications, insurance, page limits, deadlines — and flags what you're missing before you submit.",
              },
              {
                icon: Target,
                title: "Go/No-Go scorecard",
                desc: "Before you spend 40 hours, paste the RFP and get a fit score. Is this worth pursuing? AI tells you based on your firm's track record.",
              },
              {
                icon: Users,
                title: "Website auto-import",
                desc: "Paste your firm URL. AI scrapes your team bios, project portfolio, and services — auto-fills your profile in seconds. No data entry.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0696d7]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <div className="inline-flex items-center gap-2 text-[#0696d7] mb-3">
              <Calculator className="h-5 w-5" />
              <span className="text-sm font-semibold">The Math</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Every proposal costs your firm $9,000 in staff time.
            </h2>
            <p className="mt-3 text-gray-600">
              At $150/hr and 60 hours per proposal, that&apos;s real money walking out the door on work you can&apos;t bill.
            </p>
          </div>

          <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-500">Without BILLIT</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">60 hrs</p>
              <p className="text-sm text-gray-500 mt-1">per proposal</p>
            </div>
            <div className="rounded-xl border border-[#0696d7] bg-blue-50 p-6 text-center shadow-sm ring-1 ring-[#0696d7]/20">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="h-4 w-4 text-[#0696d7]" />
                <span className="text-sm text-[#0696d7] font-medium">With BILLIT</span>
              </div>
              <p className="text-3xl font-bold text-[#0696d7]">2 hrs</p>
              <p className="text-sm text-gray-500 mt-1">per proposal</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-sm text-gray-500">You save</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">$8,700</p>
              <p className="text-sm text-gray-500 mt-1">per proposal</p>
            </div>
          </div>

          <p className="mx-auto max-w-lg text-center text-sm text-gray-500 mt-8">
            Do 15 proposals a year? That&apos;s $130K in staff time recovered. BILLIT pays for itself on your first proposal.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Your first proposal is free. Seriously.
            </h2>
            <p className="mt-3 text-gray-600">
              No credit card. No commitment. Pay per proposal after that.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$149",
                desc: "One proposal at a time",
                features: ["AI proposal generation", "RFP parsing & compliance matrix", "PDF + Word export", "1 user"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Professional",
                price: "$299",
                desc: "For firms that pursue multiple projects",
                features: ["Everything in Starter", "Firm voice matching", "Go/No-Go scorecard", "Website auto-import", "Win/loss analytics", "5 users"],
                cta: "Start Winning",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For firms with complex needs",
                features: ["Everything in Professional", "Unlimited users", "CRM / Deltek integration", "Custom templates", "Dedicated support", "API access"],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-6 ${
                  tier.highlighted
                    ? "border-[#0696d7] shadow-md ring-1 ring-[#0696d7]/20 relative"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-[#0696d7] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{tier.desc}</p>
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                  {tier.price !== "Custom" && <span className="text-sm text-gray-500"> / proposal</span>}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-[#0696d7] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/proposals/new"
                  className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium ${
                    tier.highlighted
                      ? "bg-[#0696d7] text-white hover:bg-[#0580b8]"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Your next RFP doesn&apos;t have to eat your weekend.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-600">
            Paste the RFP. Get the proposal. Keep designing.
          </p>
          <div className="mt-8">
            <Link
              href="/proposals/new"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0696d7] px-8 text-base font-semibold text-white shadow-sm hover:bg-[#0580b8]"
            >
              Generate Your First Proposal Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#0696d7]">
                <Building2 className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">BILLIT</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#how-it-works" className="hover:text-gray-900">How It Works</a>
              <a href="#features" className="hover:text-gray-900">Features</a>
              <a href="#pricing" className="hover:text-gray-900">Pricing</a>
              <Link href="/login" className="hover:text-gray-900">Sign In</Link>
            </div>
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BILLIT</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
