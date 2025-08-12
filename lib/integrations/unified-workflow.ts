import { PromptLayerIntegration } from "./promptlayer-integration"
import { CrewAIIntegration } from "./crewai-integration"
import { LangChainIntegration } from "./langchain-integration"

export class UnifiedWorkflow {
  private promptLayer: PromptLayerIntegration
  private crewAI: CrewAIIntegration
  private langChain: LangChainIntegration

  constructor(promptLayerApiKey: string) {
    this.promptLayer = new PromptLayerIntegration(promptLayerApiKey)
    this.crewAI = new CrewAIIntegration()
    this.langChain = new LangChainIntegration()
  }

  // Complete AI-powered workflow
  async runEnhancedComparison(
    prompt: string,
    models: string[],
    context: string[],
    userId: string,
    options: {
      enableRAG: boolean
      enableAgents: boolean
      enableOptimization: boolean
      promptType: "analysis" | "creative" | "factual" | "debate"
    },
  ) {
    const sessionId = `session_${Date.now()}`
    const results: any = {
      sessionId,
      originalPrompt: prompt,
      enhancedPrompt: prompt,
      modelResponses: {},
      agentInsights: null,
      optimizationSuggestions: null,
      consensus: null,
      metrics: {},
    }

    try {
      // Step 1: Setup RAG if enabled
      if (options.enableRAG && context.length > 0) {
        await this.langChain.setupRAGChain(context)
        results.ragEnabled = true
      }

      // Step 2: Get model responses with LangChain enhancement
      if (options.enableRAG) {
        results.modelResponses = await this.langChain.ragEnhancedComparison(prompt, models)
      } else {
        results.modelResponses = await this.langChain.compareModelsWithChains(
          prompt,
          context.join("\n"),
          models,
          options.promptType,
        )
      }

      // Step 3: Track everything in PromptLayer
      await this.promptLayer.trackComparison(
        prompt,
        models,
        Object.fromEntries(
          Object.entries(results.modelResponses).map(([model, data]: [string, any]) => [model, data.response || ""]),
        ),
        {
          userId,
          sessionId,
          ragEnabled: options.enableRAG,
          context: context.join("\n"),
        },
      )

      // Step 4: Deploy CrewAI agents for analysis if enabled
      if (options.enableAgents) {
        const agentResults = await this.crewAI.optimizePrompt(
          prompt,
          Object.fromEntries(
            Object.entries(results.modelResponses).map(([model, data]: [string, any]) => [model, data.response || ""]),
          ),
        )
        results.agentInsights = agentResults
      }

      // Step 5: Get optimization suggestions from PromptLayer
      if (options.enableOptimization) {
        const performanceData = await this.promptLayer.getModelPerformance(userId, "30d")
        results.optimizationSuggestions = await this.promptLayer.getPromptSuggestions(
          prompt,
          models[0],
          performanceData,
        )
      }

      // Step 6: Run evaluation chain
      const evaluationChain = this.langChain.createEvaluationChain()
      const evaluation = await evaluationChain.invoke({
        prompt,
        responses: JSON.stringify(results.modelResponses, null, 2),
      })
      results.evaluation = evaluation

      // Step 7: Calculate metrics
      results.metrics = {
        totalLatency: Date.now() - Number.parseInt(sessionId.split("_")[1]),
        modelsCompared: models.length,
        ragDocuments: context.length,
        agentsDeployed: options.enableAgents ? 4 : 0,
        optimizationsGenerated: options.enableOptimization ? 1 : 0,
      }

      return results
    } catch (error) {
      console.error("Unified workflow error:", error)
      throw error
    }
  }

  // Automated continuous improvement
  async setupContinuousImprovement(userId: string) {
    // Create improvement agent
    const improvementAgent = await this.crewAI.createContinuousImprovementAgent(userId)

    // Setup PromptLayer experiments
    const experiments = await this.promptLayer.createPromptExperiment(
      "Analyze the following data:",
      ["Please analyze this data:", "Provide insights on this data:", "Break down this information:"],
      ["openai/gpt-4o", "anthropic/claude-3-opus"],
      "accuracy",
    )

    return {
      agent: improvementAgent,
      experiments,
      schedule: "daily",
    }
  }

  // Get comprehensive analytics
  async getAnalytics(userId: string, timeRange: "7d" | "30d" | "90d") {
    const promptLayerMetrics = await this.promptLayer.getModelPerformance(userId, timeRange)

    return {
      promptLayer: promptLayerMetrics,
      summary: {
        totalComparisons: promptLayerMetrics.total_requests || 0,
        avgAccuracy: promptLayerMetrics.avg_accuracy || 0,
        costSavings: promptLayerMetrics.cost_savings || 0,
        topPerformingModel: promptLayerMetrics.best_model || "N/A",
      },
    }
  }
}
