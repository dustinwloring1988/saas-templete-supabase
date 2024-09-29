'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sidebar } from "@/components/Sidebar"
import { useState } from "react"
import { AuthWrapper } from "@/components/AuthWrapper"
import { supabase, getCurrentUser } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [framework, setFramework] = useState('')
  const [error, setError] = useState('')

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      setError('Please enter a project name')
      return
    }
    if (!framework) {
      setError('Please select a framework')
      return
    }
    setError('')

    try {
      // Get the current user
      const user = await getCurrentUser()
      if (!user) {
        setError('User not authenticated')
        return
      }

      console.log('Current user:', user)  // Log the user object

      // Create a new project entry in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          framework: framework,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from Supabase')
      }

      console.log('Project created successfully:', data)

      // Here you would typically handle the actual deployment logic
      // For now, we'll just navigate to the chat-interface
      router.push('/chat-interface')
    } catch (error: unknown) {
      console.error('Error deploying project:', error)
      if (error instanceof Error) {
        setError(`Failed to deploy project: ${error.message}`)
      } else {
        setError(`Failed to deploy project: Unknown error`)
      }
    }
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Name of your project" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Framework</Label>
                    <Select value={framework} onValueChange={setFramework}>
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="next">Next.js</SelectItem>
                        <SelectItem value="sveltekit">SvelteKit</SelectItem>
                        <SelectItem value="astro">Astro</SelectItem>
                        <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleDeploy}>Deploy</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </AuthWrapper>
  )
}
