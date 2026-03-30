"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Building2, Upload, Save, CheckCircle2, Globe, Loader2 } from "lucide-react"
import type { Profile } from "@/lib/types"
import { useSupabaseUser } from "@/hooks/use-supabase-user"

const isDevMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder")

const AEC_SERVICES = [
  "Architecture",
  "Engineering",
  "Construction",
  "Interior Design",
  "Landscape Architecture",
  "Urban Planning",
  "Environmental",
  "MEP",
  "Structural",
  "Civil",
  "Geotechnical",
  "Survey",
]

export default function ProfilePage() {
  const { userId, loading: userLoading, supabase } = useSupabaseUser()
  const [profile, setProfile] = useState<Omit<Profile, "id" | "created_at">>({
    company_name: "",
    logo_url: null,
    services: [],
    certifications: [],
    bio: "",
    industry_focus: "",
  })
  const [certificationsInput, setCertificationsInput] = useState("")
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<string | null>(null)
  const [scrapeError, setScrapeError] = useState<string | null>(null)

  // Load profile from Supabase on mount
  useEffect(() => {
    if (userLoading) return
    if (!userId || isDevMode) {
      setLoadingProfile(false)
      return
    }

    async function loadProfile() {
      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select()
          .eq("id", userId)
          .single()

        if (fetchError) throw fetchError

        if (data) {
          setProfile({
            company_name: data.company_name || "",
            logo_url: data.logo_url || null,
            services: data.services || [],
            certifications: data.certifications || [],
            bio: data.bio || "",
            industry_focus: data.industry_focus || "",
          })
          setCertificationsInput((data.certifications || []).join(", "))
        }
      } catch (err) {
        console.error("Failed to load profile:", err)
        setError("Failed to load profile. Using local state.")
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [userId, userLoading])

  async function handleScrapeWebsite() {
    if (!websiteUrl.trim()) return

    setScraping(true)
    setScrapeResult(null)
    setScrapeError(null)

    try {
      const response = await fetch("/api/ai/scrape-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to scan website")
      }

      const data = await response.json()

      // Populate form fields with extracted data
      setProfile((prev) => ({
        ...prev,
        company_name: data.company_name || prev.company_name,
        services: data.services || prev.services,
        bio: data.bio || prev.bio,
        industry_focus: data.industry_focus || prev.industry_focus,
      }))

      if (data.certifications && data.certifications.length > 0) {
        setCertificationsInput(data.certifications.join(", "))
      }

      const teamCount = data.team_members?.length || 0
      const projectCount = data.past_projects?.length || 0
      setScrapeResult(
        `Extracted ${teamCount} team member${teamCount !== 1 ? "s" : ""} and ${projectCount} project${projectCount !== 1 ? "s" : ""} from your website`
      )
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setScraping(false)
    }
  }

  function handleServiceToggle(service: string, checked: boolean) {
    setProfile((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }))
  }

  async function handleSave() {
    const certs = certificationsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
    const profileToSave = { ...profile, certifications: certs }

    if (!isDevMode && userId) {
      setSaving(true)
      setError(null)
      try {
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert({ id: userId, ...profileToSave })

        if (upsertError) throw upsertError
      } catch (err) {
        console.error("Failed to save profile:", err)
        setError("Failed to save profile. Please try again.")
        setSaving(false)
        return
      }
      setSaving(false)
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (userLoading || loadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Firm Profile</h1>
        <p className="text-muted-foreground">
          Define your company information. This data powers AI-generated proposals tailored to your firm.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Auto-Populate from Website */}
      <Card>
        <CardHeader className="bg-slate-900 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Auto-Populate from Website
          </CardTitle>
          <CardDescription className="text-slate-300">
            Save time by scanning your firm&apos;s website to automatically extract company details, team members, and project history
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="https://www.yourfirm.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleScrapeWebsite}
              disabled={scraping || !websiteUrl.trim()}
              variant="outline"
              className="shrink-0"
            >
              {scraping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Scan Website
                </>
              )}
            </Button>
          </div>
          {scrapeResult && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">{scrapeResult}</p>
            </div>
          )}
          {scrapeError && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-700 font-medium">{scrapeError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="bg-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-lg">Company Information</CardTitle>
              <CardDescription className="text-slate-300">
                Basic details about your firm
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  placeholder="e.g. Acme Architecture & Engineering"
                  value={profile.company_name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, company_name: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Company Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe your firm's history, mission, and areas of expertise..."
                  rows={5}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry_focus">Industry Focus</Label>
                <Input
                  id="industry_focus"
                  placeholder="e.g. K-12 Education, Municipal Infrastructure"
                  value={profile.industry_focus}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, industry_focus: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  placeholder="e.g. DBE, MBE, WBE, LEED AP, PE (comma-separated)"
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple certifications with commas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-lg">Services Offered</CardTitle>
              <CardDescription className="text-slate-300">
                Select all disciplines your firm provides
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AEC_SERVICES.map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={profile.services.includes(service)}
                      onCheckedChange={(checked) =>
                        handleServiceToggle(service, checked)
                      }
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-slate-900 text-white rounded-t-lg">
              <CardTitle className="text-lg">Company Logo</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                <Upload className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">Drop your logo here</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, or SVG up to 2MB
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleSave} className="w-full" size="lg" disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : saved ? "Profile Saved" : "Save Profile"}
              </Button>
              {saved && (
                <p className="text-sm text-emerald-600 text-center mt-2">
                  Profile saved successfully.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
