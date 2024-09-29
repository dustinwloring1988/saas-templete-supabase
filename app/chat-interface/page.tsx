'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sidebar } from "@/components/Sidebar"
import { SendIcon, Code2Icon, CopyIcon, CheckIcon, DownloadIcon, ChevronDownIcon, ChevronUpIcon, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthWrapper } from "@/components/AuthWrapper"
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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

interface ChatHistory {
  id: string
  messages: Message[]
}

export default function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inputMessage, setInputMessage] = useState('')

  useEffect(() => {
    const chatIdParam = searchParams.get('id')
    if (chatIdParam) {
      setChatId(chatIdParam)
      loadChatHistory(chatIdParam)
    } else {
      setMessages([{ id: 1, content: "Hello! I'm your AI coding assistant. How can I help you today?", sender: 'ai' }])
      setIsLoading(false)
    }
  }, [searchParams])

  const loadChatHistory = async (id: string) => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading chat history:', error)
      setIsLoading(false)
      return
    }

    if (data) {
      const formattedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        content: msg.message,
        sender: msg.role as 'user' | 'ai'
      }))
      setMessages(formattedMessages)
    }
    setIsLoading(false)
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return

    const newMessage: Message = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
    }

    setMessages(prevMessages => [...prevMessages, newMessage])
    setInputMessage('')

    if (!chatId) {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .insert({ user_id: (await supabase.auth.getUser()).data.user?.id, message: inputMessage, role: 'user' })
        .select()

      if (error) {
        console.error('Error creating new chat:', error)
        return
      }

      if (data && data[0]) {
        setChatId(data[0].id)
        router.push(`/chat?id=${data[0].id}`)
      }
    } else {
      await supabase
        .from('ai_chat_history')
        .insert({ id: chatId, user_id: (await supabase.auth.getUser()).data.user?.id, message: inputMessage, role: 'user' })
    }

    // Always respond with 'work in progress'
    const aiResponse: Message = {
      id: Date.now() + 1,
      content: 'work in progress',
      sender: 'ai',
    }

    setMessages(prevMessages => [...prevMessages, aiResponse])

    if (chatId) {
      supabase.auth.getUser().then(user => {
        supabase
          .from('ai_chat_history')
          .insert({ id: chatId, user_id: user.data.user?.id, message: aiResponse.content, role: 'assistant' })
          .then(undefined, (error) => {
            console.error('Error inserting chat history:', error);
          });
      });
    }
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-hidden">
          <Card className="w-full h-full mx-auto flex flex-col">
            <CardHeader className="py-4">
              <CardTitle>Chat with AI</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col">
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
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthWrapper>
  )
}