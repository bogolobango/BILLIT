"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FilePlus,
  Target,
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
    label: "Go/No-Go",
    href: "/proposals/evaluate",
    icon: Target,
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shadow-sm">
          <Building2 className="h-4.5 w-4.5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">BILLIT</span>
          <span className="text-[10px] font-medium text-muted-foreground ml-1.5 bg-muted px-1.5 py-0.5 rounded">BETA</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          if (item.label === "divider") {
            return (
              <div key={i} className="my-3 mx-3 h-px bg-sidebar-border" />
            )
          }

          const Icon = item.icon!
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-[11px] text-muted-foreground">
          AI-Powered AEC Proposals
        </p>
      </div>
    </aside>
  )
}
