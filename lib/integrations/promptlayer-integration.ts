import { PromptLayer } from "promptlayer"

export class PromptLayerIntegration {
  private pl: PromptLayer

  constructor(apiKey: string) {
    this.pl = new PromptLayer({ apiKey })
  }

  // Track all model comparisons in PromptLayer
  async trackComparison(
    prompt: string,
    models: string[],
    responses: Record<string, string>,
    metadata: {
      userId: string
      sessionId: string
      ragEnabled: boolean
      context?: string
    },
  ) {
    const promises = models.map(async (model) => {
      return this.pl.track({
        request_id: `${metadata.sessionId}-${model}`,
        function_name: "model_comparison",
        kwargs: {
          model,
          prompt,
          context: metadata.context,
          rag_enabled: metadata.ragEnabled,
        },
        request_response: responses[model],
        request_start_time: new Date(),
        request_end_time: new Date(),
        tags: ["comparison", model, metadata.userId],
        metadata: {
          user_id: metadata.userId,
          session_id: metadata.sessionId,
          cognitive_diversity: true,
        },
      })
    })

    await Promise.all(promises)
  }

  // Get historical performance data
  async getModelPerformance(userId: string, timeRange: "7d" | "30d" | "90d") {
    return this.pl.analytics.getMetrics({
      filters: {
        tags: [userId],
        time_range: timeRange,
      },
      group_by: ["model", "function_name"],
      metrics: ["latency", "cost", "success_rate"],
    })
  }

  // A/B test prompts automatically
  async createPromptExperiment(
    basePrompt: string,
    variations: string[],
    models: string[],
    successMetric: "accuracy" | "relevance" | "cost_efficiency",
  ) {
    return this.pl.experiments.create({
      name: `Prompt Optimization - ${Date.now()}`,
      variants: [
        { name: "control", prompt: basePrompt },
        ...variations.map((prompt, i) => ({ name: `variant_${i + 1}`, prompt })),
      ],
      models,
      success_metric: successMetric,
      traffic_split: "equal",
    })
  }

  // Get prompt optimization suggestions
  async getPromptSuggestions(prompt: string, model: string, performance_data: any[]) {
    return this.pl.optimize.suggest({
      prompt,
      model,
      historical_data: performance_data,
      optimization_goal: "improve_accuracy",
    })
  }
}
