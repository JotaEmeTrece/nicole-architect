"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Compass,
  FileText,
  CheckSquare,
  Palette,
  Calculator,
  Sun,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Ruler,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavGroup {
  title: string
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
}

const navigation: NavGroup[] = [
  {
    title: "Field",
    items: [
      { title: "Levantamientos", href: "/field/levantamientos", icon: <Ruler className="h-4 w-4" /> },
      { title: "Planos", href: "/field/planos", icon: <FileText className="h-4 w-4" /> },
      { title: "Checklists", href: "/field/checklists", icon: <CheckSquare className="h-4 w-4" /> },
    ],
  },
  {
    title: "Studio",
    items: [
      { title: "Moodboards", href: "/studio/moodboards", icon: <Palette className="h-4 w-4" /> },
      { title: "Calculadoras", href: "/studio/calculadoras", icon: <Calculator className="h-4 w-4" /> },
    ],
  },
  {
    title: "Design",
    items: [{ title: "SunPath", href: "/design/sunpath", icon: <Sun className="h-4 w-4" /> }],
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Field", "Studio", "Design"])
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupTitle) ? prev.filter((g) => g !== groupTitle) : [...prev, groupTitle],
    )
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm tracking-tight">Nicole Architect</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Field • Studio • Design</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navigation.map((group) => (
          <div key={group.title} className="mb-4">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              {group.title}
              {expandedGroups.includes(group.title) ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {expandedGroups.includes(group.title) && (
              <div className="mt-1 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
