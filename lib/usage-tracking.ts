import { PRODUCT_TIERS } from "./product-tiers" // Assuming PRODUCT_TIERS is declared in another file

export interface UsageMetrics {
  userId: string
  comparisons: number
  apiCalls: number
  storageUsed: number
  modelsUsed: string[]
  period: "month" | "day"
  timestamp: Date
}

export class UsageTracker {
  async trackComparison(userId: string, modelIds: string[]) {
    // Track a model comparison
    await this.incrementUsage(userId, "comparisons", 1)
    await this.incrementUsage(userId, "apiCalls", modelIds.length)

    // Update models used
    await this.updateModelsUsed(userId, modelIds)
  }

  async checkLimits(userId: string, tier: string): Promise<boolean> {
    const usage = await this.getCurrentUsage(userId)
    const limits = this.getTierLimits(tier)

    return (
      usage.comparisons < limits.comparisonsPerMonth &&
      usage.apiCalls < limits.apiCallsPerMonth &&
      usage.storageUsed < limits.storageGB * 1024 * 1024 * 1024
    )
  }

  private async incrementUsage(userId: string, metric: string, amount: number) {
    // Implementation would use your database
    console.log(`Incrementing ${metric} by ${amount} for user ${userId}`)
  }

  private async getCurrentUsage(userId: string): Promise<UsageMetrics> {
    // Implementation would query your database
    return {
      userId,
      comparisons: 0,
      apiCalls: 0,
      storageUsed: 0,
      modelsUsed: [],
      period: "month",
      timestamp: new Date(),
    }
  }

  private getTierLimits(tier: string) {
    return PRODUCT_TIERS.find((t) => t.name.toLowerCase() === tier.toLowerCase())?.limits || PRODUCT_TIERS[0].limits
  }

  private async updateModelsUsed(userId: string, modelIds: string[]) {
    // Track which models the user has used
    console.log(`User ${userId} used models: ${modelIds.join(", ")}`)
  }
}
