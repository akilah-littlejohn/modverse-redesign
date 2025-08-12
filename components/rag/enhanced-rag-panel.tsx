"use client"

// UPDATED: Enhanced RAG panel using LangChain capabilities
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Search, Zap, TrendingUp } from "lucide-react"

interface EnhancedRAGPanelProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onRetrieve: (options: any) => void
  retrievalResults: {
    documents: string[]
    scores: number[]
    metadata: any[]
    confidence: number
  }
  isRetrieving: boolean
}

export function EnhancedRAGPanel({
  enabled,
  onToggle,
  onRetrieve,
  retrievalResults,
  isRetrieving,
}: EnhancedRAGPanelProps) {
  const [ragMode, setRagMode] = useState<"basic" | "advanced" | "multi-step">("basic")
  const [minScore, setMinScore] = useState(0.7)
  const [maxResults, setMaxResults] = useState(3)

  const handleRetrieve = () => {
    const options = {
      mode: ragMode,
      k: maxResults,
      minScore: ragMode === "advanced" ? minScore : 0,
      rerank: ragMode === "advanced",
      multiStep: ragMode === "multi-step",
    }
    onRetrieve(options)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            Enhanced RAG System
            <Badge variant="outline" className="ml-2">
              LangChain Powered
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{enabled ? "Enabled" : "Disabled"}</span>
            <Button variant="outline" size="sm" onClick={() => onToggle(!enabled)}>
              {enabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-4">
          <Tabs value={ragMode} onValueChange={(value: any) => setRagMode(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic RAG</TabsTrigger>
              <TabsTrigger value="advanced">Advanced RAG</TabsTrigger>
              <TabsTrigger value="multi-step">Multi-Step RAG</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3">
              <p className="text-sm text-muted-foreground">Standard vector similarity search with document chunking</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Results:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium">{maxResults}</span>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Enhanced retrieval with scoring, filtering, and re-ranking
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Min Score:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={minScore}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{minScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Max Results:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{maxResults}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="multi-step" className="space-y-3">
              <p className="text-sm text-muted-foreground">Multi-step retrieval with query expansion and refinement</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Query Expansion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Result Refinement</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Results Display */}
          {retrievalResults.documents.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Retrieved Documents</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Confidence: {Math.round(retrievalResults.confidence * 100)}%</Badge>
                  <Badge variant="outline">{retrievalResults.documents.length} docs</Badge>
                </div>
              </div>

              <div className="space-y-2">
                {retrievalResults.documents.map((doc, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Document {index + 1}</span>
                      {retrievalResults.scores[index] && (
                        <div className="flex items-center space-x-2">
                          <Progress value={retrievalResults.scores[index] * 100} className="w-16 h-2" />
                          <span className="text-xs">{Math.round(retrievalResults.scores[index] * 100)}%</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm line-clamp-3">{doc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleRetrieve} disabled={isRetrieving} className="w-full">
            {isRetrieving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Retrieving...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Retrieve Context ({ragMode})
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
