"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Vote, Users, Target, AlertTriangle, CheckCircle2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface ConsensusItem {
  id: string
  aspect: string
  proposals: Record<string, string> // model -> proposal
  votes: Record<string, string> // model -> voted_for_model
  consensus: number // 0-100%
  finalDecision: string
  conflictResolution?: string
}

interface ConsensusBuilderProps {
  consensusItems: ConsensusItem[]
  isBuilding: boolean
  onStartConsensus: () => void
  collectiveConfidence: number
}

export function ConsensusBuilder({
  consensusItems,
  isBuilding,
  onStartConsensus,
  collectiveConfidence,
}: ConsensusBuilderProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const getConsensusColor = (consensus: number) => {
    if (consensus >= 80) return "text-green-600"
    if (consensus >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getConsensusIcon = (consensus: number) => {
    if (consensus >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />
    if (consensus >= 60) return <Target className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Vote className="h-5 w-5 mr-2 text-primary" />
            Collective Decision Process
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Confidence: {collectiveConfidence}%</Badge>
            {consensusItems.length === 0 && (
              <Button onClick={onStartConsensus} variant="outline" size="sm" disabled={isBuilding}>
                {isBuilding ? "Building Consensus..." : "Start Consensus Building"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isBuilding && (
          <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/50 rounded-md">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm">Models are negotiating and building consensus...</span>
          </div>
        )}

        {consensusItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm">Decision Aspects</h4>
              <div className="text-sm text-muted-foreground">
                {consensusItems.filter((item) => item.consensus >= 80).length} / {consensusItems.length} consensus
                reached
              </div>
            </div>

            <ScrollArea className="max-h-[400px]">
              {consensusItems.map((item) => (
                <div key={item.id} className="border rounded-md p-4 mb-3">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {getConsensusIcon(item.consensus)}
                      <span className="font-medium text-sm">{item.aspect}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getConsensusColor(item.consensus)}`}>
                        {item.consensus}% consensus
                      </span>
                      <Progress value={item.consensus} className="w-16 h-2" />
                    </div>
                  </div>

                  {expandedItem === item.id && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Model Proposals:</h5>
                        {Object.entries(item.proposals).map(([model, proposal]) => (
                          <div key={model} className="text-sm p-2 bg-muted/30 rounded mb-2">
                            <span className="font-medium">{model}:</span> {proposal}
                          </div>
                        ))}
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-2">Voting Results:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(item.votes).map(([voter, votedFor]) => (
                            <div key={voter} className="flex justify-between">
                              <span>{voter} voted for:</span>
                              <span className="font-medium">{votedFor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {item.conflictResolution && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Conflict Resolution:</h5>
                          <p className="text-sm p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border-l-4 border-yellow-400">
                            {item.conflictResolution}
                          </p>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-sm mb-2">Final Decision:</h5>
                        <p className="text-sm p-2 bg-green-50 dark:bg-green-950/20 rounded border-l-4 border-green-400">
                          {item.finalDecision}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {consensusItems.length === 0 && !isBuilding && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start the consensus building process to see how models reach collective decisions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
