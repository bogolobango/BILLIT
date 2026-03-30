"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { saveAs } from "file-saver"
import { generateDOCX } from "@/lib/export/to-docx"
import { generatePDF } from "@/lib/export/to-pdf"
import type { Proposal, ProposalStatus, ComplianceItem, ProposalContent } from "@/lib/types"

const statusConfig: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  review: { label: "In Review", variant: "warning" },
  sent: { label: "Sent", variant: "default" },
  won: { label: "Won", variant: "success" },
  lost: { label: "Lost", variant: "destructive" },
}

const ALL_STATUSES: ProposalStatus[] = ["draft", "review", "sent", "won", "lost"]

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)

  useEffect(() => {
    async function loadProposal() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        if (url.includes("placeholder")) {
          setNotFound(true)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("proposals")
          .select()
          .eq("id", id)
          .single()

        if (error || !data) {
          setNotFound(true)
        } else {
          setProposal(data as Proposal)
        }
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }

    loadProposal()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleStatusChange = async (newStatus: ProposalStatus) => {
    if (!proposal) return
    setStatusSaving(true)
    setProposal(prev => prev ? { ...prev, status: newStatus } : null)
    try {
      await supabase
        .from("proposals")
        .update({ status: newStatus })
        .eq("id", proposal.id)
    } catch {
      // Revert on error
    }
    setStatusSaving(false)
  }

  const content = proposal?.content as ProposalContent | null
  const complianceItems = (proposal?.compliance_checklist || []) as ComplianceItem[]
  const scopingData = proposal?.scoping_data as Proposal["scoping_data"]

  async function handleExportPDF() {
    if (!content) return
    const blob = await generatePDF(content, {
      title: proposal?.title || "Proposal",
      companyName: "Company",
      clientName: proposal?.client_name || "Client",
    })
    saveAs(blob, `${proposal?.client_name || "proposal"}-proposal.html`)
  }

  async function handleExportDOCX() {
    if (!content) return
    const blob = await generateDOCX(content, {
      title: proposal?.title || "Proposal",
      companyName: "Company",
      clientName: proposal?.client_name || "Client",
    })
    saveAs(blob, `${proposal?.client_name || "proposal"}-proposal.docx`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound || !proposal) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Proposal Not Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              The proposal you are looking for does not exist or you do not have access.
            </p>
            <Link href="/dashboard" className="inline-block mt-6">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{proposal.title}</h1>
          <p className="text-muted-foreground mt-1">
            {proposal.client_name} &middot; {proposal.project_type}
          </p>
        </div>
        <Badge variant={statusConfig[proposal.status].variant}>
          {statusConfig[proposal.status].label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Scoping Data Summary */}
          {scopingData && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  {scopingData.project_type && (
                    <div>
                      <p className="text-muted-foreground text-xs">Project Type</p>
                      <p className="font-medium">{scopingData.project_type}</p>
                    </div>
                  )}
                  {scopingData.location && (
                    <div>
                      <p className="text-muted-foreground text-xs">Location</p>
                      <p className="font-medium">{scopingData.location}</p>
                    </div>
                  )}
                  {scopingData.timeline && (
                    <div>
                      <p className="text-muted-foreground text-xs">Timeline</p>
                      <p className="font-medium">{scopingData.timeline}</p>
                    </div>
                  )}
                  {scopingData.fee_structure && (
                    <div>
                      <p className="text-muted-foreground text-xs">Fee Structure</p>
                      <p className="font-medium">{scopingData.fee_structure}</p>
                    </div>
                  )}
                  {(scopingData.estimated_fee_min || scopingData.estimated_fee_max) && (
                    <div>
                      <p className="text-muted-foreground text-xs">Fee Range</p>
                      <p className="font-medium">
                        ${scopingData.estimated_fee_min?.toLocaleString() || "?"} - ${scopingData.estimated_fee_max?.toLocaleString() || "?"}
                      </p>
                    </div>
                  )}
                </div>
                {scopingData.description && (
                  <p className="text-sm text-muted-foreground mt-4">{scopingData.description}</p>
                )}
                {scopingData.scope_phases?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-1">Scope Phases</p>
                    <div className="flex flex-wrap gap-1">
                      {scopingData.scope_phases.map((phase: string) => (
                        <Badge key={phase} variant="outline" className="text-xs">{phase}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Proposal Sections */}
          {content?.sections?.map(section => (
            <Card key={section.id} className="shadow-sm overflow-hidden">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">Section {section.order}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div
                  className="prose prose-sm max-w-none text-foreground leading-relaxed [&_p]:mb-3 [&_ul]:mb-3 [&_li]:mb-1 [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </CardContent>
            </Card>
          ))}

          {!content?.sections?.length && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No proposal content generated yet.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={proposal.status}
                onChange={e => handleStatusChange(e.target.value as ProposalStatus)}
                disabled={statusSaving}
              >
                {ALL_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Export */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-xl bg-accent text-center">
                <Badge className="mb-2 bg-primary text-primary-foreground">Beta -- Free</Badge>
                <p className="text-sm text-muted-foreground mt-1">All exports free during beta</p>
              </div>
              <Button className="w-full" size="lg" onClick={handleExportDOCX} disabled={!content}>
                <Download className="h-4 w-4" />
                Export Proposal (Free Beta)
              </Button>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={!content}>
                  <Download className="h-3.5 w-3.5" />PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportDOCX} disabled={!content}>
                  <Download className="h-3.5 w-3.5" />Word
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          {complianceItems.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {complianceItems.map(item => (
                  <div key={item.id} className="flex items-start gap-2 text-xs">
                    {item.status === "met" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />}
                    {item.status === "not_met" && <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />}
                    {item.status === "needs_attention" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />}
                    <div>
                      <span className="font-medium">{item.requirement}</span>
                      {item.notes && <p className="text-muted-foreground mt-0.5">{item.notes}</p>}
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600 font-medium">{complianceItems.filter(i => i.status === "met").length} Met</span>
                  <span className="text-amber-600 font-medium">{complianceItems.filter(i => i.status === "needs_attention").length} Attention</span>
                  <span className="text-red-500 font-medium">{complianceItems.filter(i => i.status === "not_met").length} Not Met</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              {proposal.generated_at && (
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="font-medium text-foreground">{new Date(proposal.generated_at).toLocaleDateString()}</span>
                </div>
              )}
              {proposal.updated_at && (
                <div className="flex justify-between">
                  <span>Updated</span>
                  <span className="font-medium text-foreground">{new Date(proposal.updated_at).toLocaleDateString()}</span>
                </div>
              )}
              {proposal.rfp_source_type && (
                <div className="flex justify-between">
                  <span>RFP Source</span>
                  <span className="font-medium text-foreground capitalize">{proposal.rfp_source_type}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
