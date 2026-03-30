"use client"

import { useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EvaluationResult {
  score: number
  recommendation: "STRONG GO" | "CONDITIONAL GO" | "NO-GO"
  strengths: string[]
  risks: string[]
  missing_requirements: string[]
  win_probability: number
  estimated_hours: number
  project_value: number
  roi_analysis: string
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const strokeDashoffset = circumference - progress

  const color =
    score > 70
      ? "text-emerald-500"
      : score >= 40
        ? "text-amber-500"
        : "text-red-500"

  const strokeColor =
    score > 70
      ? "stroke-emerald-500"
      : score >= 40
        ? "stroke-amber-500"
        : "stroke-red-500"

  const bgStroke =
    score > 70
      ? "stroke-emerald-500/15"
      : score >= 40
        ? "stroke-amber-500/15"
        : "stroke-red-500/15"

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          className={bgStroke}
          strokeWidth="10"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          className={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-4xl font-bold tabular-nums", color)}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Fit Score
        </span>
      </div>
    </div>
  )
}

function RecommendationBadge({
  recommendation,
}: {
  recommendation: EvaluationResult["recommendation"]
}) {
  const config = {
    "STRONG GO": {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    },
    "CONDITIONAL GO": {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: AlertTriangle,
    },
    "NO-GO": {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
    },
  }

  const { color, icon: Icon } = config[recommendation]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2",
        color
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-lg font-bold tracking-wide">{recommendation}</span>
    </div>
  )
}

export default function EvaluatePage() {
  const [rfpText, setRfpText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleEvaluate() {
    if (!rfpText.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfp_text: rfpText }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Evaluation failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const startProposalUrl = `/proposals/new?rfp_text=${encodeURIComponent(rfpText)}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Go / No-Go Evaluation
        </h1>
        <p className="text-muted-foreground">
          Should your firm pursue this RFP? AI analyzes fit before you invest
          40+ hours.
        </p>
      </div>

      <Separator />

      {/* Input Section */}
      <Card>
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            RFP Analysis
          </CardTitle>
          <CardDescription className="text-slate-300">
            Paste the full RFP text below for a comprehensive fit evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Textarea
            placeholder="Paste the full RFP / solicitation text here. Include all sections, requirements, qualifications, and evaluation criteria for the most accurate assessment..."
            rows={10}
            value={rfpText}
            onChange={(e) => setRfpText(e.target.value)}
            className="font-mono text-sm"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {rfpText.length > 0
                ? `${rfpText.length.toLocaleString()} characters`
                : "Minimum 200 characters recommended for accurate analysis"}
            </p>
            <Button
              onClick={handleEvaluate}
              disabled={loading || rfpText.trim().length === 0}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing RFP...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Evaluate Fit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score & Recommendation */}
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center gap-4">
                <ScoreCircle score={result.score} />
                <RecommendationBadge recommendation={result.recommendation} />
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Win Probability
                    </p>
                    <p className="text-2xl font-bold tabular-nums">
                      {result.win_probability}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Effort
                    </p>
                    <p className="text-2xl font-bold tabular-nums">
                      {result.estimated_hours} hrs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Project Value
                    </p>
                    <p className="text-2xl font-bold tabular-nums">
                      ${(result.project_value / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Risks */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="bg-emerald-900 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-600 shrink-0" />
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-amber-900 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Risks
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {result.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
                      <span className="text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Missing Requirements */}
          {result.missing_requirements.length > 0 && (
            <Card>
              <CardHeader className="bg-red-900 text-white rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Missing Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {result.missing_requirements.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      <span className="text-sm">{m}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* ROI Analysis */}
          <Card>
            <CardHeader className="bg-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed">{result.roi_analysis}</p>
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-8">
            <Link
              href={startProposalUrl}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Start Proposal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Pass on This One
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
