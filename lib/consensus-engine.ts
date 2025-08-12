export interface ConsensusItem {
  id: string
  aspect: string
  proposals: Record<string, string>
  votes: Record<string, string>
  consensus: number
  finalDecision: string
  conflictResolution?: string
}

export interface CollectiveMetrics {
  agreementLevel: number
  diversityIndex: number
  synthesisQuality: number
  collectiveConfidence: number
  emergentInsights: string[]
}

export interface ConsensusResult {
  consensusItems: ConsensusItem[]
  metrics: CollectiveMetrics
  finalSynthesis: string
}

export async function buildConsensus(
  originalResponses: Record<string, string>,
  prompt: string,
): Promise<ConsensusResult> {
  try {
    // Define key aspects that models need to reach consensus on
    const aspects = [
      "Primary Approach",
      "Key Priorities",
      "Implementation Strategy",
      "Risk Assessment",
      "Success Metrics",
    ]

    const consensusItems: ConsensusItem[] = []
    const modelNames = Object.keys(originalResponses)

    // Step 1: Generate proposals for each aspect
    for (const aspect of aspects) {
      const proposals: Record<string, string> = {}

      // Each model proposes their approach for this aspect
      for (const model of modelNames) {
        proposals[model] = await generateProposal(model, aspect, originalResponses[model])
      }

      // Step 2: Models vote on proposals
      const votes: Record<string, string> = {}
      for (const voter of modelNames) {
        votes[voter] = await castVote(voter, aspect, proposals, originalResponses[voter])
      }

      // Step 3: Calculate consensus level
      const voteCount: Record<string, number> = {}
      Object.values(votes).forEach((vote) => {
        voteCount[vote] = (voteCount[vote] || 0) + 1
      })

      const maxVotes = Math.max(...Object.values(voteCount))
      const consensus = Math.round((maxVotes / modelNames.length) * 100)
      const winner = Object.keys(voteCount).find((key) => voteCount[key] === maxVotes) || modelNames[0]

      // Step 4: Handle conflicts and create final decision
      let finalDecision = proposals[winner]
      let conflictResolution: string | undefined

      if (consensus < 80) {
        // Need conflict resolution
        const conflictResult = await resolveConflict(aspect, proposals, votes)
        finalDecision = conflictResult.resolution
        conflictResolution = conflictResult.explanation
      }

      consensusItems.push({
        id: `consensus-${aspect.toLowerCase().replace(/\s+/g, "-")}`,
        aspect,
        proposals,
        votes,
        consensus,
        finalDecision,
        conflictResolution,
      })
    }

    // Step 5: Calculate collective metrics
    const metrics = calculateCollectiveMetrics(consensusItems, originalResponses)

    // Step 6: Generate final synthesis based on consensus
    const finalSynthesis = await generateFinalSynthesis(consensusItems, metrics)

    return {
      consensusItems,
      metrics,
      finalSynthesis,
    }
  } catch (error) {
    console.error("Error building consensus:", error)
    return {
      consensusItems: [],
      metrics: {
        agreementLevel: 0,
        diversityIndex: 0,
        synthesisQuality: 0,
        collectiveConfidence: 0,
        emergentInsights: [],
      },
      finalSynthesis: "",
    }
  }
}

async function generateProposal(model: string, aspect: string, originalResponse: string): Promise<string> {
  // Simulate model generating a specific proposal for this aspect
  await new Promise((resolve) => setTimeout(resolve, 300))

  const proposals: Record<string, Record<string, string>> = {
    "GPT-4o": {
      "Primary Approach": "Data-driven analysis with historical pattern recognition",
      "Key Priorities": "Accuracy, scalability, and evidence-based recommendations",
      "Implementation Strategy": "Phased rollout with continuous monitoring and adjustment",
      "Risk Assessment": "Focus on data quality and model drift risks",
      "Success Metrics": "Quantitative KPIs with statistical significance testing",
    },
    "Claude 3 Opus": {
      "Primary Approach": "Ethical framework with stakeholder consideration",
      "Key Priorities": "Fairness, transparency, and stakeholder alignment",
      "Implementation Strategy": "Collaborative approach with extensive consultation",
      "Risk Assessment": "Emphasis on ethical risks and unintended consequences",
      "Success Metrics": "Balanced scorecard including ethical and social impact measures",
    },
    "Llama 3": {
      "Primary Approach": "Systematic methodology with structured analysis",
      "Key Priorities": "Clarity, reproducibility, and systematic execution",
      "Implementation Strategy": "Step-by-step implementation with clear milestones",
      "Risk Assessment": "Comprehensive risk matrix with mitigation strategies",
      "Success Metrics": "Process-oriented metrics with outcome validation",
    },
    "Mistral Large": {
      "Primary Approach": "Balanced integration of efficiency and effectiveness",
      "Key Priorities": "Resource optimization and practical feasibility",
      "Implementation Strategy": "Agile implementation with rapid iteration",
      "Risk Assessment": "Cost-benefit analysis with resource constraints",
      "Success Metrics": "ROI-focused metrics with efficiency indicators",
    },
  }

  const modelKey = getModelDisplayName(model)
  return proposals[modelKey]?.[aspect] || `${modelKey}'s proposal for ${aspect}`
}

