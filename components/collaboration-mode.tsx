"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ArrowRight, Lightbulb, Target, CheckCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConsensusBuilder } from "@/components/consensus-builder"
import { CollectiveIntelligencePanel } from "@/components/collective-intelligence-panel"
import { useState } from "react"
import type { ConsensusItem, CollectiveMetrics } from "@/lib/consensus-engine"

interface CollaborationStep {
  id: string
  type: "acknowledgment" | "synthesis" | "refinement" | "conclusion"
  model: string
  content: string
  timestamp: Date
}

interface CollaborationModeProps {
  originalResponses: Record<string, string>
  collaborationSteps: CollaborationStep[]
  finalSynthesis: string
  isCollaborating: boolean
  onStartCollaboration: () => void
  consensusItems: ConsensusItem[]
  collectiveMetrics: CollectiveMetrics
  onStartConsensus: () => void
  isBuildingConsensus: boolean
}

export function CollaborationMode({
  originalResponses,
  collaborationSteps,
  finalSynthesis,
  isCollaborating,
  onStartCollaboration,
  consensusItems,
  collectiveMetrics,
  onStartConsensus,
  isBuildingConsensus,
}: CollaborationModeProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const getStepIcon = (type: CollaborationStep["type"]) => {
    switch (type) {
      case "acknowledgment":
        return <Users className="h-4 w-4 text-blue-500" />
      case "synthesis":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case "refinement":
        return <ArrowRight className="h-4 w-4 text-purple-500" />
      case "conclusion":
        return <Target className="h-4 w-4 text-green-500" />
    }
  }

  const getStepColor = (type: CollaborationStep["type"]) => {
    switch (type) {
      case "acknowledgment":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
      case "synthesis":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
      case "refinement":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20"
      case "conclusion":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20"
    }
  }

  const getStepLabel = (type: CollaborationStep["type"]) => {
    switch (type) {
      case "acknowledgment":
        return "Acknowledging Perspectives"
      case "synthesis":
        return "Synthesizing Ideas"
      case "refinement":
        return "Refining Approach"
      case "conclusion":
        return "Collaborative Conclusion"
    }
  }

  return (
    <div className="space-y-4">
      <CollectiveIntelligencePanel metrics={collectiveMetrics} isActive={consensusItems.length > 0} />

      <ConsensusBuilder
        consensusItems={consensusItems}
        isBuilding={isBuildingConsensus}
        onStartConsensus={onStartConsensus}
        collectiveConfidence={collectiveMetrics.collectiveConfidence}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              AI Collaboration Process
              <Badge variant="outline" className="ml-2">
                Synthesis
              </Badge>
            </CardTitle>
            {!isCollaborating && collaborationSteps.length === 0 && (
              <Button onClick={onStartCollaboration} variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Start Collaboration
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Models work together through structured consensus-building to create collective intelligence.
          </p>

          {isCollaborating && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/50 rounded-md">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Models are collaborating...</span>
            </div>
          )}

          {collaborationSteps.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Collaboration Process:</h4>
              <ScrollArea className="max-h-[400px]">
                {collaborationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`border-l-4 p-4 mb-3 rounded-r-md cursor-pointer transition-all ${getStepColor(step.type)}`}
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStepIcon(step.type)}
                        <span className="font-medium text-sm">{step.model}</span>
                        <Badge variant="outline" className="text-xs">
                          {getStepLabel(step.type)}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                    </div>
                    <div className={`text-sm ${expandedStep === step.id ? "" : "line-clamp-2"}`}>{step.content}</div>
                    {step.content.length > 100 && (
                      <button className="text-xs text-primary mt-1 hover:underline">
                        {expandedStep === step.id ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          {finalSynthesis && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-md border">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold">Collective Decision Result</h4>
              </div>
              <ScrollArea className="max-h-[300px]">
                <div className="text-sm leading-relaxed whitespace-pre-line">{finalSynthesis}</div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
