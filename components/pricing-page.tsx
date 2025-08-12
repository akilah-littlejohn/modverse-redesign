"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Users, Building } from "lucide-react"
import { PRODUCT_TIERS } from "@/lib/product-config"

export function PricingPage() {
  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case "community":
        return <Zap className="h-5 w-5" />
      case "professional":
        return <Users className="h-5 w-5" />
      case "team":
        return <Building className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case "community":
        return "border-gray-200"
      case "professional":
        return "border-blue-500 ring-2 ring-blue-200"
      case "team":
        return "border-purple-500"
      default:
        return "border-gray-200"
    }
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">Start free, scale as you grow. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRODUCT_TIERS.map((tier) => (
            <Card key={tier.name} className={`relative ${getTierColor(tier.name)}`}>
              {tier.name === "Professional" && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">{getTierIcon(tier.name)}</div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {tier.price === 0 ? "Free" : `$${tier.price}`}
                  {tier.price > 0 && <span className="text-base font-normal text-muted-foreground">/month</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>
                      {tier.limits.comparisonsPerMonth === -1
                        ? "Unlimited"
                        : tier.limits.comparisonsPerMonth.toLocaleString()}
                    </strong>{" "}
                    comparisons/month
                  </div>
                  <div className="text-sm">
                    <strong>{tier.limits.modelsMax === -1 ? "All" : tier.limits.modelsMax}</strong> models
                  </div>
                  <div className="text-sm">
                    <strong>{tier.limits.teamMembers}</strong> team member{tier.limits.teamMembers > 1 ? "s" : ""}
                  </div>
                  <div className="text-sm">
                    <strong>{tier.limits.storageGB}GB</strong> storage
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {tier.features.map((feature) => (
                      <li key={feature.id} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full mt-6" variant={tier.name === "Professional" ? "default" : "outline"}>
                  {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Need something custom? Enterprise plans available.</p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </div>
  )
}
