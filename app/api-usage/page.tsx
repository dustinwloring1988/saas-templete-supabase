'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Copy, Key, Plus, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sidebar } from "@/components/Sidebar"
import { ApiCostChart } from "@/components/ApiCostChart"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for API usage
const apiUsage = {
  totalRequests: 10000,
  successfulRequests: 9800,
  failedRequests: 200,
  averageResponseTime: '120ms',
}

// Mock data for API keys
const initialApiKeys = [
  { id: 1, name: 'Production Key', token: 'abcd************', createdAt: '2023-01-01', expiresAt: '2024-01-01' },
  { id: 2, name: 'Development Key', token: 'efgh************', createdAt: '2023-02-15', expiresAt: '2023-12-31' },
]

export default function ApiPage() {
  const [apiKeys, setApiKeys] = useState(initialApiKeys)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyExpiration, setNewKeyExpiration] = useState('')
  const [noExpiration, setNoExpiration] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)

  const generateApiKey = () => {
    if (!noExpiration && !newKeyExpiration) {
      throw new Error("Please set an expiration date or select 'No Expiration'")
    }
    const newKey = {
      id: apiKeys.length + 1,
      name: newKeyName,
      token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: noExpiration ? 'Never' : newKeyExpiration,
    }
    setApiKeys([...apiKeys, newKey])
    setNewKeyName('')
    setNewKeyExpiration('')
    setNoExpiration(false)
    return newKey.token
  }

  const deleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h2 className="text-2xl font-semibold mb-4">API Usage</h2>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Your current API usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Requests</p>
                  <p className="text-2xl font-bold">{apiUsage.totalRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Successful Requests</p>
                  <p className="text-2xl font-bold text-green-600">{apiUsage.successfulRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Failed Requests</p>
                  <p className="text-2xl font-bold text-red-600">{apiUsage.failedRequests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Avg. Response Time</p>
                  <p className="text-2xl font-bold">{apiUsage.averageResponseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <ApiCostChart />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Plus className="mr-2 h-4 w-4" /> New Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{newApiKey ? 'New API Key Created' : 'Generate New API Key'}</DialogTitle>
                    <DialogDescription>
                      {newApiKey
                        ? 'Your new API key has been created. Please copy it now as you won\'t be able to see it again.'
                        : 'Create a new API key by providing a name and expiration date.'}
                    </DialogDescription>
                  </DialogHeader>
                  {newApiKey ? (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newApiKey" className="text-right">
                          API Key
                        </Label>
                        <Input
                          id="newApiKey"
                          value={newApiKey}
                          readOnly
                          className="col-span-3"
                        />
                      </div>
                      <Button onClick={() => copyToClipboard(newApiKey)} className="w-full">
                        <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="keyName" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="keyName"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="keyExpiration" className="text-right">
                          Expires
                        </Label>
                        <Input
                          id="keyExpiration"
                          type="date"
                          value={newKeyExpiration}
                          onChange={(e) => setNewKeyExpiration(e.target.value)}
                          className="col-span-3"
                          disabled={noExpiration}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="noExpiration"
                          checked={noExpiration}
                          onCheckedChange={(checked) => {
                            setNoExpiration(checked as boolean)
                            if (checked) {
                              setNewKeyExpiration('')
                            }
                          }}
                        />
                        <Label htmlFor="noExpiration">No Expiration</Label>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end">
                    {!newApiKey && (
                      <Button onClick={() => {
                        if (noExpiration || newKeyExpiration) {
                          const apiKey = generateApiKey()
                          setNewApiKey(apiKey)
                        } else {
                          alert("Please either set an expiration date or check 'No Expiration'")
                        }
                      }}>
                        <Key className="mr-2 h-4 w-4" /> Generate API Key
                      </Button>
                    )}
                    {newApiKey && (
                      <Button onClick={() => {
                        setIsDialogOpen(false)
                        setNewApiKey(null)
                      }}>
                        Close
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>{key.name}</TableCell>
                      <TableCell>{key.token.slice(0, 4) + '*'.repeat(key.token.length - 4)}</TableCell>
                      <TableCell>{key.createdAt}</TableCell>
                      <TableCell>{key.expiresAt === 'Never' ? 'Never' : key.expiresAt}</TableCell>
                      <TableCell>
                        <Button variant="destructive" size="sm" onClick={() => deleteApiKey(key.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}