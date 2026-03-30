"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion"
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
  ChevronRight,
} from "lucide-react"

// Animated counter hook
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!startOnView || !inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration, inView, startOnView])

  return { count, ref }
}

// Proposal typing animation content
const PROPOSAL_LINES = [
  { section: "Cover Letter", text: "Dear Selection Committee, Apex Design Group is pleased to submit our proposal for the Riverside Community Center..." },
  { section: "Executive Summary", text: "Our approach prioritizes community-driven design, environmental responsibility, and fiscal stewardship..." },
  { section: "Team & Qualifications", text: "Sarah Chen, AIA, LEED AP — 22 years leading complex municipal projects across 12 states..." },
  { section: "Relevant Experience", text: "Pasadena Community Center ($22M) — 38,000 SF, LEED Gold, 2% under budget..." },
  { section: "Fee Proposal", text: "Lump Sum: $985,000 — Schematic Design 15% | Design Development 20% | CD 35% | CA 20%..." },
  { section: "Compliance", text: "✓ Licensed Architect (CA) ✓ LEED AP BD+C ✓ $5M Professional Liability ✓ DBE 15% Plan..." },
]

function ProposalTypingAnimation() {
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!isTyping) return
    const line = PROPOSAL_LINES[currentLine]
    if (!line) { setCurrentLine(0); setCurrentChar(0); return }

    if (currentChar < line.text.length) {
      const timer = setTimeout(() => setCurrentChar(c => c + 1), 18)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        if (currentLine < PROPOSAL_LINES.length - 1) {
          setCurrentLine(l => l + 1)
          setCurrentChar(0)
        } else {
          setTimeout(() => { setCurrentLine(0); setCurrentChar(0) }, 2000)
        }
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [currentChar, currentLine, isTyping])

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl shadow-blue-500/10 overflow-hidden">
      {/* Editor chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-400 ml-2 font-mono">proposal-draft.billit</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#0696d7]" />
          <span className="text-xs text-[#0696d7] font-medium">AI Generating...</span>
        </div>
      </div>

      {/* Proposal content */}
      <div className="p-5 font-mono text-sm space-y-3 min-h-[280px]">
        {PROPOSAL_LINES.map((line, i) => {
          const isActive = i === currentLine
          const isDone = i < currentLine
          const isFuture = i > currentLine

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isFuture ? 0.15 : 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`${isFuture ? "blur-[1px]" : ""}`}
            >
              <div className="flex items-start gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                  isDone ? "bg-emerald-100 text-emerald-700" :
                  isActive ? "bg-blue-100 text-[#0696d7]" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {isDone ? "✓" : isActive ? "●" : "○"} {line.section}
                </span>
              </div>
              <p className={`mt-1 text-xs leading-relaxed ${isDone ? "text-gray-600" : isActive ? "text-gray-800" : "text-gray-300"}`}>
                {isActive ? line.text.slice(0, currentChar) : isDone ? line.text : line.text}
                {isActive && <span className="inline-block w-0.5 h-3.5 bg-[#0696d7] animate-pulse ml-0.5 -mb-0.5" />}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// 3D floating geometric shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating cube wireframe */}
      <motion.div
        className="absolute top-20 right-[10%] w-16 h-16 border-2 border-[#0696d7]/20 rounded-lg"
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      />
      {/* Floating sphere */}
      <motion.div
        className="absolute top-40 left-[8%] w-10 h-10 rounded-full bg-gradient-to-br from-[#0696d7]/20 to-cyan-400/20"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Triangle */}
      <motion.div
        className="absolute bottom-32 right-[15%] w-0 h-0"
        style={{ borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderBottom: "20px solid rgba(6,150,215,0.15)" }}
        animate={{ rotate: 360, y: [-5, 5, -5] }}
        transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      />
      {/* Dotted circle */}
      <motion.div
        className="absolute top-60 right-[5%] w-20 h-20 rounded-full border-2 border-dashed border-[#0696d7]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* Small squares */}
      <motion.div
        className="absolute bottom-48 left-[12%] w-6 h-6 rounded bg-gradient-to-br from-emerald-400/15 to-cyan-400/15"
        animate={{ rotate: 45, y: [-8, 8, -8] }}
        transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      />
    </div>
  )
}

