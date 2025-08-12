"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Sparkles, Settings, Zap, Brain } from "lucide-react"
import { IntelligentDefaults } from "@/lib/complexity-abstraction/intelligent-defaults"
import { NaturalLanguageInterface } from "@/lib/complexity-abstraction/natural-language-interface"
import { ProgressiveDisclosure } from "@/lib/complexity-abstraction/progressive-disclosure"

interface SmartInterfaceProps {
  userExperience: "novice" | "intermediate" | "expert"
  onConfigurationChange: (config: any) => void
}

export function SmartInterface({ userExperience, onConfigurationChange }: SmartInterfaceProps) {
  const [prompt, setPrompt] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [configuration, setConfiguration] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const intelligentDefaults = new IntelligentDefaults()
  const nlInterface = new NaturalLanguageInterface()
  const progressiveDisclosure = new ProgressiveDisclosure()

  // AI-powered analysis of user input
  const analyzePrompt = async (input: string) => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    try {
      // Parse natural language intent
      const intent = await nlInterface.parseNaturalLanguageIntent(input)

      // Generate smart defaults
      const defaults = await intelligentDefaults.generateSmartDefaults({
        domain: intent.intent.domain,
        experience: userExperience,
        previousPrompts: [], // Would come from user history
        goals: [intent.intent.type],
      })

      setAiSuggestions(intent)
      setConfiguration({ ...defaults, ...intent.config })
      onConfigurationChange({ ...defaults, ...intent.config })
    } catch (error) {
      console.error("Error analyzing prompt:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get UI layers based on user experience
  const uiLayers = progressiveDisclosure.generateUILayers(userExperience, { domain: "general" })

  useEffect(() => {
    if (prompt) {
      const debounceTimer = setTimeout(() => analyzePrompt(prompt), 1000)
      return () => clearTimeout(debounceTimer)
    }
  }, [prompt])

  return (
    <div className="space-y-6">
      {/* AI-Powered Prompt Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Smart Prompt Interface
            <Badge variant="outline" className="ml-2">
              {userExperience}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe what you want to do in natural language..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />

          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>AI is analyzing your request...</span>
            </div>
          )}

          {aiSuggestions && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-2">
                <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800 dark:text-blue-200">AI Understanding</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">{aiSuggestions.explanation}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                  {aiSuggestions.intent.type}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                  {aiSuggestions.intent.complexity}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30">
                  {aiSuggestions.intent.domain}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progressive Disclosure of Controls */}
      {configuration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Configuration
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm">
                {showAdvanced ? "Hide Advanced" : "Show Advanced"}
                {showAdvanced ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Essential Controls - Always Visible */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Selected Models</h4>
              <div className="flex flex-wrap gap-2">
                {configuration.models?.map((model: string) => (
                  <Badge key={model} variant="outline">
                    {model.split("/")[1] || model}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Evaluation Criteria</h4>
              <div className="flex flex-wrap gap-2">
                {configuration.evaluationCriteria?.map((criteria: string) => (
                  <Badge key={criteria} variant="secondary">
                    {criteria}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Advanced Controls - Collapsible */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleContent className="space-y-4 pt-4 border-t">
                {userExperience !== "novice" && (
                  <>
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">RAG Configuration</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Enabled:</span>
                          <Badge variant={configuration.ragEnabled ? "default" : "outline"} className="ml-2">
                            {configuration.ragEnabled ? "Yes" : "No"}
                          </Badge>
                        </div>
                        {configuration.ragSettings && (
                          <div>
                            <span className="text-muted-foreground">Chunk Size:</span>
                            <span className="ml-2">{configuration.ragSettings.chunkSize}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Output Format</h4>
                      <Badge variant="outline">{configuration.outputFormat || "detailed"}</Badge>
                    </div>
                  </>
                )}

                {userExperience === "expert" && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Advanced Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {configuration.collaborationMode && <Badge variant="default">Collaboration Mode</Badge>}
                      {configuration.promptEnhancements?.length > 0 && (
                        <Badge variant="default">Prompt Enhancements</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      {uiLayers.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {uiLayers.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" disabled={!prompt.trim()}>
          <Sparkles className="mr-2 h-4 w-4" />
          Run Smart Comparison
        </Button>
        {userExperience !== "novice" && (
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Customize
          </Button>
        )}
      </div>
    </div>
  )
}
