"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface RagContextPreviewProps {
  context: string
  retrievedDocuments: string[]
}

export function RagContextPreview({ context, retrievedDocuments }: RagContextPreviewProps) {
  const [expanded, setExpanded] = useState(false)

  const hasContext = context.trim().length > 0
  const hasRetrievedDocs = retrievedDocuments.length > 0
  const hasAnyContent = hasContext || hasRetrievedDocs

  if (!hasAnyContent) return null

  const combinedContext = [...(hasContext ? [context] : []), ...(hasRetrievedDocs ? retrievedDocuments : [])].join(
    "\n\n",
  )

  const previewText = expanded
    ? combinedContext
    : combinedContext.slice(0, 150) + (combinedContext.length > 150 ? "..." : "")

  return (
    <Card className="mb-4 bg-muted/30">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Database className="h-4 w-4 mr-2 text-primary" />
            Context for Prompt
            <Badge variant="outline" className="ml-2 text-xs">
              RAG Enabled
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4 pb-3">
        <ScrollArea className={`rounded text-sm text-muted-foreground ${expanded ? "max-h-[200px]" : ""}`}>
          <pre className="whitespace-pre-wrap font-sans">{previewText}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
