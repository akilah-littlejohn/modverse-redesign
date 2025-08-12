"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Sparkles } from "lucide-react"

interface AIAssistantProps {
  context: {
    currentTask: string
    userExperience: string
    recentActions: string[]
    strugglingWith?: string
  }
}

export function AIAssistant({ context }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      content:
        "Hi! I'm your AI assistant. I can help you navigate complex features, suggest optimizations, and explain what's happening behind the scenes. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [suggestions] = useState([
    "How do I choose the right models?",
    "What's the best prompt format?",
    "Explain RAG in simple terms",
    "Why are my results inconsistent?",
  ])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: "assistant",
        content: generateAIResponse(input, context),
        timestamp: new Date(),
        actions: generateSuggestedActions(input, context),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="h-5 w-5 mr-2 text-primary" />
          AI Assistant
          <Badge variant="outline" className="ml-2">
            Context-Aware
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.actions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.actions.map((action: any, i: number) => (
                        <Button key={i} variant="outline" size="sm" className="text-xs bg-transparent">
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick suggestions:</p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function generateAIResponse(input: string, context: any): string {
  const responses = {
    models:
      "Great question! For your current task, I'd recommend starting with GPT-4o and Claude 3 Opus. GPT-4o excels at analytical tasks, while Claude is great for nuanced reasoning. The system has already pre-selected these based on your prompt pattern.",

    prompt:
      "Here's a simple framework: Start with context, then your specific question, and end with the format you want. For example: 'Context: [your background info] Question: [specific ask] Format: [bullet points/paragraph/etc.]'",

    rag: "RAG (Retrieval-Augmented Generation) is like giving AI a research assistant. Instead of relying only on training data, it searches your documents for relevant info first, then uses that to answer. Think of it as 'AI + your knowledge base'.",

    inconsistent:
      "Inconsistent results usually come from vague prompts or wrong model selection. Try being more specific about what you want, and let me suggest the right models for your task type.",
  }

  // Simple keyword matching for demo
  const keyword = Object.keys(responses).find((key) => input.toLowerCase().includes(key))
  return keyword
    ? responses[keyword as keyof typeof responses]
    : "I understand you're asking about that. Let me help you break it down into simpler steps. What specific part would you like me to explain first?"
}

function generateSuggestedActions(input: string, context: any) {
  return [
    { label: "Show Example", action: "show-example" },
    { label: "Try It Now", action: "try-now" },
    { label: "Learn More", action: "learn-more" },
  ]
}
