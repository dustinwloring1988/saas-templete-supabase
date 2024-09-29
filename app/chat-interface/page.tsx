'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sidebar } from "@/components/Sidebar"
import { SendIcon, Code2Icon, CopyIcon, CheckIcon, DownloadIcon, ChevronDownIcon, ChevronUpIcon, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: number
  content: string
  sender: 'user' | 'ai'
}

interface CodeSnippet {
  id: number
  filename: string
  content: string
  language: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hello! I'm your AI coding assistant. How can I help you today?", sender: 'ai' },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [expandedSnippets, setExpandedSnippets] = useState<Set<number>>(new Set())
  const [isCodeSnippetsVisible, setIsCodeSnippetsVisible] = useState(true)

  useEffect(() => {
    // Extract code snippets from AI messages
    const newSnippets = messages
      .filter(msg => msg.sender === 'ai')
      .flatMap(msg => {
        const regex = /```(\w+)\n([\s\S]*?)```/g
        const matches = Array.from(msg.content.matchAll(regex))
        return matches.map((match, index) => ({
          id: Date.now() + index,
          filename: `snippet_${codeSnippets.length + index + 1}.${match[1]}`,
          content: match[2],
          language: match[1]
        }))
      })
    setCodeSnippets(prevSnippets => [...prevSnippets, ...newSnippets])
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
    }

    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputMessage('')

    // Simulate AI response with one of four different types
    setTimeout(() => {
      const responseType = Math.floor(Math.random() * 4)
      let aiResponse: Message

      switch (responseType) {
        case 0:
          // Python snippet (existing case)
          aiResponse = {
            id: Date.now() + 1,
            content: `Here's a Python snippet for you:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
\`\`\`

This code defines a recursive Fibonacci function and prints the first 10 Fibonacci numbers.`,
            sender: 'ai',
          }
          break
        case 1:
          // Message with CSV list (existing case)
          aiResponse = {
            id: Date.now() + 1,
            content: `Here are the top 5 programming languages according to the TIOBE Index:

1. Python
2. C
3. C++
4. Java
5. C#

CSV format:
language,rank
Python,1
C,2
C++,3
Java,4
C#,5`,
            sender: 'ai',
          }
          break
        case 2:
          // Joke (existing case)
          aiResponse = {
            id: Date.now() + 1,
            content: `Here's a programming joke for you:

Why do programmers prefer dark mode?

Because light attracts bugs! 🐛💡😄`,
            sender: 'ai',
          }
          break
        case 3:
          // New case: JavaScript snippet
          aiResponse = {
            id: Date.now() + 1,
            content: `Here's a JavaScript snippet for you:

\`\`\`javascript
// Async function to fetch data from an API
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the user data:', error);
  }
}

// Usage
fetchUserData(123)
  .then(userData => {
    console.log('User data:', userData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
\`\`\`

This JavaScript code defines an asynchronous function to fetch user data from an API. It uses modern JavaScript features like async/await and template literals.`,
            sender: 'ai',
          }
          break
      }

      setMessages(prevMessages => [...prevMessages, aiResponse])
    }, 1000)
  }

  const copyToClipboard = (content: string, id: number) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleSnippet = (id: number) => {
    setExpandedSnippets(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const [, language, code] = part.match(/```(\w+)?\n?([\s\S]+?)```/) || [];
        return (
          <pre key={index} className="bg-gray-800 rounded-md p-4 my-2 overflow-x-auto">
            <code className="text-sm font-mono text-gray-200">{code.trim()}</code>
          </pre>
        );
      }
      return <p key={index}>{part}</p>;
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        <Card className="w-full h-full mx-auto flex flex-col">
          <CardHeader className="py-4">
            <CardTitle>Chat with AI</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden flex flex-col md:flex-row gap-4">
            <div className="flex-grow md:w-2/3 flex flex-col">
              <ScrollArea className="flex-grow pr-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    } mb-4`}
                  >
                    <div
                      className={`${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      } rounded-lg px-4 py-2 max-w-[80%] shadow-md`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  id="message"
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
            <div className="md:w-1/3 flex flex-col">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCodeSnippetsVisible(!isCodeSnippetsVisible)}
                className="mb-2 self-end"
              >
                {isCodeSnippetsVisible ? 'Hide' : 'Show'} Snippets
              </Button>
              {isCodeSnippetsVisible && (
                <Card className="flex-grow overflow-hidden">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Code Snippets</h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-300px)] w-full">
                      <Tabs defaultValue="snippets" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="snippets" className="flex-grow">Snippets</TabsTrigger>
                          <TabsTrigger value="files" className="flex-grow">Files</TabsTrigger>
                        </TabsList>
                        <TabsContent value="snippets" className="p-4">
                          {codeSnippets.map((snippet) => (
                            <div key={snippet.id} className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">{snippet.language}</span>
                                <div className="flex items-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSnippet(snippet.id)}
                                  >
                                    {expandedSnippets.has(snippet.id) ? (
                                      <ChevronUpIcon className="h-4 w-4" />
                                    ) : (
                                      <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(snippet.content, snippet.id)}
                                  >
                                    {copiedId === snippet.id ? (
                                      <CheckIcon className="h-4 w-4" />
                                    ) : (
                                      <CopyIcon className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              {expandedSnippets.has(snippet.id) && (
                                <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                                  <code>{snippet.content}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </TabsContent>
                        <TabsContent value="files" className="p-4">
                          {codeSnippets.map((snippet) => (
                            <div key={snippet.id} className="mb-2 flex justify-between items-center">
                              <span className="text-sm">{snippet.filename}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(snippet.filename, snippet.content)}
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}