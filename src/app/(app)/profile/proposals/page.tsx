"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, Trash2, FileText, Info } from "lucide-react"
import type { PastProposal } from "@/lib/types"

const INITIAL_PROPOSALS: PastProposal[] = [
  {
    id: "1",
    profile_id: "demo",
    file_url: "",
    file_name: "City_Hall_Renovation_Proposal_2024.pdf",
    extracted_text: null,
    uploaded_at: "2024-11-15T10:30:00Z",
  },
  {
    id: "2",
    profile_id: "demo",
    file_url: "",
    file_name: "Greenfield_Medical_SOQ_Response.docx",
    extracted_text: null,
    uploaded_at: "2024-09-22T14:15:00Z",
  },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatFileSize(): string {
  // Mock file size for MVP display
  const sizes = ["1.2 MB", "2.4 MB", "856 KB", "3.1 MB"]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<PastProposal[]>(INITIAL_PROPOSALS)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      addFiles(files)
    }
  }

  function addFiles(files: File[]) {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    const validFiles = files.filter(
      (f) => validTypes.includes(f.type) || f.name.endsWith(".pdf") || f.name.endsWith(".doc") || f.name.endsWith(".docx")
    )

    const newProposals: PastProposal[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      profile_id: "demo",
      file_url: "",
      file_name: file.name,
      extracted_text: null,
      uploaded_at: new Date().toISOString(),
    }))

    setProposals((prev) => [...newProposals, ...prev])
  }

  function handleDelete(id: string) {
    setProposals((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Past Proposals</h1>
        <p className="text-muted-foreground">
          Upload previous proposals so the AI can learn your firm's writing style, tone, and formatting preferences.
        </p>
      </div>

      <Separator />

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-blue-900">How this helps</p>
          <p className="text-blue-800 mt-1">
            Uploaded proposals are analyzed to extract your firm's voice, common phrasing, section
            structure, and formatting conventions. This allows generated proposals to sound
            authentically like your team wrote them, not generic AI output.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card>
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="text-lg">Upload Proposals</CardTitle>
          <CardDescription className="text-slate-300">
            PDF and Word documents (.pdf, .doc, .docx)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center cursor-pointer transition-colors ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <Upload className={`h-10 w-10 mb-3 ${isDragOver ? "text-primary" : "text-muted-foreground/50"}`} />
            <p className="text-sm font-medium">
              {isDragOver ? "Drop files here" : "Drag and drop proposal files here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse your files
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Accepted formats: PDF, DOC, DOCX
            </p>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleFileSelect}
            />
          </label>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-medium">No proposals uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload past proposals to help the AI match your firm's writing style.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="bg-slate-900 text-white rounded-t-lg">
            <CardTitle className="text-lg">Uploaded Documents</CardTitle>
            <CardDescription className="text-slate-300">
              {proposals.length} document{proposals.length !== 1 ? "s" : ""} in your content library
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{proposal.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {formatDate(proposal.uploaded_at)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive shrink-0"
                    onClick={() => handleDelete(proposal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
