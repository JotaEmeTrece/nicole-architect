"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

interface AppShellProps {
  children: React.ReactNode
  title?: string
  showProjectSelector?: boolean
}

export function AppShell({ children, title, showProjectSelector }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} showProjectSelector={showProjectSelector} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
