import { CompareMode } from "@/components/compare-mode"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">AI Model Comparison</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Compare responses from different AI models for the same prompt
        </p>
        <CompareMode />
      </div>
    </main>
  )
}
