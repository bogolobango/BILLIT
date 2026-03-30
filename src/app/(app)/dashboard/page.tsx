"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  FileText,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Trophy,
  DollarSign,
  Lightbulb,
  X,
  ChevronDown,
} from "lucide-react"
import type { ProposalStatus } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface MockProposal {
  id: string
  title: string
  client_name: string
  project_type: string
  status: ProposalStatus
  generated_at: string
  price_paid: number | null
  estimated_value: number
}

interface FeedbackEntry {
  proposalId: string
  outcome: "won" | "lost"
  reasons: string[]
  notes: string
}

const INITIAL_PROPOSALS: MockProposal[] = [
  {
    id: "1",
    title: "Metro Regional Ambulatory Care Center",
    client_name: "Metro Regional Medical Center",
    project_type: "Healthcare",
    status: "sent",
    generated_at: "2026-03-28",
    price_paid: 99,
    estimated_value: 1200000,
  },
  {
    id: "2",
    title: "Westbrook Elementary School Renovation",
    client_name: "Portland Public Schools",
    project_type: "Education",
    status: "won",
    generated_at: "2026-03-20",
    price_paid: 99,
    estimated_value: 4500000,
  },
  {
    id: "3",
    title: "Harbor View Mixed-Use Development",
    client_name: "Waterfront Development LLC",
    project_type: "Mixed-Use",
    status: "draft",
    generated_at: "2026-03-29",
    price_paid: null,
    estimated_value: 8200000,
  },
  {
    id: "4",
    title: "Central Library Seismic Upgrade",
    client_name: "Multnomah County",
    project_type: "Public/Government",
    status: "lost",
    generated_at: "2026-03-10",
    price_paid: 99,
    estimated_value: 3100000,
  },
  {
    id: "5",
    title: "Cascade Corporate Campus",
    client_name: "TechNorth Inc.",
    project_type: "Commercial",
    status: "won",
    generated_at: "2026-02-28",
    price_paid: 149,
    estimated_value: 15000000,
  },
  {
    id: "6",
    title: "Greenfield Solar Farm Infrastructure",
    client_name: "Pacific Renewables",
    project_type: "Renewable Energy",
    status: "sent",
    generated_at: "2026-03-25",
    price_paid: 99,
    estimated_value: 2800000,
  },
  {
    id: "7",
    title: "Riverdale Senior Living Facility",
    client_name: "Golden Years Communities",
    project_type: "Healthcare",
    status: "review",
    generated_at: "2026-03-27",
    price_paid: null,
    estimated_value: 6400000,
  },
  {
    id: "8",
    title: "Interstate Bridge Widening Study",
    client_name: "ODOT",
    project_type: "Infrastructure",
    status: "won",
    generated_at: "2026-02-15",
    price_paid: 149,
    estimated_value: 950000,
  },
]

const statusConfig: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  review: { label: "In Review", variant: "warning" },
  sent: { label: "Sent", variant: "default" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
}

const ALL_STATUSES: ProposalStatus[] = ["draft", "review", "sent", "won", "lost"]

const WON_REASONS = [
  "Strong relationships",
  "Competitive pricing",
  "Technical approach",
  "Team qualifications",
  "Past experience match",
  "Proposal quality",
]

const LOST_REASONS = [
  "Price too high",
  "Lacked experience",
  "Weak relationships",
  "Better competitor",
  "Scope mismatch",
  "Late submission",
  "Missing requirements",
]

