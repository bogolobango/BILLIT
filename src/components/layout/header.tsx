"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Building2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New Proposal", href: "/proposals/new" },
  { label: "Firm Profile", href: "/profile" },
  { label: "Team", href: "/profile/team" },
  { label: "Projects", href: "/profile/projects" },
  { label: "Pricing", href: "/pricing" },
]

export function Header({ email }: { email?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">BILLIT</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {email && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {email}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-sidebar text-sidebar-foreground p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-6 px-2">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-bold">BILLIT</span>
            </div>
            <nav className="space-y-1">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
