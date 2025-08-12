export interface RetrievalResult {
  documents: string[]
  error?: string
}

export async function retrieveContext(query: string, context?: string): Promise<RetrievalResult> {
  try {
    // In a real implementation, this would call a vector database or search API
    // For now, we'll simulate retrieval with a delay

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock retrieved documents based on the query
    const mockDocuments = [
      `Document 1: This is relevant information about "${query}". It provides background context and key facts that might be useful for answering the query.`,
      `Document 2: Additional information related to "${query}". This document contains historical data and expert opinions on the subject matter.`,
      `Document 3: Research findings on "${query}". This includes recent studies, statistics, and analytical perspectives that could inform a comprehensive response.`,
    ]

    // If user provided manual context, include it as a document
    const documents = context?.trim() ? [context, ...mockDocuments] : mockDocuments

    return { documents }
  } catch (error) {
    console.error("Error retrieving context:", error)
    return {
      documents: [],
      error: error instanceof Error ? error.message : "Failed to retrieve context",
    }
  }
}

export function formatRagPrompt(userPrompt: string, context: string[]): string {
  if (!context.length) return userPrompt

  const contextText = context.join("\n\n")

  return `
Context information:
${contextText}

Based on the above context, please answer the following:
${userPrompt}
`.trim()
}
