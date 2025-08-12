export class ProgressiveDisclosure {
  // Reveal complexity gradually based on user needs
  generateUILayers(userExperience: "novice" | "intermediate" | "expert", context: any) {
    const layers = {
      essential: this.getEssentialControls(userExperience),
      advanced: this.getAdvancedControls(userExperience),
      expert: this.getExpertControls(userExperience),
      debug: this.getDebugControls(userExperience),
    }

    return {
      visible: this.determineVisibleLayers(userExperience),
      available: layers,
      recommendations: this.getRecommendations(userExperience, context),
    }
  }

  private getEssentialControls(experience: string) {
    return {
      prompt: { type: "textarea", required: true, placeholder: "What would you like to compare?" },
      quickActions: [
        { label: "Compare Models", action: "compare", primary: true },
        { label: "Get Suggestions", action: "suggest", secondary: true },
      ],
    }
  }

  private getAdvancedControls(experience: string) {
    return {
      modelSelection: { type: "multiselect", options: "all", default: "recommended" },
      evaluationCriteria: { type: "checklist", options: "contextual", default: "auto" },
      outputFormat: { type: "select", options: ["summary", "detailed", "technical"], default: "detailed" },
    }
  }

  private getExpertControls(experience: string) {
    return {
      promptEngineering: { type: "advanced-editor", features: ["templates", "variables", "chains"] },
      modelParameters: { type: "parameter-grid", customizable: true },
      evaluationChains: { type: "chain-builder", visual: true },
      apiConfiguration: { type: "json-editor", validation: true },
    }
  }

  private getDebugControls(experience: string) {
    return {
      requestInspector: { type: "json-viewer", realtime: true },
      performanceMetrics: { type: "metrics-dashboard", detailed: true },
      logViewer: { type: "log-stream", filterable: true },
      experimentTracking: { type: "experiment-manager", version: true },
    }
  }

  private determineVisibleLayers(experience: string): string[] {
    const layerMap = {
      novice: ["essential"],
      intermediate: ["essential", "advanced"],
      expert: ["essential", "advanced", "expert", "debug"],
    }

    return layerMap[experience] || ["essential"]
  }

  private getRecommendations(experience: string, context: any): string[] {
    const recommendations = {
      novice: [
        "Start with the default settings - they're optimized for your use case",
        "Try the 'Get Suggestions' button for AI-powered recommendations",
        "Use simple, clear language in your prompts",
      ],
      intermediate: [
        "Experiment with different model combinations",
        "Customize evaluation criteria for your specific needs",
        "Try enabling RAG for knowledge-intensive tasks",
      ],
      expert: [
        "Build custom evaluation chains for specialized metrics",
        "Use prompt templates and variables for consistency",
        "Monitor performance metrics to optimize costs",
      ],
    }

    return recommendations[experience] || []
  }
}
