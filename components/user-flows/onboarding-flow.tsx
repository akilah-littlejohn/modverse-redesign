"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, Sparkles, Users, Brain, Zap } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ReactNode
  validation?: () => boolean
  optional?: boolean
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userProfile, setUserProfile] = useState({
    role: "",
    experience: "",
    useCase: "",
    goals: [] as string[],
  })
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to AI Model Comparison",
      description: "Let's get you set up with the perfect AI workflow",
      component: <WelcomeStep />,
    },
    {
      id: "role-selection",
      title: "What's your role?",
      description: "This helps us customize your experience",
      component: (
        <RoleSelectionStep selected={userProfile.role} onSelect={(role) => setUserProfile({ ...userProfile, role })} />
      ),
      validation: () => !!userProfile.role,
    },
    {
      id: "experience-level",
      title: "What's your AI experience?",
      description: "We'll adjust the interface complexity accordingly",
      component: (
        <ExperienceLevelStep
          selected={userProfile.experience}
          onSelect={(experience) => setUserProfile({ ...userProfile, experience })}
        />
      ),
      validation: () => !!userProfile.experience,
    },
    {
      id: "use-case",
      title: "What will you primarily use this for?",
      description: "We'll suggest the best models and features",
      component: (
        <UseCaseStep
          selected={userProfile.useCase}
          onSelect={(useCase) => setUserProfile({ ...userProfile, useCase })}
        />
      ),
      validation: () => !!userProfile.useCase,
    },
    {
      id: "first-comparison",
      title: "Let's try your first comparison",
      description: "We've pre-configured everything based on your preferences",
      component: <FirstComparisonStep userProfile={userProfile} />,
    },
    {
      id: "feature-tour",
      title: "Discover advanced features",
      description: "Quick tour of powerful capabilities",
      component: <FeatureTourStep userProfile={userProfile} />,
      optional: true,
    },
    {
      id: "completion",
      title: "You're all set!",
      description: "Start exploring and comparing AI models",
      component: <CompletionStep userProfile={userProfile} />,
    },
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    const step = steps[currentStep]
    if (step.validation && !step.validation()) {
      return // Don't proceed if validation fails
    }

    setCompletedSteps([...completedSteps, step.id])

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    if (currentStepData.optional) {
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">Setup Wizard</span>
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.component}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Back
            </Button>

            <div className="flex space-x-2">
              {currentStepData.optional && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} disabled={currentStepData.validation && !currentStepData.validation()}>
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Compare AI Models Like Never Before</h3>
        <p className="text-muted-foreground">
          Get insights from multiple AI models, enable them to collaborate, and make better decisions with collective
          intelligence.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium">Smart Comparison</p>
        </div>
        <div className="text-center">
          <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium">AI Collaboration</p>
        </div>
        <div className="text-center">
          <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm font-medium">Enhanced with RAG</p>
        </div>
      </div>
    </div>
  )
}

