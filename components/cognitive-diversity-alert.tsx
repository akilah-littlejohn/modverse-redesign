"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Users } from "lucide-react"

interface CognitiveDiversityAlertProps {
  summary: string
  onDebate: () => void
  onCollaborate: () => void
  debateMode: boolean
  collaborationMode: boolean
}

export function CognitiveDiversityAlert({
  summary,
  onDebate,
  onCollaborate,
  debateMode,
  collaborationMode,
}: CognitiveDiversityAlertProps) {
  return (
    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
      <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2">
        Cognitive Diversity Detected
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400 mt-2">
        <p className="mb-3">{summary}</p>
        <div className="flex gap-2 flex-wrap">
          {!debateMode && (
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-100 border-amber-300 hover:bg-amber-200 dark:bg-amber-900/30 dark:border-amber-700 dark:hover:bg-amber-900/50"
              onClick={onDebate}
            >
              <Zap className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
              Trigger Debate Mode
            </Button>
          )}
          {!collaborationMode && (
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-100 border-blue-300 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700 dark:hover:bg-blue-900/50"
              onClick={onCollaborate}
            >
              <Users className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
              Start Collaboration
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
