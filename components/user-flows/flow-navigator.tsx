"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, AlertCircle, Clock, Users, Brain, Zap, BarChart, HelpCircle } from "lucide-react"

interface FlowStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "completed" | "error"
  duration?: string
  optional?: boolean
}

interface UserFlow {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  complexity: "beginner" | "intermediate" | "expert"
  estimatedTime: string
  steps: FlowStep[]
}

export function FlowNavigator() {
  const [selectedFlow, setSelectedFlow] = useState<string>("basic-comparison")
  const [currentStep, setCurrentStep] = useState(0)

  const flows: UserFlow[] = [
    {
      id: "basic-comparison",
      title: "Basic Model Comparison",
      description: "Compare responses from multiple AI models",
      icon: <Brain className="h-5 w-5" />,
      complexity: "beginner",
      estimatedTime: "2-3 minutes",
      steps: [
        {
          id: "prompt-input",
          title: "Enter Your Prompt",
          description: "Type your question or task",
          status: "completed",
          duration: "30s",
        },
        {
          id: "model-selection",
          title: "Select Models",
          description: "Choose which AI models to compare",
          status: "completed",
          duration: "15s",
        },
        {
          id: "execution",
          title: "Run Comparison",
          description: "Send prompts to selected models",
          status: "active",
          duration: "1-2 min",
        },
        {
          id: "results-review",
          title: "Review Results",
          description: "Compare and analyze responses",
          status: "pending",
          duration: "2-5 min",
        },
        {
          id: "action",
          title: "Take Action",
          description: "Save, share, or iterate on results",
          status: "pending",
          duration: "1 min",
          optional: true,
        },
      ],
    },
    {
      id: "rag-enhanced",
      title: "RAG-Enhanced Comparison",
      description: "Upload documents to enhance AI responses with context",
      icon: <Zap className="h-5 w-5" />,
      complexity: "intermediate",
      estimatedTime: "5-7 minutes",
      steps: [
        {
          id: "rag-setup",
          title: "Enable RAG Mode",
          description: "Turn on document-enhanced responses",
          status: "pending",
          duration: "10s",
        },
        {
          id: "document-upload",
          title: "Upload Documents",
          description: "Add context documents (PDF, TXT, DOCX)",
          status: "pending",
          duration: "1-2 min",
        },
        {
          id: "processing",
          title: "Document Processing",
          description: "System indexes and chunks documents",
          status: "pending",
          duration: "30s-2 min",
        },
        {
          id: "context-retrieval",
          title: "Context Retrieval",
          description: "Find relevant context for your prompt",
          status: "pending",
          duration: "15s",
        },
        {
          id: "enhanced-comparison",
          title: "Enhanced Comparison",
          description: "Compare models with document context",
          status: "pending",
          duration: "1-2 min",
        },
        {
          id: "results-with-sources",
          title: "Review Results & Sources",
          description: "Analyze responses with context sources",
          status: "pending",
          duration: "3-5 min",
        },
      ],
    },
    {
      id: "collaboration-mode",
      title: "AI Collaboration Mode",
      description: "Enable models to work together and reach consensus",
      icon: <Users className="h-5 w-5" />,
      complexity: "expert",
      estimatedTime: "8-12 minutes",
      steps: [
        {
          id: "initial-comparison",
          title: "Initial Comparison",
          description: "Run basic model comparison first",
          status: "pending",
          duration: "2-3 min",
        },
        {
          id: "diversity-detection",
          title: "Cognitive Diversity Detection",
          description: "System analyzes response differences",
          status: "pending",
          duration: "30s",
        },
        {
          id: "collaboration-trigger",
          title: "Enable Collaboration",
          description: "Choose to start model collaboration",
          status: "pending",
          duration: "10s",
        },
        {
          id: "structured-interaction",
          title: "Model Interaction",
          description: "Models acknowledge and build on each other's ideas",
          status: "pending",
          duration: "2-3 min",
        },
        {
          id: "consensus-building",
          title: "Consensus Building",
          description: "Democratic voting and conflict resolution",
          status: "pending",
          duration: "1-2 min",
        },
        {
          id: "collective-synthesis",
          title: "Collective Synthesis",
          description: "Final collaborative output generation",
          status: "pending",
          duration: "1-2 min",
        },
        {
          id: "transparency-review",
          title: "Review Process",
          description: "Examine collaboration audit trail",
          status: "pending",
          duration: "2-3 min",
        },
      ],
    },
    {
      id: "analytics-optimization",
      title: "Analytics & Optimization",
      description: "Track performance and optimize AI workflows",
      icon: <BarChart className="h-5 w-5" />,
      complexity: "intermediate",
      estimatedTime: "10-15 minutes",
      steps: [
        {
          id: "usage-review",
          title: "Review Usage Patterns",
          description: "Analyze your AI model usage history",
          status: "pending",
          duration: "3-5 min",
        },
        {
          id: "performance-analysis",
          title: "Performance Analysis",
          description: "Examine cost, speed, and quality metrics",
          status: "pending",
          duration: "2-3 min",
        },
        {
          id: "optimization-suggestions",
          title: "AI Optimization Suggestions",
          description: "Get AI-powered improvement recommendations",
          status: "pending",
          duration: "1-2 min",
        },
        {
          id: "ab-testing-setup",
          title: "A/B Testing Setup",
          description: "Configure automated prompt optimization",
          status: "pending",
          duration: "2-3 min",
          optional: true,
        },
        {
          id: "dashboard-customization",
          title: "Customize Dashboard",
          description: "Set up personalized analytics views",
          status: "pending",
          duration: "2-3 min",
          optional: true,
        },
      ],
    },
  ]

  const selectedFlowData = flows.find((flow) => flow.id === selectedFlow)!

  const getStatusIcon = (status: FlowStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "active":
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">User Flow Navigator</h1>
        <p className="text-muted-foreground">
          Explore different workflows and see how to accomplish your goals step by step
        </p>
      </div>

      <Tabs value={selectedFlow} onValueChange={setSelectedFlow}>
        <TabsList className="grid w-full grid-cols-4">
          {flows.map((flow) => (
            <TabsTrigger key={flow.id} value={flow.id} className="flex items-center space-x-2">
              {flow.icon}
              <span className="hidden sm:inline">{flow.title.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {flows.map((flow) => (
          <TabsContent key={flow.id} value={flow.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {flow.icon}
                    <div>
                      <CardTitle>{flow.title}</CardTitle>
                      <p className="text-muted-foreground">{flow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getComplexityColor(flow.complexity)}>{flow.complexity}</Badge>
                    <Badge variant="outline">{flow.estimatedTime}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {flow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(step.status)}
                        {index < flow.steps.length - 1 && <div className="w-px h-8 bg-muted-foreground/20 mt-2" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{step.title}</h4>
                            {step.optional && <Badge variant="outline">Optional</Badge>}
                          </div>
                          {step.duration && <span className="text-sm text-muted-foreground">{step.duration}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                        {step.status === "active" && (
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-sm text-blue-600 dark:text-blue-400">In Progress...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" size="sm">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Help
                  </Button>
                  <Button size="sm">
                    Start This Flow
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Flow Completion Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-muted-foreground">Flows Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-muted-foreground">Total Comparisons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
