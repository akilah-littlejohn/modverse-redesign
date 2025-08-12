export interface DebateResult {
  debateResponses: Record<string, string>
}

export async function generateDebate(responses: Record<string, string>, prompt: string): Promise<DebateResult> {
  try {
    const response = await fetch("/api/debate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses, prompt }),
    })

    if (!response.ok) {
      throw new Error(`Debate API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating debate:", error)
    // Fallback if debate generation fails
    return {
      debateResponses: {},
    }
  }
}
