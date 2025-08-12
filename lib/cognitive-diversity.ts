export interface CognitiveDiversityResult {
  significant: boolean
  summary: string
}

export async function analyzeDiversity(responses: Record<string, string>): Promise<CognitiveDiversityResult> {
  try {
    const response = await fetch("/api/cognitive-diff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses }),
    })

    if (!response.ok) {
      throw new Error(`Cognitive diversity API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing diversity:", error)
    // Fallback if analysis fails
    return {
      significant: false,
      summary: "",
    }
  }
}
