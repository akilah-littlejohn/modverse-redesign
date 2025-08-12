"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare, Zap } from "lucide-react"
import { ModelResponse } from "@/components/model-response"
import { CognitiveDiversityAlert } from "@/components/cognitive-diversity-alert"
import { CollaborationMode } from "@/components/collaboration-mode"
import { ModelSelector } from "@/components/model-selector"
import { RagContextPanel } from "@/components/rag-context-panel"
import { RagContextPreview } from "@/components/rag-context-preview"
import { retrieveContext, formatRagPrompt } from "@/lib/rag-service"
import { generateCollaboration, type CollaborationStep } from "@/lib/collaboration-engine"
import { useToast } from "@/hooks/use-toast"
import { buildConsensus, type ConsensusItem, type CollectiveMetrics } from "@/lib/consensus-engine"

type ModelId = "openai/gpt-4o" | "anthropic/claude-3-opus" | "meta-llama/llama-3" | "mistralai/mistral-large"

interface ModelData {
  id: ModelId
  name: string
  provider: string
}

const AVAILABLE_MODELS: ModelData[] = [
  { id: "openai/gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "meta-llama/llama-3", name: "Llama 3", provider: "Meta" },
  { id: "mistralai/mistral-large", name: "Mistral Large", provider: "Mistral AI" },
]

export function CompareMode() {
  const [prompt, setPrompt] = useState("")
  const [selectedModels, setSelectedModels] = useState<ModelId[]>(["openai/gpt-4o", "anthropic/claude-3-opus"])
  const [responses, setResponses] = useState<Record<ModelId, string>>({} as Record<ModelId, string>)
  const [loading, setLoading] = useState<Record<ModelId, boolean>>({} as Record<ModelId, boolean>)
  const [error, setError] = useState<Record<ModelId, string | null>>({} as Record<ModelId, string | null>)
  const [diversityDetected, setDiversityDetected] = useState(false)
  const [diversitySummary, setDiversitySummary] = useState("")
  const [debateMode, setDebateMode] = useState(false)
  const [debateResponses, setDebateResponses] = useState<Record<string, string>>({})
  const [collaborationMode, setCollaborationMode] = useState(false)
  const [collaborationSteps, setCollaborationSteps] = useState<CollaborationStep[]>([])
  const [finalSynthesis, setFinalSynthesis] = useState("")
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [consensusItems, setConsensusItems] = useState<ConsensusItem[]>([])
  const [collectiveMetrics, setCollectiveMetrics] = useState<CollectiveMetrics>({
    agreementLevel: 0,
    diversityIndex: 0,
    synthesisQuality: 0,
    collectiveConfidence: 0,
    emergentInsights: [],
  })
  const [isBuildingConsensus, setIsBuildingConsensus] = useState(false)

  // RAG state
  const [ragEnabled, setRagEnabled] = useState(false)
  const [manualContext, setManualContext] = useState("")
  const [retrievedDocuments, setRetrievedDocuments] = useState<string[]>([])
  const [isRetrieving, setIsRetrieving] = useState(false)

  const { toast } = useToast()

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value)
  }

  const handleRetrieveContext = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to retrieve context for.",
        variant: "destructive",
      })
      return
    }

    setIsRetrieving(true)
    try {
      const result = await retrieveContext(prompt, manualContext)

      if (result.error) {
        toast({
          title: "Error retrieving context",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setRetrievedDocuments(result.documents)

      toast({
        title: "Context retrieved",
        description: `Found ${result.documents.length} relevant documents.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while retrieving context",
        variant: "destructive",
      })
    } finally {
      setIsRetrieving(false)
    }
  }

  const compareModels = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to compare models.",
        variant: "destructive",
      })
      return
    }

    if (selectedModels.length === 0) {
      toast({
        title: "No models selected",
        description: "Please select at least one model to compare.",
        variant: "destructive",
      })
      return
    }

    // Reset states
    setDiversityDetected(false)
    setDiversitySummary("")
    setDebateMode(false)
    setDebateResponses({})
    setCollaborationMode(false)
    setCollaborationSteps([])
    setFinalSynthesis("")
    setConsensusItems([])
    setCollectiveMetrics({
      agreementLevel: 0,
      diversityIndex: 0,
      synthesisQuality: 0,
      collectiveConfidence: 0,
      emergentInsights: [],
    })

    const newLoading = {} as Record<ModelId, boolean>
    const newError = {} as Record<ModelId, string | null>
    const newResponses = {} as Record<ModelId, string>

    selectedModels.forEach((model) => {
      newLoading[model] = true
      newError[model] = null
      newResponses[model] = ""
    })

    setLoading(newLoading)
    setError(newError)
    setResponses(newResponses)

    try {
      // Prepare the prompt with RAG context if enabled
      let finalPrompt = prompt

      if (ragEnabled && (manualContext.trim() || retrievedDocuments.length > 0)) {
        const contextSources = [...(manualContext.trim() ? [manualContext] : []), ...retrievedDocuments]
        finalPrompt = formatRagPrompt(prompt, contextSources)
      }

      // Simulate API calls to different models
      for (const model of selectedModels) {
        try {
          // In a real app, this would be an API call to the model
          const response = await simulateModelResponse(model, finalPrompt)
          setResponses((prev) => ({ ...prev, [model]: response }))
        } catch (err) {
          setError((prev) => ({
            ...prev,
            [model]: err instanceof Error ? err.message : "Unknown error",
          }))
        } finally {
          setLoading((prev) => ({ ...prev, [model]: false }))
        }
      }

      // After all responses are in, check for cognitive diversity
      setTimeout(() => {
        analyzeDiversity()
      }, 500)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while comparing models",
        variant: "destructive",
      })
    }
  }

  const simulateModelResponse = (model: ModelId, prompt: string): Promise<string> => {
    // This is a simulation - in a real app, you would call the AI SDK here
    return new Promise((resolve) => {
      const delay = Math.random() * 1000 + 1000 // Random delay between 1-2 seconds

      setTimeout(() => {
        // Check if this is a RAG-enhanced prompt
        const isRagPrompt = prompt.includes("Context information:") && prompt.includes("Based on the above context")

        const responses: Record<ModelId, string> = {
          "openai/gpt-4o": isRagPrompt
            ? `Based on the provided context, I can offer a comprehensive answer. ${prompt.split("Based on the above context, please answer the following:")[1].trim()} requires careful consideration of multiple perspectives. The context mentions several key points that are relevant. First, we should consider the historical data provided. Second, we need to evaluate current trends as shown in the documents. Finally, we should project future implications based on the research findings.`
            : `As GPT-4o, I'd approach this by analyzing the key factors involved. ${prompt} requires careful consideration of multiple perspectives. First, we should consider the historical context. Second, we need to evaluate current trends. Finally, we should project future implications based on available data.`,

          "anthropic/claude-3-opus": isRagPrompt
            ? `I'll address this question by synthesizing the provided context documents. "${prompt.split("Based on the above context, please answer the following:")[1].trim()}" can be analyzed through several lenses. The context provides valuable information about background facts, historical data, and research findings. From an ethical standpoint, we must weigh competing values mentioned in Document 2. From a practical perspective, implementation challenges include resource constraints and stakeholder alignment as noted in Document 3. I recommend a balanced approach that acknowledges these tensions.`
            : `I'll address "${prompt}" by breaking it down systematically. There are several important dimensions to consider here. From an ethical standpoint, we must weigh competing values. From a practical perspective, implementation challenges include resource constraints and stakeholder alignment. I recommend a balanced approach that acknowledges these tensions.`,

          "meta-llama/llama-3": isRagPrompt
            ? `Regarding this question and drawing from the context provided: The documents offer several insights on "${prompt.split("Based on the above context, please answer the following:")[1].trim()}". My analysis suggests three key considerations based on the context: 1) The underlying principles described in Document 1, 2) Real-world applications and limitations outlined in Document 2, and 3) Alternative frameworks from the research findings in Document 3. Each offers valuable insights that inform my response.`
            : `Regarding "${prompt}": This is an interesting question that touches on several domains. My analysis suggests three key considerations: 1) The underlying principles at play, 2) Real-world applications and limitations, and 3) Alternative frameworks worth exploring. Each offers valuable insights.`,

          "mistralai/mistral-large": isRagPrompt
            ? `To address this question effectively, I'll analyze the context provided. The core issue revolves around balancing efficiency with equity, as mentioned in Document 1. Historical attempts to solve this have faced challenges due to competing incentives, according to the data in Document 2. The research findings in Document 3 suggest a promising path forward would integrate recent innovations while addressing traditional concerns. My response is firmly grounded in the context provided.`
            : `To address "${prompt}" effectively, I'll provide a concise analysis. The core issue revolves around balancing efficiency with equity. Historical attempts to solve this have faced challenges due to competing incentives. A promising path forward would integrate recent innovations while addressing traditional concerns.`,
        }

        resolve(responses[model])
      }, delay)
    })
  }

  const analyzeDiversity = () => {
    // In a real app, this would be an API call to analyze the diversity of responses
    // For now, we'll simulate it
    const responseValues = Object.values(responses).filter((r) => r)

    if (responseValues.length >= 2) {
      // Simulate detecting diversity
      setDiversityDetected(true)
      setDiversitySummary(
        "Cognitive diversity detected: Models show different reasoning approaches and focus areas. " +
          "GPT-4o emphasizes historical context and future projections, while Claude 3 focuses on ethical dimensions and practical challenges. " +
          "This diversity presents an opportunity for collaborative synthesis.",
      )
    }
  }

  const triggerDebateMode = async () => {
    setDebateMode(true)

    // In a real app, this would generate rebuttals between models
    // For now, we'll simulate it
    setDebateResponses({
      "openai/gpt-4o":
        "While Claude's ethical framework is valuable, I believe my historical context approach provides more actionable insights because it grounds recommendations in proven patterns. The future projections I offered are based on data trends rather than theoretical constructs.",

      "anthropic/claude-3-opus":
        "I appreciate GPT-4o's historical analysis, but I would argue that ethical considerations must precede historical pattern recognition. Without establishing an ethical framework first, we risk perpetuating historical biases in our solutions. My approach explicitly addresses stakeholder concerns that might be overlooked in a purely data-driven analysis.",
    })
  }

  const triggerCollaborationMode = async () => {
    setCollaborationMode(true)
    setIsCollaborating(true)

    try {
      const collaborationResult = await generateCollaboration(responses, prompt)
      setCollaborationSteps(collaborationResult.steps)
      setFinalSynthesis(collaborationResult.finalSynthesis)

      toast({
        title: "Collaboration Complete",
        description: "Models have successfully collaborated to create a synthesized solution.",
      })
    } catch (err) {
      toast({
        title: "Collaboration Error",
        description: err instanceof Error ? err.message : "An error occurred during collaboration",
        variant: "destructive",
      })
    } finally {
      setIsCollaborating(false)
    }
  }

  const triggerConsensusBuilding = async () => {
    setIsBuildingConsensus(true)

    try {
      const consensusResult = await buildConsensus(responses, prompt)
      setConsensusItems(consensusResult.consensusItems)
      setCollectiveMetrics(consensusResult.metrics)
      setFinalSynthesis(consensusResult.finalSynthesis)

      toast({
        title: "Consensus Built",
        description: `Reached ${consensusResult.metrics.agreementLevel}% agreement across key aspects.`,
      })
    } catch (err) {
      toast({
        title: "Consensus Error",
        description: err instanceof Error ? err.message : "An error occurred during consensus building",
        variant: "destructive",
      })
    } finally {
      setIsBuildingConsensus(false)
    }
  }

  return (
    <div className="space-y-6">
      <RagContextPanel
        enabled={ragEnabled}
        onToggle={setRagEnabled}
        context={manualContext}
        onContextChange={setManualContext}
        onRetrieve={handleRetrieveContext}
        retrievedDocuments={retrievedDocuments}
        isRetrieving={isRetrieving}
      />

      <form onSubmit={compareModels} className="space-y-4">
        {ragEnabled && <RagContextPreview context={manualContext} retrievedDocuments={retrievedDocuments} />}

        <Textarea
          placeholder="Enter your prompt here..."
          className="min-h-[120px] text-base"
          value={prompt}
          onChange={handlePromptChange}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <ModelSelector
            availableModels={AVAILABLE_MODELS}
            selectedModels={selectedModels}
            onChange={setSelectedModels}
          />

          <Button type="submit" className="flex-1" disabled={!prompt.trim() || selectedModels.length === 0}>
            {Object.values(loading).some(Boolean) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Compare Models
              </>
            )}
          </Button>
        </div>
      </form>

      {diversityDetected && (
        <CognitiveDiversityAlert
          summary={diversitySummary}
          onDebate={triggerDebateMode}
          onCollaborate={triggerCollaborationMode}
          debateMode={debateMode}
          collaborationMode={collaborationMode}
        />
      )}

      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compare">Compare Mode</TabsTrigger>
          <TabsTrigger value="debate" disabled={!debateMode}>
            Debate Mode
            {debateMode && (
              <Badge variant="outline" className="ml-2">
                New
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="collaborate" disabled={!collaborationMode}>
            Collaboration
            {collaborationMode && (
              <Badge variant="outline" className="ml-2">
                Active
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedModels.map((model) => (
              <ModelResponse
                key={model}
                model={AVAILABLE_MODELS.find((m) => m.id === model)!}
                response={responses[model] || ""}
                loading={loading[model] || false}
                error={error[model] || null}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="debate" className="mt-4">
          {debateMode ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                    Model Debate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(debateResponses).map(([model, response]) => (
                    <div key={model} className="border-l-4 border-primary p-4 bg-muted/50 rounded-r-md">
                      <h4 className="font-semibold mb-2">
                        {AVAILABLE_MODELS.find((m) => m.id === model)?.name || model}:
                      </h4>
                      <p className="text-sm">{response}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">
                Trigger debate mode from the cognitive diversity alert to see models debate their responses.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborate" className="mt-4">
          {collaborationMode ? (
            <CollaborationMode
              originalResponses={responses}
              collaborationSteps={collaborationSteps}
              finalSynthesis={finalSynthesis}
              isCollaborating={isCollaborating}
              onStartCollaboration={triggerCollaborationMode}
              consensusItems={consensusItems}
              collectiveMetrics={collectiveMetrics}
              onStartConsensus={triggerConsensusBuilding}
              isBuildingConsensus={isBuildingConsensus}
            />
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">
                Trigger collaboration mode from the cognitive diversity alert to see models work together.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
