"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Users, Zap, Brain, TrendingUp, Settings } from "lucide-react"
import { useState } from "react"

interface IntegrationMetrics {
  promptLayer: {
    totalRequests: number
    avgLatency: number
    costSavings: number
    experimentsRunning: number
  }
  crewAI: {
    activeAgents: number
    tasksCompleted: number
    optimizationSuggestions: number
    automationSavings: number
  }
  langChain: {
    chainsCreated: number
    ragQueries: number
    evaluationsRun: number
    accuracyImprovement: number
  }
}

export function IntegrationsDashboard() {
  const [metrics] = useState<IntegrationMetrics>({
    promptLayer: {
      totalRequests: 15420,
      avgLatency: 1.2,
      costSavings: 2340,
      experimentsRunning: 3,
    },
    crewAI: {
      activeAgents: 8,
      tasksCompleted: 156,
      optimizationSuggestions: 23,
      automationSavings: 45,
    },
    langChain: {
      chainsCreated: 12,
      ragQueries: 890,
      evaluationsRun: 67,
      accuracyImprovement: 18,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Integrations Dashboard</h2>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            PromptLayer Connected
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            CrewAI Active
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            LangChain Enabled
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="promptlayer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promptlayer">PromptLayer</TabsTrigger>
          <TabsTrigger value="crewai">CrewAI</TabsTrigger>
          <TabsTrigger value="langchain">LangChain</TabsTrigger>
        </TabsList>

        <TabsContent value="promptlayer" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.promptLayer.totalRequests.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.promptLayer.avgLatency}s</div>
                <p className="text-xs text-muted-foreground">-8% improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.promptLayer.costSavings}</div>
                <p className="text-xs text-muted-foreground">Through optimization</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.promptLayer.experimentsRunning}</div>
                <p className="text-xs text-muted-foreground">A/B testing prompts</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Summarization Prompt Optimization</p>
                    <p className="text-sm text-muted-foreground">Testing 3 variants across GPT-4 and Claude</p>
                  </div>
                  <Badge variant="outline">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">RAG Context Length Study</p>
                    <p className="text-sm text-muted-foreground">Optimizing context window usage</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Complete
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crewai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.crewAI.activeAgents}</div>
                <p className="text-xs text-muted-foreground">Specialized AI agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.crewAI.tasksCompleted}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimization Tips</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.crewAI.optimizationSuggestions}</div>
                <p className="text-xs text-muted-foreground">Generated by agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.crewAI.automationSavings}h</div>
                <p className="text-xs text-muted-foreground">Through automation</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Prompt Analyst</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Analyzing prompt patterns</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Model Evaluator</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Running quality assessments</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Consensus Builder</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Facilitating model collaboration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="langchain" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chains Created</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.langChain.chainsCreated}</div>
                <p className="text-xs text-muted-foreground">Custom processing chains</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RAG Queries</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.langChain.ragQueries}</div>
                <p className="text-xs text-muted-foreground">Enhanced with context</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.langChain.evaluationsRun}</div>
                <p className="text-xs text-muted-foreground">Automated assessments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Boost</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{metrics.langChain.accuracyImprovement}%</div>
                <p className="text-xs text-muted-foreground">Through chain optimization</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chain Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Analysis Chain</span>
                    <span>92% accuracy</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>RAG Chain</span>
                    <span>88% relevance</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Evaluation Chain</span>
                    <span>95% consistency</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Integration Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Configure PromptLayer Experiments
            </Button>
            <Button variant="outline" size="sm">
              Deploy New CrewAI Agents
            </Button>
            <Button variant="outline" size="sm">
              Optimize LangChain Chains
            </Button>
            <Button variant="outline" size="sm">
              View Integration Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
