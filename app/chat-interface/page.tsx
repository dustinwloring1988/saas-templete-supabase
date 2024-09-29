'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Image as ImageIcon, Send, X } from 'lucide-react'
import { Sidebar } from "@/components/Sidebar"
import { AuthWrapper } from "@/components/AuthWrapper"
import { supabase, getCurrentUser } from '@/lib/supabase'

type Message = {
  id?: string
  sender: 'user' | 'ai'
  text: string
  image?: string
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('AI Chat')
  const [projectId, setProjectId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadProjectAndChat = async () => {
      const user = await getCurrentUser()
      if (!user) return

      const projectId = searchParams.get('projectId')
      console.log('Project ID from searchParams:', projectId);
      if (projectId) {
        setProjectId(projectId)
        const { data: project } = await supabase
          .from('projects')
          .select('name')
          .eq('id', projectId)
          .single()

        if (project) {
          setProjectName(project.name)
        }

        const { data: chatHistory } = await supabase
          .from('ai_chat_history')
          .select('*')
          .match({ user_id: user.id, project_id: projectId })
          .order('created_at', { ascending: true })

        if (chatHistory) {
          setMessages(chatHistory.map(msg => ({
            id: msg.id,
            sender: msg.role as 'user' | 'ai',
            text: msg.message,
            image: msg.image || undefined
          })))
        }
      }
    }

    loadProjectAndChat()
  }, [searchParams])

  const handleSend = async () => {
    if (input.trim() || pendingImage) {
      const userMessage = input.trim();
      await addMessage('user', userMessage, pendingImage || undefined);
      setInput('');
      setPendingImage(null);

      // Simulate AI response (replace this with actual AI call later)
      const aiResponse = "I've received your message. How can I assist you further?";
      await addMessage('ai', aiResponse);

      // Save both user message and AI response to the database
      if (projectId) {
        await saveThread(projectId, [
          { sender: 'user', text: userMessage },
          { sender: 'ai', text: aiResponse }
        ]);
      }
    }
  }

  const addMessage = async (sender: 'user' | 'ai', text: string, image?: string) => {
    const newMessage: Message = { sender, text, image };
    setMessages(prev => [...prev, newMessage]);

    if (projectId) {
      const user = await getCurrentUser()
      if (user) {
        console.log('Attempting to save message:', { user_id: user.id, project_id: projectId, message: text, role: sender, image: image || null });
        const { data, error } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: user.id,
            project_id: projectId,
            message: text,
            role: sender,
            image: image || null
          })
          .select()

        if (data && data[0]) {
          newMessage.id = data[0].id
          console.log('Message saved successfully:', data[0]);
        }

        if (error) {
          console.error('Error saving message:', error)
        }
      } else {
        console.error('No user found when trying to save message');
      }
    } else {
      console.error('No projectId found when trying to save message');
    }

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 100)
  }

  const saveThread = async (projectId: string | null, messages: Message[]) => {
    if (!projectId) return;

    const user = await getCurrentUser();
    if (!user) return;

    try {
      for (const message of messages) {
        const { error } = await supabase
          .from('ai_chat_history')
          .insert({
            user_id: user.id,
            project_id: projectId,
            message: message.text,
            role: message.sender,
          image: message.image || null
        });

        if (error) {
          console.error('Error saving message:', error);
        }
      }
    } catch (error) {
      console.error('Error saving thread:', error);
    }
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setPendingImage(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <Card className="w-full max-w-2xl mx-auto">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold">{projectName}</h2>
            </div>
            <ScrollArea 
              className="h-[500px] p-4" 
              ref={chatContainerRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {messages.map((message, index) => (
                <div key={message.id || index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                    <Avatar className="w-8 h-8">
                      {message.sender === 'user' ? (
                        <AvatarFallback><User size={20} /></AvatarFallback>
                      ) : (
                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                      )}
                    </Avatar>
                    <div className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {message.text && <p className="mb-2">{message.text}</p>}
                      {message.image && <img src={message.image} alt="Uploaded" className="max-w-xs rounded" />}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 border-t">
              {pendingImage && (
                <div className="mb-2 relative">
                  <img src={pendingImage} alt="Pending upload" className="max-w-xs rounded" />
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="absolute top-1 right-1" 
                    onClick={() => setPendingImage(null)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Upload image</span>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                />
                <Button size="icon" onClick={handleSend}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              />
            </div>
          </Card>
        </main>
      </div>
    </AuthWrapper>
  )
}