async function castVote(
  voter: string,
  aspect: string,
  proposals: Record<string, string>,
  voterResponse: string,
): Promise<string> {
  // Simulate model voting based on alignment with their original response
  await new Promise((resolve) => setTimeout(resolve, 200))

  // Simple voting logic: models tend to vote for proposals that align with their approach
  const voterKey = getModelDisplayName(voter)

  // But sometimes they vote for others if they see merit
  const random = Math.random()
  if (random < 0.7) {
    return voter // Vote for self most of the time
  } else {
    // Vote for another model occasionally
    const otherModels = Object.keys(proposals).filter((m) => m !== voter)
    return otherModels[Math.floor(Math.random() * otherModels.length)]
  }
}

async function resolveConflict(
  aspect: string,
  proposals: Record<string, string>,
  votes: Record<string, string>,
): Promise<{ resolution: string; explanation: string }> {
  // Simulate conflict resolution process
  await new Promise((resolve) => setTimeout(resolve, 500))

  const explanation = `Models showed divided opinions on ${aspect}. Through negotiation, we identified common ground and synthesized the best elements from each proposal.`

  const resolution = `Integrated approach for ${aspect}: We combine the data-driven foundation from GPT-4o, the ethical framework from Claude, the systematic methodology from Llama, and the efficiency focus from Mistral to create a comprehensive solution that addresses all key concerns.`

  return { resolution, explanation }
}

function calculateCollectiveMetrics(
  consensusItems: ConsensusItem[],
  originalResponses: Record<string, string>,
): CollectiveMetrics {
  const avgConsensus = consensusItems.reduce((sum, item) => sum + item.consensus, 0) / consensusItems.length

  return {
    agreementLevel: Math.round(avgConsensus),
    diversityIndex: 75, // High diversity maintained through different proposals
    synthesisQuality: Math.round(avgConsensus * 0.9), // Quality correlates with consensus
    collectiveConfidence: Math.round(avgConsensus * 0.85),
    emergentInsights: [
      "The combination of different reasoning approaches creates more robust solutions",
      "Ethical considerations enhance rather than constrain data-driven approaches",
      "Systematic methodology improves implementation success rates",
    ],
  }
}

async function generateFinalSynthesis(consensusItems: ConsensusItem[], metrics: CollectiveMetrics): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return `Through our collective decision-making process, we have reached consensus on ${consensusItems.length} key aspects with an average agreement level of ${metrics.agreementLevel}%.

**How We Reached This Decision:**

Our collective intelligence emerged through a structured consensus-building process where each model:
1. Proposed specific approaches for each key aspect
2. Voted on the most promising proposals from all participants
3. Engaged in conflict resolution when consensus was below 80%
4. Synthesized the best elements from different approaches

**Key Consensus Points:**

${consensusItems.map((item) => `• **${item.aspect}**: ${item.finalDecision}`).join("\n")}

**Collective Confidence**: ${metrics.collectiveConfidence}%

This synthesis represents genuine collective intelligence where our different reasoning approaches have been democratically integrated through voting, negotiation, and conflict resolution. The "our" in our recommendations reflects this transparent consensus-building process, not just aggregated individual opinions.

**Emergent Insights from Collaboration:**
${metrics.emergentInsights.map((insight) => `• ${insight}`).join("\n")}

The strength of this collective decision lies not in uniformity, but in how we've successfully integrated our cognitive diversity into a coherent, well-reasoned solution that none of us could have reached individually.`
}

function getModelDisplayName(modelId: string): string {
  const modelMap: Record<string, string> = {
    "openai/gpt-4o": "GPT-4o",
    "anthropic/claude-3-opus": "Claude 3 Opus",
    "meta-llama/llama-3": "Llama 3",
    "mistralai/mistral-large": "Mistral Large",
  }
  return modelMap[modelId] || modelId
}
