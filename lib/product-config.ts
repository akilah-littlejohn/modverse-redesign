export interface ProductTier {
  name: string
  price: number
  features: ProductFeature[]
  limits: UsageLimits
}

export interface ProductFeature {
  id: string
  name: string
  description: string
  tier: "free" | "pro" | "team" | "enterprise"
}

export interface UsageLimits {
  comparisonsPerMonth: number
  modelsMax: number
  teamMembers: number
  storageGB: number
  apiCallsPerMonth: number
}

export const PRODUCT_TIERS: ProductTier[] = [
  {
    name: "Community",
    price: 0,
    features: [
      { id: "basic_comparison", name: "Basic Model Comparison", description: "Compare up to 2 models", tier: "free" },
      { id: "prompt_templates", name: "Basic Templates", description: "10 pre-built templates", tier: "free" },
      { id: "export_json", name: "JSON Export", description: "Export results as JSON", tier: "free" },
    ],
    limits: {
      comparisonsPerMonth: 100,
      modelsMax: 2,
      teamMembers: 1,
      storageGB: 1,
      apiCallsPerMonth: 500,
    },
  },
  {
    name: "Professional",
    price: 29,
    features: [
      { id: "unlimited_models", name: "All Models", description: "Access to all available models", tier: "pro" },
      {
        id: "advanced_analytics",
        name: "Advanced Analytics",
        description: "Detailed performance metrics",
        tier: "pro",
      },
      { id: "custom_templates", name: "Custom Templates", description: "Create and share templates", tier: "pro" },
      { id: "export_all", name: "All Export Formats", description: "PDF, CSV, Excel exports", tier: "pro" },
    ],
    limits: {
      comparisonsPerMonth: 1000,
      modelsMax: -1, // unlimited
      teamMembers: 1,
      storageGB: 10,
      apiCallsPerMonth: 5000,
    },
  },
  {
    name: "Team",
    price: 199,
    features: [
      {
        id: "team_collaboration",
        name: "Team Collaboration",
        description: "Share workspaces and results",
        tier: "team",
      },
      { id: "api_access", name: "API Access", description: "Programmatic access to platform", tier: "team" },
      { id: "custom_models", name: "Custom Models", description: "Connect your own models", tier: "team" },
      { id: "sso", name: "SSO Integration", description: "Single sign-on support", tier: "team" },
    ],
    limits: {
      comparisonsPerMonth: 10000,
      modelsMax: -1,
      teamMembers: 10,
      storageGB: 100,
      apiCallsPerMonth: 50000,
    },
  },
]
