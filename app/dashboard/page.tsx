"use client"

import { useState, useEffect } from "react"
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
import { AuthWrapper } from "@/components/AuthWrapper"
import { supabase, getCurrentUser } from '@/lib/supabase'

interface Project {
  id: string
  name: string
  created_at: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        setError('User not authenticated')
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select('id, name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to fetch projects. Please try again.')
    }
  }

  const handleRename = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newName })
        .eq('id', id)

      if (error) {
        throw error
      }

      setProjects(projects.map(p => p.id === id ? { ...p, name: newName } : p))
    } catch (error) {
      console.error('Error renaming project:', error)
      setError('Failed to rename project. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      console.log('Attempting to delete project with id:', id);
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Delete operation result:', data);

      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      console.error('Error type:', typeof error);
      console.error('Error stringified:', JSON.stringify(error));
      setError(`Failed to delete project: ${error instanceof Error ? error.message : 'Unknown error. Check console for details.'}`);
    }
  }

  const handleExportJSON = (project: Project) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", project.name + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const handleExportPDF = async (project: Project) => {
    // This is a placeholder. You'll need to implement PDF generation.
    // You might want to use a library like jsPDF or generate the PDF on the server side.
    console.log('Export to PDF not implemented yet');
    alert('Export to PDF feature coming soon!');
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/chat-interface?projectId=${projectId}`)
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer">
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
                          e.preventDefault();
                          e.stopPropagation();
                          const newName = prompt("Enter new name for the project:", project.name);
                          if (newName && newName !== project.name) {
                            handleRename(project.id, newName);
                          }
                        }}>
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleExportJSON(project);
                        }}>
                          Export to JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleExportPDF(project);
                        }}>
                          Export to PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this project?")) {
                            handleDelete(project.id);
                          }
                        }}>
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/chat-interface?projectId=${project.id}`);
                        }}>
                          Open Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </main>
      </div>
    </AuthWrapper>
  )
}