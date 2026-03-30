"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Pencil, X, FolderOpen, Loader2 } from "lucide-react"
import { PROJECT_TYPES } from "@/lib/types"
import type { PastProject } from "@/lib/types"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

const isDevMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder")

const INITIAL_PROJECTS: PastProject[] = [
  {
    id: "1",
    profile_id: "demo",
    name: "Riverside Community Center",
    client: "City of Riverside",
    project_type: "Public/Government",
    value: 12500000,
    location: "Riverside, CA",
    description: "45,000 SF multi-purpose community center with gymnasium, meeting rooms, and outdoor amphitheater.",
    year_completed: 2023,
    key_personnel: ["Sarah Chen", "Marcus Rivera"],
  },
  {
    id: "2",
    profile_id: "demo",
    name: "Greenfield Medical Plaza",
    client: "Greenfield Health Partners",
    project_type: "Healthcare",
    value: 28000000,
    location: "Austin, TX",
    description: "120,000 SF outpatient medical office building with imaging center and ambulatory surgery suites.",
    year_completed: 2022,
    key_personnel: ["Sarah Chen", "Jennifer Okafor"],
  },
  {
    id: "3",
    profile_id: "demo",
    name: "Oakmont Elementary School",
    client: "Oakmont Unified School District",
    project_type: "Education",
    value: 18700000,
    location: "Portland, OR",
    description: "650-student K-5 school with LEED Gold certification, including modernized classrooms and a central learning commons.",
    year_completed: 2024,
    key_personnel: ["Marcus Rivera", "Jennifer Okafor"],
  },
]

const EMPTY_FORM = {
  name: "",
  client: "",
  project_type: "",
  value: "",
  location: "",
  description: "",
  year_completed: "",
  key_personnel: "",
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ProjectsPage() {
  const { userId, loading: userLoading, supabase } = useSupabaseUser()
  const [projects, setProjects] = useState<PastProject[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load projects from Supabase on mount
  useEffect(() => {
    if (userLoading) return
    if (!userId || isDevMode) {
      setProjects(INITIAL_PROJECTS)
      setLoadingProjects(false)
      return
    }

    async function loadProjects() {
      try {
        const { data, error: fetchError } = await supabase
          .from("past_projects")
          .select()
          .eq("profile_id", userId)

        if (fetchError) throw fetchError

        if (data && data.length > 0) {
          setProjects(data as PastProject[])
        } else if (isDevMode) {
          setProjects(INITIAL_PROJECTS)
        }
      } catch (err) {
        console.error("Failed to load projects:", err)
        setError("Failed to load projects.")
        setProjects(INITIAL_PROJECTS)
      } finally {
        setLoadingProjects(false)
      }
    }

    loadProjects()
  }, [userId, userLoading])

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEditForm(project: PastProject) {
    setEditingId(project.id)
    setForm({
      name: project.name,
      client: project.client,
      project_type: project.project_type,
      value: project.value.toString(),
      location: project.location,
      description: project.description,
      year_completed: project.year_completed.toString(),
      key_personnel: project.key_personnel.join(", "),
    })
    setShowForm(true)
  }

  async function handleSubmit() {
    if (!form.name || !form.client) return

    const projectData = {
      name: form.name,
      client: form.client,
      project_type: form.project_type,
      value: parseFloat(form.value) || 0,
      location: form.location,
      description: form.description,
      year_completed: parseInt(form.year_completed) || new Date().getFullYear(),
      key_personnel: form.key_personnel
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    }

    if (editingId) {
      if (!isDevMode && userId) {
        try {
          const { error: updateError } = await supabase
            .from("past_projects")
            .update(projectData)
            .eq("id", editingId)

          if (updateError) throw updateError
        } catch (err) {
          console.error("Failed to update project:", err)
          setError("Failed to update project. Please try again.")
          return
        }
      }
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...projectData }
            : p
        )
      )
    } else {
      if (!isDevMode && userId) {
        try {
          const { data, error: insertError } = await supabase
            .from("past_projects")
            .insert({ profile_id: userId, ...projectData })
            .select()
            .single()

          if (insertError) throw insertError

          setProjects((prev) => [data as PastProject, ...prev])
          setForm(EMPTY_FORM)
          setShowForm(false)
          setEditingId(null)
          return
        } catch (err) {
          console.error("Failed to add project:", err)
          setError("Failed to add project. Please try again.")
          return
        }
      }

      const newProject: PastProject = {
        id: crypto.randomUUID(),
        profile_id: userId || "demo",
        ...projectData,
      }
      setProjects((prev) => [newProject, ...prev])
    }

    setForm(EMPTY_FORM)
    setShowForm(false)
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    if (!isDevMode && userId) {
      try {
        const { error: deleteError } = await supabase
          .from("past_projects")
          .delete()
          .eq("id", id)

        if (deleteError) throw deleteError
      } catch (err) {
        console.error("Failed to delete project:", err)
        setError("Failed to delete project. Please try again.")
        return
      }
    }

    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  if (userLoading || loadingProjects) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Past Projects</h1>
          <p className="text-muted-foreground">
            Track your completed projects. Relevant experience is matched to RFP requirements in generated proposals.
          </p>
        </div>
        {!showForm && (
          <Button onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <Separator />

      {/* Inline Add/Edit Form */}
      {showForm && (
        <Card className="border-primary/50">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {editingId ? "Edit Project" : "New Project"}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {editingId
                  ? "Update the project details below"
                  : "Enter the details for the past project"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800"
              onClick={closeForm}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name *</Label>
                <Input
                  id="project_name"
                  placeholder="e.g. Downtown Mixed-Use Development"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  placeholder="e.g. City of Springfield"
                  value={form.client}
                  onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <select
                  id="project_type"
                  value={form.project_type}
                  onChange={(e) => setForm((f) => ({ ...f, project_type: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select type...</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Project Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="e.g. 5000000"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Denver, CO"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year_completed">Year Completed</Label>
                <Input
                  id="year_completed"
                  type="number"
                  placeholder="e.g. 2024"
                  value={form.year_completed}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, year_completed: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project scope and deliverables..."
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="key_personnel">Key Personnel</Label>
                <Input
                  id="key_personnel"
                  placeholder="e.g. Sarah Chen, Marcus Rivera (comma-separated)"
                  value={form.key_personnel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, key_personnel: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!form.name || !form.client}>
                {editingId ? "Update Project" : "Add Project"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-medium">No projects yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add past projects to strengthen your proposal experience sections.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="bg-slate-900 text-white rounded-t-lg">
            <CardTitle className="text-lg">Project History</CardTitle>
            <CardDescription className="text-slate-300">
              {projects.length} project{projects.length !== 1 ? "s" : ""} on record
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-semibold p-3 pl-6">Project Name</th>
                    <th className="text-left font-semibold p-3">Client</th>
                    <th className="text-left font-semibold p-3">Type</th>
                    <th className="text-right font-semibold p-3">Value</th>
                    <th className="text-left font-semibold p-3">Location</th>
                    <th className="text-center font-semibold p-3">Year</th>
                    <th className="text-right font-semibold p-3 pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 pl-6">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{project.client}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {project.project_type}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium tabular-nums">
                        {formatCurrency(project.value)}
                      </td>
                      <td className="p-3 text-muted-foreground">{project.location}</td>
                      <td className="p-3 text-center tabular-nums">{project.year_completed}</td>
                      <td className="p-3 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditForm(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
