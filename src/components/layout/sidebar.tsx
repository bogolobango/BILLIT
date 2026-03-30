"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FilePlus,
  Building2,
  Users,
  FolderKanban,
  FileStack,
  CreditCard,
} from "lucide-react"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Proposal",
    href: "/proposals/new",
    icon: FilePlus,
  },
  {
    label: "divider",
    href: "",
    icon: null,
  },
  {
    label: "Firm Profile",
    href: "/profile",
    icon: Building2,
  },
  {
    label: "Team Members",
    href: "/profile/team",
    icon: Users,
  },
  {
    label: "Past Projects",
    href: "/profile/projects",
    icon: FolderKanban,
  },
  {
    label: "Past Proposals",
    href: "/profile/proposals",
    icon: FileStack,
  },
  {
    label: "divider",
    href: "",
    icon: null,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">BILLIT</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.label === "divider") {
            return (
              <div key={i} className="my-3 h-px bg-sidebar-border" />
            )
          }

          const Icon = item.icon!
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <p className="px-3 text-xs text-sidebar-foreground/50">
          AI-Powered AEC Proposals
        </p>
      </div>
    </aside>
  )
}
