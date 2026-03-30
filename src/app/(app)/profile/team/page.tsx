"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, UserCircle, X, Loader2 } from "lucide-react"
import type { TeamMember } from "@/lib/types"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

const isDevMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder")

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "1",
    profile_id: "demo",
    name: "Sarah Chen",
    title: "Principal Architect",
    role: "Project Lead",
    bio: "20+ years of experience leading complex commercial and institutional projects. Licensed in 5 states with expertise in sustainable design.",
    years_experience: 22,
    certifications: ["AIA", "LEED AP BD+C", "NCARB"],
    photo_url: null,
  },
  {
    id: "2",
    profile_id: "demo",
    name: "Marcus Rivera",
    title: "Senior Structural Engineer",
    role: "Technical Lead",
    bio: "Specializes in seismic design and complex structural systems for high-rise and healthcare facilities.",
    years_experience: 15,
    certifications: ["PE", "SE"],
    photo_url: null,
  },
  {
    id: "3",
    profile_id: "demo",
    name: "Jennifer Okafor",
    title: "Project Manager",
    role: "Project Manager",
    bio: "Manages large-scale public sector projects with a track record of on-time, on-budget delivery.",
    years_experience: 10,
    certifications: ["PMP", "CCM"],
    photo_url: null,
  },
]

const EMPTY_FORM = {
  name: "",
  title: "",
  role: "",
  bio: "",
  years_experience: "",
  certifications: "",
}

export default function TeamPage() {
  const { userId, loading: userLoading, supabase } = useSupabaseUser()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load team members from Supabase on mount
  useEffect(() => {
    if (userLoading) return
    if (!userId || isDevMode) {
      setMembers(INITIAL_MEMBERS)
      setLoadingMembers(false)
      return
    }

    async function loadMembers() {
      try {
        const { data, error: fetchError } = await supabase
          .from("team_members")
          .select()
          .eq("profile_id", userId)

        if (fetchError) throw fetchError

        if (data && data.length > 0) {
          setMembers(data as TeamMember[])
        } else if (isDevMode) {
          setMembers(INITIAL_MEMBERS)
        }
      } catch (err) {
        console.error("Failed to load team members:", err)
        setError("Failed to load team members.")
        setMembers(INITIAL_MEMBERS)
      } finally {
        setLoadingMembers(false)
      }
    }

    loadMembers()
  }, [userId, userLoading])

  async function handleAdd() {
    if (!form.name || !form.title) return

    const memberData = {
      name: form.name,
      title: form.title,
      role: form.role,
      bio: form.bio,
      years_experience: parseInt(form.years_experience) || 0,
      certifications: form.certifications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      photo_url: null,
    }

    if (!isDevMode && userId) {
      try {
        const { data, error: insertError } = await supabase
          .from("team_members")
          .insert({ profile_id: userId, ...memberData })
          .select()
          .single()

        if (insertError) throw insertError

        setMembers((prev) => [data as TeamMember, ...prev])
        setForm(EMPTY_FORM)
        setShowForm(false)
        return
      } catch (err) {
        console.error("Failed to add team member:", err)
        setError("Failed to add team member. Please try again.")
        return
      }
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      profile_id: userId || "demo",
      ...memberData,
    }

    setMembers((prev) => [newMember, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!isDevMode && userId) {
      try {
        const { error: deleteError } = await supabase
          .from("team_members")
          .delete()
          .eq("id", id)

        if (deleteError) throw deleteError
      } catch (err) {
        console.error("Failed to delete team member:", err)
        setError("Failed to delete team member. Please try again.")
        return
      }
    }

    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  if (userLoading || loadingMembers) {
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
          <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
          <p className="text-muted-foreground">
            Manage your team roster. Key personnel are automatically referenced in generated proposals.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <Separator />

      {/* Inline Add Form */}
      {showForm && (
        <Card className="border-primary/50">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">New Team Member</CardTitle>
              <CardDescription className="text-slate-300">
                Fill in the details for the new team member
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-slate-800"
              onClick={() => {
                setShowForm(false)
                setForm(EMPTY_FORM)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. John Smith"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Architect"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="e.g. Project Lead, Technical Reviewer"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  placeholder="e.g. 15"
                  value={form.years_experience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, years_experience: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief professional summary..."
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  placeholder="e.g. PE, LEED AP, PMP (comma-separated)"
                  value={form.certifications}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, certifications: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setForm(EMPTY_FORM)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!form.name || !form.title}>
                Add Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Grid */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserCircle className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your key personnel to include them in proposals.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="relative group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{member.role}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{member.years_experience} years</span>
                </div>
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {member.bio}
                  </p>
                )}
                {member.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {member.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
