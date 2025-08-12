"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, Database, Users } from "lucide-react"

interface UsageDashboardProps {
  currentUsage: {
    comparisons: number
    apiCalls: number
    storageUsed: number
    teamMembers: number
  }
  limits: {
    comparisonsPerMonth: number
    apiCallsPerMonth: number
    storageGB: number
    teamMembers: number
  }
  tier: string
}

export function UsageDashboard({ currentUsage, limits, tier }: UsageDashboardProps) {
  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Usage Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          {tier} Plan
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comparisons</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(currentUsage.comparisons)}</div>
            <div className="text-xs text-muted-foreground mb-2">
              of {limits.comparisonsPerMonth === -1 ? "∞" : formatNumber(limits.comparisonsPerMonth)} this month
            </div>
            {limits.comparisonsPerMonth !== -1 && (
              <Progress
                value={getUsagePercentage(currentUsage.comparisons, limits.comparisonsPerMonth)}
                className="h-2"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(currentUsage.apiCalls)}</div>
            <div className="text-xs text-muted-foreground mb-2">
              of {limits.apiCallsPerMonth === -1 ? "∞" : formatNumber(limits.apiCallsPerMonth)} this month
            </div>
            {limits.apiCallsPerMonth !== -1 && (
              <Progress value={getUsagePercentage(currentUsage.apiCalls, limits.apiCallsPerMonth)} className="h-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(currentUsage.storageUsed / (1024 * 1024 * 1024)).toFixed(1)}GB</div>
            <div className="text-xs text-muted-foreground mb-2">of {limits.storageGB}GB available</div>
            <Progress
              value={getUsagePercentage(currentUsage.storageUsed, limits.storageGB * 1024 * 1024 * 1024)}
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUsage.teamMembers}</div>
            <div className="text-xs text-muted-foreground mb-2">of {limits.teamMembers} allowed</div>
            <Progress value={getUsagePercentage(currentUsage.teamMembers, limits.teamMembers)} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {getUsagePercentage(currentUsage.comparisons, limits.comparisonsPerMonth) >= 80 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Approaching Usage Limit</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You've used {getUsagePercentage(currentUsage.comparisons, limits.comparisonsPerMonth).toFixed(0)}% of
                  your monthly comparisons.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
