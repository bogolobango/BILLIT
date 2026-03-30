"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FileText,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Trophy,
  DollarSign,
} from "lucide-react"
import type { ProposalStatus } from "@/lib/types"

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

const MOCK_PROPOSALS: MockProposal[] = [
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

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const filtered = MOCK_PROPOSALS.filter(p => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === "all" || p.status === filter
    return matchesSearch && matchesFilter
  })

  const totalProposals = MOCK_PROPOSALS.length
  const wonCount = MOCK_PROPOSALS.filter(p => p.status === "won").length
  const lostCount = MOCK_PROPOSALS.filter(p => p.status === "lost").length
  const winRate = wonCount + lostCount > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0
  const activeDrafts = MOCK_PROPOSALS.filter(p => p.status === "draft" || p.status === "review").length
  const revenueWon = MOCK_PROPOSALS.filter(p => p.status === "won").reduce((sum, p) => sum + p.estimated_value, 0)

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
              <TabsTrigger value="all">All ({MOCK_PROPOSALS.length})</TabsTrigger>
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
                <Link
                  key={proposal.id}
                  href={`/proposals/${proposal.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{proposal.title}</p>
                      <Badge variant={statusConfig[proposal.status].variant}>
                        {statusConfig[proposal.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{proposal.client_name}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{proposal.project_type}</span>
                      <span className="hidden sm:inline">|</span>
                      <span className="hidden sm:inline">{proposal.generated_at}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-medium">${(proposal.estimated_value / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">est. value</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
