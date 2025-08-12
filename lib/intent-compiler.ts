export interface IntentCompilerResult {
  intent: string
  compiledPrompt: string
}

export async function compileIntent(prompt: string): Promise<IntentCompilerResult> {
  try {
    const response = await fetch("/api/intent-compiler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error(`Intent compiler API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error compiling intent:", error)
    // Fallback to original prompt if intent compilation fails
    return {
      intent: "unknown",
      compiledPrompt: prompt,
    }
  }
}
