"use client"

import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useProjects } from "@/lib/context/project-context"
import { useState } from "react"

export function ProjectSelector() {
  const { projects, activeProject, setActiveProject } = useProjects()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between bg-transparent"
        >
          <span className="truncate">{activeProject ? activeProject.name : "Seleccionar proyecto..."}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar proyecto..." />
          <CommandList>
            <CommandEmpty>No se encontraron proyectos.</CommandEmpty>
            <CommandGroup heading="Proyectos">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={() => {
                    setActiveProject(project)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", activeProject?.id === project.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{project.name}</span>
                    <span className="text-xs text-muted-foreground">{project.type}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  // TODO: Abrir modal de nuevo proyecto
                  setOpen(false)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo proyecto
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
