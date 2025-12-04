"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Project } from "@/lib/models"
import { mockProjects } from "@/lib/mock-data"

interface ProjectContextType {
  projects: Project[]
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<Project>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  loading: boolean
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)

  const addProject = useCallback(
    async (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> => {
      setLoading(true)
      // TODO: Conectar con API real
      await new Promise((resolve) => setTimeout(resolve, 200))

      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setProjects((prev) => [newProject, ...prev])
      setLoading(false)
      return newProject
    },
    [],
  )

  const updateProject = useCallback(async (id: string, updates: Partial<Project>): Promise<void> => {
    setLoading(true)
    // TODO: Conectar con API real
    await new Promise((resolve) => setTimeout(resolve, 200))

    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)))
    setLoading(false)
  }, [])

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true)
      // TODO: Conectar con API real
      await new Promise((resolve) => setTimeout(resolve, 200))

      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (activeProject?.id === id) {
        setActiveProject(null)
      }
      setLoading(false)
    },
    [activeProject],
  )

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        setActiveProject,
        addProject,
        updateProject,
        deleteProject,
        loading,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}
