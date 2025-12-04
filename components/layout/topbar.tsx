"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/context/theme-context"
import { useProjects } from "@/lib/context/project-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProjectSelector } from "@/components/shared/project-selector"

interface TopbarProps {
  title?: string
  showProjectSelector?: boolean
}

export function Topbar({ title, showProjectSelector = false }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { activeProject } = useProjects()

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-sm border-b border-border px-4 lg:px-6">
      <div className="flex items-center justify-between h-full max-w-full">
        {/* Left side */}
        <div className="flex items-center gap-4 pl-12 lg:pl-0">
          {showProjectSelector ? (
            <ProjectSelector />
          ) : (
            <h1 className="text-lg font-semibold text-foreground truncate">
              {title || (activeProject ? activeProject.name : "Dashboard")}
            </h1>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Cambiar tema</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">N</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Nicole</p>
                  <p className="text-xs text-muted-foreground">Arquitecta</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