// Section wrapper with scroll animation
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // ROI Calculator state
  const [hourlyRate, setHourlyRate] = useState(150)
  const [proposalsPerYear, setProposalsPerYear] = useState(15)
  const savedPerProposal = (hourlyRate * 58) // 60hrs - 2hrs = 58hrs saved
  const annualSavings = savedPerProposal * proposalsPerYear

  // Counters
  const hours = useCounter(60, 1500)
  const hoursAfter = useCounter(2, 1500)
  const savings = useCounter(8700, 2000)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0696d7]"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Building2 className="h-4 w-4 text-white" />
            </motion.div>
            <span className="text-base font-bold tracking-tight text-gray-900">BILLIT</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href="/proposals/new" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#0696d7] px-4 text-sm font-medium text-white hover:bg-[#0580b8] transition-colors">
                Try Free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="pt-14 relative">
        <FloatingShapes />

        {/* Animated gradient bg */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#0696d7]/5 to-cyan-400/5 blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 blur-3xl animate-pulse" style={{ animationDuration: "10s", animationDelay: "2s" }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] leading-[1.15]">
                  An RFP just hit your inbox.
                  <br />
                  <span className="text-gray-400">You have 2 weeks and no proposal team.</span>
                </h1>
              </motion.div>

              <motion.p
                className="mt-6 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Paste your RFP. Get a complete, personalized proposal back — with your team, your projects, your voice. Ready to submit.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/proposals/new"
                    className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0696d7] px-8 text-base font-semibold text-white shadow-lg shadow-[#0696d7]/20 hover:bg-[#0580b8] hover:shadow-[#0696d7]/30 transition-all"
                  >
                    Generate Your First Proposal Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <p className="text-sm text-gray-400 self-center">No credit card required.</p>
              </motion.div>
            </div>

            {/* Right - Animated Proposal */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotateY: 5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="hidden lg:block"
              style={{ perspective: "1000px" }}
            >
              <ProposalTypingAnimation />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Paste. Review. Export. Done.
              </h2>
              <p className="mt-3 text-gray-600">Three steps from RFP to ready-to-submit proposal.</p>
            </div>
          </AnimatedSection>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
            {[
              { icon: FileText, step: "1", title: "Paste your RFP", desc: "Copy-paste the RFP, email, or project description. AI extracts requirements, deadlines, scope, and compliance needs in seconds." },
              { icon: Sparkles, step: "2", title: "Review the draft", desc: "AI generates a complete proposal with your firm name, team bios, past projects, and fee structure. Regenerate any section with one click." },
              { icon: Download, step: "3", title: "Export & submit", desc: "Download as Word or PDF. Done. What used to take your weekend now takes your lunch break." },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <motion.div
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-full"
                  whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(6,150,215,0.15)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0696d7] text-white text-sm font-bold"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      {item.step}
                    </motion.div>
                    <item.icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Not another generic AI tool.</h2>
              <p className="mt-3 text-gray-600">Built for how A/E firms actually write proposals. Not adapted from a marketing template.</p>
            </div>
          </AnimatedSection>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
            {[
              { icon: Building2, title: "Your firm, not a template", desc: "AI references your actual team members, certifications, and past projects by name. The output reads like you wrote it.", color: "from-[#0696d7]/10 to-blue-400/10" },
              { icon: ShieldCheck, title: "Compliance checklist", desc: "AI parses every requirement from the RFP — certs, insurance, page limits, deadlines — and flags what you're missing.", color: "from-emerald-500/10 to-green-400/10" },
              { icon: Target, title: "Go/No-Go scorecard", desc: "Before you spend 40 hours, paste the RFP and get a fit score. AI tells you if it's worth pursuing.", color: "from-amber-500/10 to-orange-400/10" },
              { icon: Users, title: "Website auto-import", desc: "Paste your firm URL. AI scrapes your team bios, project portfolio, and services — auto-fills your profile in seconds.", color: "from-purple-500/10 to-indigo-400/10" },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <motion.div
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm group cursor-default"
                  whileHover={{ y: -3, borderColor: "rgba(6,150,215,0.3)" }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <item.icon className="h-5 w-5 text-[#0696d7]" />
                  </motion.div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator — Interactive */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <div className="inline-flex items-center gap-2 text-[#0696d7] mb-3">
                <Calculator className="h-5 w-5" />
                <span className="text-sm font-semibold">Calculate Your Savings</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Every proposal costs your firm real money.
              </h2>
              <p className="mt-3 text-gray-600">See how much you'd save. Adjust the numbers to match your firm.</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mx-auto max-w-3xl">
              {/* Interactive inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <label className="text-sm text-gray-500 block mb-2">Your average hourly rate</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">$</span>
                    <input
                      type="range"
                      min={75}
                      max={300}
                      value={hourlyRate}
                      onChange={e => setHourlyRate(Number(e.target.value))}
                      className="flex-1 accent-[#0696d7]"
                    />
                    <span className="text-lg font-bold text-gray-900 w-16 text-right">${hourlyRate}</span>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <label className="text-sm text-gray-500 block mb-2">Proposals per year</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={5}
                      max={50}
                      value={proposalsPerYear}
                      onChange={e => setProposalsPerYear(Number(e.target.value))}
                      className="flex-1 accent-[#0696d7]"
                    />
                    <span className="text-lg font-bold text-gray-900 w-12 text-right">{proposalsPerYear}</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-gray-500">Without BILLIT</span>
                  </div>
                  <motion.p className="text-3xl font-bold text-gray-900" key={hourlyRate}>
                    <span ref={hours.ref}>{hours.count}</span> hrs
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">${(hourlyRate * 60).toLocaleString()} per proposal</p>
                </div>
                <motion.div
                  className="rounded-xl border-2 border-[#0696d7] bg-blue-50 p-5 text-center shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <Sparkles className="h-4 w-4 text-[#0696d7]" />
                    <span className="text-xs text-[#0696d7] font-medium">With BILLIT</span>
                  </div>
                  <motion.p className="text-3xl font-bold text-[#0696d7]">
                    <span ref={hoursAfter.ref}>{hoursAfter.count}</span> hrs
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">${(hourlyRate * 2 + 149).toLocaleString()} per proposal</p>
                </motion.div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center shadow-sm">
                  <span className="text-xs text-emerald-600 font-medium">You save annually</span>
                  <motion.p
                    className="text-3xl font-bold text-emerald-600"
                    key={annualSavings}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ${annualSavings.toLocaleString()}
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">{proposalsPerYear} proposals × ${savedPerProposal.toLocaleString()} saved</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-gray-100 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Your first proposal is free. Seriously.
              </h2>
              <p className="mt-3 text-gray-600">No credit card. No commitment. Pay per proposal after that.</p>
            </div>
          </AnimatedSection>

          <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
            {[
              { name: "Starter", price: "$149", desc: "One proposal at a time", features: ["AI proposal generation", "RFP parsing & compliance", "PDF + Word export", "1 user"], cta: "Get Started", highlighted: false },
              { name: "Professional", price: "$299", desc: "For firms pursuing multiple projects", features: ["Everything in Starter", "Firm voice matching", "Go/No-Go scorecard", "Website auto-import", "Win/loss analytics", "5 users"], cta: "Start Winning", highlighted: true },
              { name: "Enterprise", price: "Custom", desc: "For firms with complex needs", features: ["Everything in Professional", "Unlimited users", "CRM / Deltek integration", "Custom templates", "Dedicated support", "API access"], cta: "Contact Sales", highlighted: false },
            ].map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.1}>
                <motion.div
                  className={`rounded-xl border p-6 h-full ${
                    tier.highlighted ? "border-[#0696d7] shadow-lg ring-1 ring-[#0696d7]/20 relative" : "border-gray-200 shadow-sm"
                  }`}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {tier.highlighted && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-[#0696d7] px-3 py-1 text-xs font-semibold text-white"
                      animate={{ boxShadow: ["0 0 0 0 rgba(6,150,215,0.4)", "0 0 0 8px rgba(6,150,215,0)", "0 0 0 0 rgba(6,150,215,0.4)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Most Popular
                    </motion.div>
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
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-[#0696d7] mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/proposals/new" className={`flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      tier.highlighted ? "bg-[#0696d7] text-white hover:bg-[#0580b8]" : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                      {tier.cta}
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b from-[#0696d7]/5 to-transparent blur-3xl" />
        </div>
        <AnimatedSection>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Your next RFP doesn&apos;t have to eat your weekend.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-gray-600">Paste the RFP. Get the proposal. Keep designing.</p>
            <motion.div className="mt-8" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/proposals/new" className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#0696d7] px-8 text-base font-semibold text-white shadow-lg shadow-[#0696d7]/20 hover:bg-[#0580b8] transition-all">
                Generate Your First Proposal Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
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
              <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
            </div>
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} BILLIT</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
