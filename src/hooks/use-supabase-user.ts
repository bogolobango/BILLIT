"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useSupabaseUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setLoading(false)
    })
  }, [])

  return { userId, loading, supabase }
}