function RoleSelectionStep({ selected, onSelect }: { selected: string; onSelect: (role: string) => void }) {
  const roles = [
    {
      id: "researcher",
      title: "AI Researcher",
      description: "Studying AI model capabilities and behaviors",
      icon: "🔬",
    },
    {
      id: "developer",
      title: "Developer",
      description: "Building applications with AI integration",
      icon: "👨‍💻",
    },
    {
      id: "prompt-engineer",
      title: "Prompt Engineer",
      description: "Optimizing prompts for better AI performance",
      icon: "✍️",
    },
    {
      id: "content-creator",
      title: "Content Creator",
      description: "Using AI for creative and content generation",
      icon: "🎨",
    },
    {
      id: "business-analyst",
      title: "Business Analyst",
      description: "Leveraging AI for business insights and decisions",
      icon: "📊",
    },
    {
      id: "other",
      title: "Other",
      description: "I have a different use case",
      icon: "🤔",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => (
        <Card
          key={role.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selected === role.id ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onSelect(role.id)}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">{role.icon}</div>
            <h4 className="font-semibold mb-1">{role.title}</h4>
            <p className="text-sm text-muted-foreground">{role.description}</p>
            {selected === role.id && <CheckCircle className="h-5 w-5 text-primary mx-auto mt-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function ExperienceLevelStep({ selected, onSelect }: { selected: string; onSelect: (level: string) => void }) {
  const levels = [
    {
      id: "beginner",
      title: "Beginner",
      description: "New to AI and prompt engineering",
      features: ["Guided interface", "Smart defaults", "Helpful explanations"],
    },
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Some experience with AI tools",
      features: ["Balanced interface", "Customizable options", "Advanced features available"],
    },
    {
      id: "expert",
      title: "Expert",
      description: "Experienced with AI models and tools",
      features: ["Full control", "Advanced features", "Technical details"],
    },
  ]

  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <Card
          key={level.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selected === level.id ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onSelect(level.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{level.title}</h4>
              {selected === level.id && <CheckCircle className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-muted-foreground mb-3">{level.description}</p>
            <div className="flex flex-wrap gap-2">
              {level.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function UseCaseStep({ selected, onSelect }: { selected: string; onSelect: (useCase: string) => void }) {
  const useCases = [
    {
      id: "research",
      title: "Research & Analysis",
      description: "Academic research, data analysis, fact-checking",
      models: ["GPT-4o", "Claude 3 Opus", "Llama 3"],
      features: ["RAG enabled", "Citation tracking", "Collaboration mode"],
    },
    {
      id: "creative",
      title: "Creative Writing",
      description: "Stories, articles, marketing copy, creative content",
      models: ["Claude 3 Opus", "GPT-4o"],
      features: ["Creative prompts", "Style analysis", "Diversity detection"],
    },
    {
      id: "coding",
      title: "Code & Development",
      description: "Code review, debugging, technical documentation",
      models: ["GPT-4o", "Claude 3 Opus"],
      features: ["Code analysis", "Security review", "Best practices"],
    },
    {
      id: "business",
      title: "Business Strategy",
      description: "Market analysis, strategic planning, decision support",
      models: ["GPT-4o", "Claude 3 Opus", "Mistral Large"],
      features: ["Multi-perspective analysis", "Consensus building", "Risk assessment"],
    },
  ]

  return (
    <div className="space-y-4">
      {useCases.map((useCase) => (
        <Card
          key={useCase.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selected === useCase.id ? "ring-2 ring-primary bg-primary/5" : ""
          }`}
          onClick={() => onSelect(useCase.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{useCase.title}</h4>
              {selected === useCase.id && <CheckCircle className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-muted-foreground mb-3">{useCase.description}</p>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Recommended models: </span>
                <span className="text-sm text-muted-foreground">{useCase.models.join(", ")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {useCase.features.map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FirstComparisonStep({ userProfile }: { userProfile: any }) {
  const [prompt, setPrompt] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)

  const suggestedPrompts = {
    researcher: "Analyze the potential impacts of artificial general intelligence on scientific research",
    developer: "Review this React component for performance and security issues",
    "prompt-engineer": "Optimize this prompt for better clarity and specificity",
    "content-creator": "Write a compelling introduction for an article about sustainable technology",
    "business-analyst": "Evaluate the market opportunity for AI-powered customer service tools",
  }

  const defaultPrompt =
    suggestedPrompts[userProfile.role as keyof typeof suggestedPrompts] || suggestedPrompts.researcher

  const handleRunComparison = async () => {
    setIsRunning(true)
    // Simulate API call
    setTimeout(() => {
      setResults({
        models: ["GPT-4o", "Claude 3 Opus"],
        responses: {
          "GPT-4o": "This is a simulated response from GPT-4o showing analytical approach...",
          "Claude 3 Opus": "This is a simulated response from Claude showing ethical considerations...",
        },
        diversityDetected: true,
      })
      setIsRunning(false)
    }, 3000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Try this sample prompt (or write your own):</label>
        <textarea
          className="w-full p-3 border rounded-md resize-none"
          rows={3}
          value={prompt || defaultPrompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Pre-configured for you:</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Models:</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">GPT-4o</Badge>
              <Badge variant="outline">Claude 3 Opus</Badge>
            </div>
          </div>
          <div>
            <span className="font-medium">Features:</span>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">Cognitive Diversity</Badge>
              {userProfile.useCase === "research" && <Badge variant="outline">RAG</Badge>}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleRunComparison} disabled={isRunning || !prompt.trim()} className="w-full">
        {isRunning ? (
          <>
            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Running Comparison...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Run Your First Comparison
          </>
        )}
      </Button>

      {results && (
        <div className="space-y-4 mt-6">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium text-green-800 dark:text-green-200">Comparison Complete!</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Great! The models provided different perspectives. This is cognitive diversity in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(results.responses).map(([model, response]) => (
              <Card key={model}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{model}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{response as string}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureTourStep({ userProfile }: { userProfile: any }) {
  const features = [
    {
      title: "Cognitive Diversity Detection",
      description: "Automatically detects when models think differently",
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      relevant: true,
    },
    {
      title: "AI Collaboration Mode",
      description: "Models work together to reach consensus",
      icon: <Users className="h-6 w-6 text-green-500" />,
      relevant: userProfile.experience !== "beginner",
    },
    {
      title: "RAG Enhancement",
      description: "Upload documents to enhance AI responses",
      icon: <Zap className="h-6 w-6 text-purple-500" />,
      relevant: userProfile.useCase === "research" || userProfile.useCase === "business",
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Here are some powerful features you might find useful:</p>
      {features
        .filter((feature) => feature.relevant)
        .map((feature, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-start space-x-4">
              {feature.icon}
              <div>
                <h4 className="font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

function CompletionStep({ userProfile }: { userProfile: any }) {
  return (
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Welcome aboard!</h3>
        <p className="text-muted-foreground">
          Your workspace is ready. We've customized everything based on your preferences.
        </p>
      </div>

      <div className="bg-muted/50 p-4 rounded-md text-left">
        <h4 className="font-medium mb-2">Your personalized setup:</h4>
        <ul className="text-sm space-y-1">
          <li>• Interface optimized for {userProfile.experience} users</li>
          <li>• Pre-configured for {userProfile.useCase} workflows</li>
          <li>• Smart model recommendations enabled</li>
          {userProfile.useCase === "research" && <li>• RAG features activated</li>}
        </ul>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline">Take a Tour</Button>
        <Button>Start Comparing</Button>
      </div>
    </div>
  )
}
