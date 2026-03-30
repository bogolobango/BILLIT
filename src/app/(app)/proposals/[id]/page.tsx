"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Edit, Download } from "lucide-react"

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Proposal #{id}
              </CardTitle>
              <CardDescription className="mt-1">
                View and manage your proposal
              </CardDescription>
            </div>
            <Badge variant="secondary">Draft</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Proposal Detail View</p>
            <p className="text-sm text-muted-foreground mt-1">
              Full proposal editing and management will be available here.
              For now, create and edit proposals using the wizard.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link href="/proposals/new">
                <Button>
                  <Edit className="h-4 w-4" />
                  Create New Proposal
                </Button>
              </Link>
              <Button variant="outline" onClick={() => alert("Export would start here")}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
