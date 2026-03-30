"use client"

import { useState, useCallback } from "react"
import { WizardProgress } from "@/components/layout/wizard-progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Download,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Heading2,
  RotateCcw,
} from "lucide-react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExt from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import type {
  ScopingData,
  ComplianceItem,
  ProposalContent,
} from "@/lib/types"
import {
  PROJECT_TYPES,
  SCOPE_PHASES,
  FEE_STRUCTURES,
  PROPOSAL_SECTIONS,
} from "@/lib/types"

// Mock team members
const MOCK_TEAM = [
  { id: "1", name: "Michael Torres", title: "Principal Architect", selected: true },
  { id: "2", name: "Jennifer Walsh", title: "Project Manager", selected: true },
  { id: "3", name: "David Kim", title: "Design Lead", selected: false },
  { id: "4", name: "Sarah Patel", title: "Structural Engineer", selected: false },
]

const MOCK_PROJECTS = [
  { id: "1", name: "Regional Medical Pavilion", client: "Pacific Health Systems", selected: true },
  { id: "2", name: "Westside Community Health Center", client: "Multnomah County", selected: true },
  { id: "3", name: "Cascade Medical Office Building", client: "Providence Health", selected: false },
]

export default function NewProposalPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [rfpText, setRfpText] = useState("")
  const [companyName, setCompanyName] = useState("Apex Design Group")
  const [selectedTeam, setSelectedTeam] = useState(MOCK_TEAM)
  const [selectedProjects, setSelectedProjects] = useState(MOCK_PROJECTS)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [proposalGenerated, setProposalGenerated] = useState(false)
  const [primaryColor, setPrimaryColor] = useState("#1e3a5f")

  // Step 2 state
  const [scopingData, setScopingData] = useState<ScopingData>({
    project_type: "",
    client_name: "",
    client_contact: "",
    scope_phases: [],
    deliverables: [],
    fee_structure: "",
    estimated_fee_min: null,
    estimated_fee_max: null,
    timeline: "",
    milestones: [],
    location: "",
    description: "",
  })
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [newDeliverable, setNewDeliverable] = useState("")

  // Step 3 state
  const [proposalContent, setProposalContent] = useState<ProposalContent | null>(null)
  const [activeSection, setActiveSection] = useState("cover-letter")

  // Step 4 state
  const [proposalStatus, setProposalStatus] = useState("draft")

  const toggleTeamMember = (id: string) => {
    setSelectedTeam(prev =>
      prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m)
    )
  }

  const toggleProject = (id: string) => {
    setSelectedProjects(prev =>
      prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    )
  }

  const handleAnalyzeRFP = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const res = await fetch("/api/ai/parse-rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rfp_text: rfpText || "Sample RFP for healthcare facility" }),
      })
      const data = await res.json()
      setScopingData(data.scoping_data)
      setComplianceItems(data.compliance_items)
    } catch {
      // If API fails, use inline mock
      setScopingData({
        project_type: "Healthcare",
        client_name: "Metro Regional Medical Center",
        client_contact: "Sarah Chen, Director of Facilities Planning",
        scope_phases: ["Pre-Design / Programming", "Schematic Design (SD)", "Design Development (DD)", "Construction Documents (CD)", "Construction Administration (CA)"],
        deliverables: ["Programming report", "Schematic design drawings", "DD drawings and specifications", "Complete CD set", "Cost estimates at each phase", "LEED documentation"],
        fee_structure: "Lump Sum / Fixed Fee",
        estimated_fee_min: 850000,
        estimated_fee_max: 1200000,
        timeline: "24 months",
        milestones: [{ name: "Notice to Proceed", date: "2026-06-01" }, { name: "SD Complete", date: "2026-11-01" }],
        location: "Portland, Oregon",
        description: "45,000 SF ambulatory care center with outpatient surgery, imaging, and primary care clinics.",
      })
      setComplianceItems([
        { id: "comp-1", requirement: "Oregon-licensed Architecture firm", category: "certification", status: "met", notes: "License verified" },
        { id: "comp-2", requirement: "LEED AP on project team", category: "certification", status: "met", notes: "David Kim holds LEED AP" },
        { id: "comp-3", requirement: "Professional liability insurance - $2M", category: "insurance", status: "met", notes: "Current coverage: $5M" },
        { id: "comp-4", requirement: "3+ healthcare projects over $10M in past 5 years", category: "document", status: "needs_attention", notes: "Have 2 qualifying projects, may need to include sub-consultant projects" },
        { id: "comp-5", requirement: "Submission deadline: May 15, 2026 2:00 PM PST", category: "deadline", status: "not_met", notes: "46 days remaining" },
        { id: "comp-6", requirement: "Max 30 pages, 8.5x11, PDF format", category: "format", status: "met", notes: "Will format to requirements" },
      ])
    }
    setIsAnalyzing(false)
    setCurrentStep(2)
  }

  const handleGenerateProposal = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfpText,
          scopingData,
          profile: { company_name: companyName, services: [], certifications: [], bio: "", industry_focus: "" },
          teamMembers: selectedTeam.filter(t => t.selected),
          pastProjects: selectedProjects.filter(p => p.selected),
          pastProposalTexts: [],
        }),
      })
      const data = await res.json()
      setProposalContent(data)
    } catch {
      // Inline fallback
      setProposalContent({
        sections: PROPOSAL_SECTIONS.map((title, i) => ({
          id: title.toLowerCase().replace(/[^a-z]+/g, "-"),
          title,
          content: `<p>This is the ${title} section of your proposal for ${scopingData.client_name || "the client"}. The AI-generated content will appear here with personalized details from your firm profile, team members, and past projects.</p><p>In the full version, this section will contain detailed, professional content tailored to the specific RFP requirements and your firm's unique qualifications.</p>`,
          order: i + 1,
        })),
      })
    }

    setIsGenerating(false)
    setProposalGenerated(true)
  }

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setScopingData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()],
      }))
      setNewDeliverable("")
    }
  }

  const removeDeliverable = (index: number) => {
    setScopingData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }))
  }

  const togglePhase = (phase: string) => {
    setScopingData(prev => ({
      ...prev,
      scope_phases: prev.scope_phases.includes(phase)
        ? prev.scope_phases.filter(p => p !== phase)
        : [...prev.scope_phases, phase],
    }))
  }

  const updateComplianceStatus = (id: string, status: ComplianceItem["status"]) => {
    setComplianceItems(prev =>
      prev.map(item => item.id === id ? { ...item, status } : item)
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Proposal</h1>
        <p className="text-muted-foreground">Generate a winning AEC proposal with AI</p>
      </div>

      <WizardProgress currentStep={currentStep} />

      {/* Step 1: RFP Input + Firm Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFP / Project Information</CardTitle>
              <CardDescription>Provide the RFP text or project description for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paste">
                <TabsList>
                  <TabsTrigger value="paste">Paste Text / Email</TabsTrigger>
                  <TabsTrigger value="upload">Upload RFP</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <Textarea
                    placeholder="Paste your RFP, email, meeting notes, or project description here...&#10;&#10;The AI will extract project requirements, scope, compliance needs, and timeline from whatever you provide."
                    className="min-h-[250px] font-mono text-sm"
                    value={rfpText}
                    onChange={(e) => setRfpText(e.target.value)}
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Drag and drop your RFP document here</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, Word (.docx), or text files up to 10MB</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <FileText className="h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Firm Information</CardTitle>
              <CardDescription>Select your firm profile, team members, and relevant projects to include</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Team Members to Include</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTeam.map(member => (
                    <label
                      key={member.id}
                      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={member.selected}
                        onCheckedChange={() => toggleTeamMember(member.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.title}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Past Projects to Reference</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProjects.map(project => (
                    <label
                      key={project.id}
                      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={project.selected}
                        onCheckedChange={() => toggleProject(project.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.client}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleAnalyzeRFP} disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing RFP...
                </>
              ) : (
                <>
                  Analyze & Continue
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Project Scoping */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>AI-extracted information — review and edit as needed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Project Type</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={scopingData.project_type}
                        onChange={e => setScopingData(prev => ({ ...prev, project_type: e.target.value }))}
                      >
                        <option value="">Select type...</option>
                        {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input
                        value={scopingData.client_name}
                        onChange={e => setScopingData(prev => ({ ...prev, client_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={scopingData.location}
                        onChange={e => setScopingData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timeline</Label>
                      <Input
                        value={scopingData.timeline}
                        onChange={e => setScopingData(prev => ({ ...prev, timeline: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Project Description</Label>
                    <Textarea
                      value={scopingData.description}
                      onChange={e => setScopingData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Scope Phases</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SCOPE_PHASES.map(phase => (
                        <label key={phase} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox
                            checked={scopingData.scope_phases.includes(phase)}
                            onCheckedChange={() => togglePhase(phase)}
                          />
                          {phase}
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Deliverables</Label>
                    <div className="space-y-2">
                      {scopingData.deliverables.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input value={d} readOnly className="flex-1 text-sm" />
                          <Button variant="ghost" size="icon" onClick={() => removeDeliverable(i)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add deliverable..."
                          value={newDeliverable}
                          onChange={e => setNewDeliverable(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addDeliverable()}
                          className="flex-1 text-sm"
                        />
                        <Button variant="outline" size="icon" onClick={addDeliverable}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Fee Structure</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={scopingData.fee_structure}
                        onChange={e => setScopingData(prev => ({ ...prev, fee_structure: e.target.value }))}
                      >
                        <option value="">Select...</option>
                        {FEE_STRUCTURES.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Fee (Min)</Label>
                      <Input
                        type="number"
                        value={scopingData.estimated_fee_min ?? ""}
                        onChange={e => setScopingData(prev => ({ ...prev, estimated_fee_min: e.target.value ? Number(e.target.value) : null }))}
                        placeholder="$"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Fee (Max)</Label>
                      <Input
                        type="number"
                        value={scopingData.estimated_fee_max ?? ""}
                        onChange={e => setScopingData(prev => ({ ...prev, estimated_fee_max: e.target.value ? Number(e.target.value) : null }))}
                        placeholder="$"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Checklist */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Compliance Checklist</CardTitle>
                  <CardDescription>RFP requirements your firm must meet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {complianceItems.map(item => (
                    <div key={item.id} className="space-y-1.5 p-3 rounded-md bg-muted/50">
                      <div className="flex items-start gap-2">
                        {item.status === "met" && <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />}
                        {item.status === "not_met" && <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                        {item.status === "needs_attention" && <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{item.requirement}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-6">
                        {(["met", "needs_attention", "not_met"] as const).map(status => (
                          <button
                            key={status}
                            onClick={() => updateComplianceStatus(item.id, status)}
                            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                              item.status === status
                                ? status === "met" ? "bg-emerald-100 text-emerald-800"
                                : status === "needs_attention" ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {status === "met" ? "Met" : status === "needs_attention" ? "Attention" : "Not Met"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={() => setCurrentStep(3)} size="lg">
              Generate Proposal
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: AI Draft + Editor */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {!proposalGenerated ? (
            <Card>
              <CardContent className="py-16 text-center">
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto w-16 h-16">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <Sparkles className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Generating Your Proposal</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI is crafting a personalized proposal using your firm profile, team credentials, and past projects...
                      </p>
                    </div>
                    <div className="max-w-xs mx-auto space-y-2">
                      {["Analyzing RFP requirements...", "Matching team qualifications...", "Writing proposal sections...", "Checking compliance..."].map((text, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-semibold">Ready to Generate</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI will create a complete, personalized proposal based on your RFP analysis and firm profile.
                      </p>
                    </div>
                    <Button onClick={handleGenerateProposal} size="lg">
                      <Sparkles className="h-4 w-4" />
                      Generate Proposal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Editor */}
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-0">
                    <ProposalEditor
                      content={proposalContent}
                      activeSection={activeSection}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Sections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {proposalContent?.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id)
                          document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {complianceItems.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        {item.status === "met" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                        {item.status === "not_met" && <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                        {item.status === "needs_attention" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                        <span className="truncate">{item.requirement}</span>
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
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              <ChevronLeft className="h-4 w-4" />
              Back to Scoping
            </Button>
            {proposalGenerated && (
              <Button onClick={() => setCurrentStep(4)} size="lg">
                Export & Submit
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Export & Submit */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Preview</CardTitle>
                  <CardDescription>Review your proposal before exporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-8 bg-white min-h-[400px] prose prose-sm max-w-none" style={{ fontFamily: "Georgia, serif" }}>
                    <div className="border-b-2 pb-4 mb-6" style={{ borderColor: primaryColor }}>
                      <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
                        {scopingData.description || "Proposal"}
                      </h1>
                      <p className="text-gray-500 text-sm mt-1">
                        {companyName} | Prepared for {scopingData.client_name}
                      </p>
                    </div>
                    {proposalContent?.sections.map(section => (
                      <div key={section.id} className="mb-6">
                        <h2 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
                          {section.title}
                        </h2>
                        <div
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: section.content.slice(0, 300) + "..." }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Brand Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="h-9 w-14 rounded border cursor-pointer"
                      />
                      <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed rounded-md p-4 text-center text-xs text-muted-foreground">
                      <Upload className="h-5 w-5 mx-auto mb-1" />
                      Upload logo
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">$99</p>
                    <p className="text-xs text-muted-foreground">per proposal export</p>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => alert("Stripe checkout would open here. For MVP demo, export is simulated.")}>
                    <CreditCard className="h-4 w-4" />
                    Pay & Export
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full" onClick={() => alert("PDF download would start here.")}>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => alert("Word download would start here.")}>
                    <Download className="h-4 w-4" />
                    Download Word
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    value={proposalStatus}
                    onChange={e => setProposalStatus(e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="review">In Review</option>
                    <option value="sent">Sent</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(3)}>
              <ChevronLeft className="h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// TipTap Editor Component
function ProposalEditor({ content, activeSection }: { content: ProposalContent | null; activeSection: string }) {
  const htmlContent = content?.sections
    .map(s => `<div id="section-${s.id}"><h2>${s.title}</h2>${s.content}</div>`)
    .join("<hr/>") || ""

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      Placeholder.configure({ placeholder: "Your proposal content will appear here..." }),
    ],
    content: htmlContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-6 focus:outline-none min-h-[500px]",
      },
    },
  })

  const ToolbarButton = useCallback(({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
    >
      {children}
    </button>
  ), [])

  if (!editor) return null

  return (
    <div>
      <div className="flex items-center gap-1 border-b px-4 py-2 bg-muted/30">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