export default function DashboardPage() {
  const supabase = createClient()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [proposals, setProposals] = useState<MockProposal[]>(INITIAL_PROPOSALS)

  useEffect(() => {
    async function loadProposals() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        if (url.includes("placeholder")) return // Keep mock data in dev mode

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("proposals")
          .select()
          .eq("profile_id", user.id)
          .order("generated_at", { ascending: false })

        if (data?.length) {
          setProposals(data.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            title: p.title as string,
            client_name: p.client_name as string,
            project_type: p.project_type as string,
            status: (p.status as ProposalStatus) || "draft",
            generated_at: p.generated_at as string,
            price_paid: p.price_paid as number | null,
            estimated_value: 0,
          })))
        }
      } catch {
        // Fallback to mock data
      }
    }

    loadProposals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Feedback dialog state
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackProposal, setFeedbackProposal] = useState<MockProposal | null>(null)
  const [feedbackOutcome, setFeedbackOutcome] = useState<"won" | "lost">("won")
  const [feedbackReasons, setFeedbackReasons] = useState<string[]>([])
  const [feedbackNotes, setFeedbackNotes] = useState("")

  // Status dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Feedback storage and insight banner
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([])
  const [showInsightBanner, setShowInsightBanner] = useState(false)

  const handleStatusChange = (proposal: MockProposal, newStatus: ProposalStatus) => {
    setOpenDropdownId(null)

    // Update locally immediately
    setProposals(prev =>
      prev.map(p => p.id === proposal.id ? { ...p, status: newStatus } : p)
    )

    // Persist to Supabase
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
      if (!url.includes("placeholder")) {
        supabase.from("proposals").update({ status: newStatus }).eq("id", proposal.id).then()
      }
    } catch {
      // Silent fail
    }

    if (newStatus === "won" || newStatus === "lost") {
      setFeedbackProposal(proposal)
      setFeedbackOutcome(newStatus)
      setFeedbackReasons([])
      setFeedbackNotes("")
      setFeedbackDialogOpen(true)
    }
  }

  const toggleFeedbackReason = (reason: string) => {
    setFeedbackReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    )
  }

  const handleSaveFeedback = () => {
    if (feedbackProposal) {
      setFeedbackEntries(prev => [
        ...prev,
        {
          proposalId: feedbackProposal.id,
          outcome: feedbackOutcome,
          reasons: feedbackReasons,
          notes: feedbackNotes,
        },
      ])
    }
    setFeedbackDialogOpen(false)
    setShowInsightBanner(true)
  }

  const filtered = proposals.filter(p => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || p.status === filter
    return matchesSearch && matchesFilter
  })

  const totalProposals = proposals.length
  const wonCount = proposals.filter(p => p.status === "won").length
  const lostCount = proposals.filter(p => p.status === "lost").length
  const winRate = wonCount + lostCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0
  const activeDrafts = proposals.filter(p => p.status === "draft" || p.status === "review").length
  const revenueWon = proposals.filter(p => p.status === "won").reduce((sum, p) => sum + p.estimated_value, 0)

  // Compute insight text from proposals data
  const getInsightText = () => {
    const wonProposals = proposals.filter(p => p.status === "won")
    const lostProposals = proposals.filter(p => p.status === "lost")
    const allDecided = [...wonProposals, ...lostProposals]
    if (allDecided.length < 2) return null

    const typeStats: Record<string, { won: number; total: number }> = {}
    for (const p of allDecided) {
      if (!typeStats[p.project_type]) typeStats[p.project_type] = { won: 0, total: 0 }
      typeStats[p.project_type].total++
      if (p.status === "won") typeStats[p.project_type].won++
    }

    const entries = Object.entries(typeStats).filter(([, s]) => s.total > 0)
    if (entries.length < 2) return null

    entries.sort((a, b) => (b[1].won / b[1].total) - (a[1].won / a[1].total))
    const best = entries[0]
    const worst = entries[entries.length - 1]
    const bestRate = Math.round((best[1].won / best[1].total) * 100)
    const worstRate = Math.round((worst[1].won / worst[1].total) * 100)

    return `You win ${bestRate}% of ${best[0]} projects but only ${worstRate}% of ${worst[0]} projects. Consider focusing pursuits on ${best[0]}.`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your proposals and track your win rate</p>
        </div>
        <Link href="/proposals/new">
          <Button size="lg">
            <Plus className="h-4 w-4" />
            New Proposal
          </Button>
        </Link>
      </div>

      {/* Win Insights Banner */}
      {showInsightBanner && getInsightText() && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900">Your Win Insights</p>
                <p className="text-sm text-amber-800 mt-0.5">{getInsightText()}</p>
              </div>
              <button
                onClick={() => setShowInsightBanner(false)}
                className="shrink-0 rounded-sm p-1 text-amber-600 hover:text-amber-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
                <p className="text-3xl font-bold">{totalProposals}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-3xl font-bold">{winRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Drafts</p>
                <p className="text-3xl font-bold">{activeDrafts}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Won</p>
                <p className="text-3xl font-bold">${(revenueWon / 1000000).toFixed(1)}M</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Proposals</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All ({proposals.length})</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="won">Won</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No proposals match your filter</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(proposal => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Link
                    href={`/proposals/${proposal.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{proposal.title}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{proposal.client_name}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{proposal.project_type}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{proposal.generated_at}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    {/* Status dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setOpenDropdownId(openDropdownId === proposal.id ? null : proposal.id)
                        }}
                        className="inline-flex items-center gap-1"
                      >
                        <Badge variant={statusConfig[proposal.status].variant} className="cursor-pointer">
                          {statusConfig[proposal.status].label}
                          <ChevronDown className="h-3 w-3 ml-0.5" />
                        </Badge>
                      </button>
                      {openDropdownId === proposal.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 z-50 bg-background border rounded-md shadow-lg py-1 min-w-[120px]">
                            {ALL_STATUSES.map(status => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleStatusChange(proposal, status)
                                }}
                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors ${
                                  proposal.status === status ? "font-semibold bg-muted/50" : ""
                                }`}
                              >
                                {statusConfig[status].label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${(proposal.estimated_value / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-muted-foreground">est. value</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Win/Loss Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {feedbackOutcome === "won" ? "Congratulations on the win!" : "Sorry about the loss"}
            </DialogTitle>
            <DialogDescription>
              Help improve your future proposals by sharing feedback on{" "}
              <span className="font-medium text-foreground">{feedbackProposal?.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">What was the primary reason?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(feedbackOutcome === "won" ? WON_REASONS : LOST_REASONS).map(reason => (
                  <label
                    key={reason}
                    className="flex items-center gap-2 rounded-md border p-2.5 cursor-pointer hover:bg-accent/50 transition-colors text-sm"
                  >
                    <Checkbox
                      checked={feedbackReasons.includes(reason)}
                      onCheckedChange={() => toggleFeedbackReason(reason)}
                    />
                    {reason}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Any additional notes?</p>
              <Textarea
                placeholder="Optional — share any details that could help with future proposals..."
                value={feedbackNotes}
                onChange={e => setFeedbackNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Skip
            </Button>
            <Button onClick={handleSaveFeedback}>
              <Trophy className="h-4 w-4" />
              Save Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
