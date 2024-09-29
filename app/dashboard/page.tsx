"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

interface Project {
  id: string
  name: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "Project A" },
    { id: "2", name: "Project B" },
    { id: "3", name: "Project C" },
  ])
  const router = useRouter()

  const handleRename = (id: string, newName: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, name: newName } : p))
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleClone = (project: Project) => {
    const newProject = { ...project, id: Date.now().toString(), name: `${project.name} (Copy)` }
    setProjects([...projects, newProject])
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/chat-interface?projectId=${projectId}`)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} onClick={() => handleProjectClick(project.id)} className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {project.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        const newName = prompt("Enter new name", project.name)
                        if (newName) handleRename(project.id, newName)
                      }}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        handleDelete(project.id)
                      }}>
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault()
                        handleClone(project)
                      }}>
                        Clone
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}