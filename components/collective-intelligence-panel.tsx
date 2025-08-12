"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Users, Zap } from "lucide-react"

interface CollectiveMetrics {
  agreementLevel: number
  diversityIndex: number
  synthesisQuality: number
  collectiveConfidence: number
  emergentInsights: string[]
}

interface CollectiveIntelligencePanelProps {
  metrics: CollectiveMetrics
  isActive: boolean
}

export function CollectiveIntelligencePanel({ metrics, isActive }: CollectiveIntelligencePanelProps) {
  if (!isActive) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
    return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Collective Intelligence Metrics
          <Badge variant="outline" className="ml-2">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-3 rounded-md border ${getScoreBg(metrics.agreementLevel)}`}>
            <div className="flex items-center justify-between mb-2">
              <Users className="h-4 w-4" />
              <span className={`text-sm font-medium ${getScoreColor(metrics.agreementLevel)}`}>
                {metrics.agreementLevel}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Agreement Level</div>
            <Progress value={metrics.agreementLevel} className="h-1 mt-1" />
          </div>

          <div className={`p-3 rounded-md border ${getScoreBg(metrics.diversityIndex)}`}>
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-4 w-4" />
              <span className={`text-sm font-medium ${getScoreColor(metrics.diversityIndex)}`}>
                {metrics.diversityIndex}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Diversity Index</div>
            <Progress value={metrics.diversityIndex} className="h-1 mt-1" />
          </div>

          <div className={`p-3 rounded-md border ${getScoreBg(metrics.synthesisQuality)}`}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className={`text-sm font-medium ${getScoreColor(metrics.synthesisQuality)}`}>
                {metrics.synthesisQuality}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Synthesis Quality</div>
            <Progress value={metrics.synthesisQuality} className="h-1 mt-1" />
          </div>

          <div className={`p-3 rounded-md border ${getScoreBg(metrics.collectiveConfidence)}`}>
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-4 w-4" />
              <span className={`text-sm font-medium ${getScoreColor(metrics.collectiveConfidence)}`}>
                {metrics.collectiveConfidence}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Collective Confidence</div>
            <Progress value={metrics.collectiveConfidence} className="h-1 mt-1" />
          </div>
        </div>

        {metrics.emergentInsights.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Emergent Insights
            </h4>
            <div className="space-y-2">
              {metrics.emergentInsights.map((insight, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-400"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
