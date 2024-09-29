'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Sidebar() {
  const router = useRouter()

  return (
    <aside className="w-64 bg-background border-r h-screen flex flex-col">
      <div className="p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4">SaaS Template</h1>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/settings')}>Settings</Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/billing')}>Billing</Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/api-usage')}>API</Button>
          <Separator className="my-4" />
          <Button variant="outline" className="w-full" onClick={() => router.push('/new-project')}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </nav>
      </div>
      <div className="p-4 flex justify-between items-center">
        <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/')}>Log Out</Button>
        <ThemeToggle />
      </div>
    </aside>
  )
}
