import { ChatOpenAI } from "@langchain/openai"
import { ChatAnthropic } from "@langchain/anthropic"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

export class LangChainIntegration {
  private models: Map<string, any> = new Map()
  private vectorStore: MemoryVectorStore | null = null

  constructor() {
    // Initialize models
    this.models.set("openai/gpt-4o", new ChatOpenAI({ modelName: "gpt-4o" }))
    this.models.set("anthropic/claude-3-opus", new ChatAnthropic({ modelName: "claude-3-opus-20240229" }))
  }

  // Enhanced RAG with LangChain
  async setupRAGChain(documents: string[]) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const splits = await textSplitter.createDocuments(documents)

    this.vectorStore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings())

    return this.vectorStore
  }

  // Create sophisticated prompt chains
  createPromptChain(modelId: string, promptType: "analysis" | "creative" | "factual" | "debate") {
    const model = this.models.get(modelId)
    if (!model) throw new Error(`Model ${modelId} not found`)

    const promptTemplates = {
      analysis: PromptTemplate.fromTemplate(`
        You are an expert analyst. Analyze the following information systematically:
        
        Context: {context}
        Question: {question}
        
        Provide a structured analysis with:
        1. Key findings
        2. Supporting evidence
        3. Implications
        4. Recommendations
        
        Analysis:
      `),

      creative: PromptTemplate.fromTemplate(`
        You are a creative expert. Generate innovative ideas based on:
        
        Context: {context}
        Prompt: {question}
        
        Be creative, original, and provide multiple perspectives.
        
        Creative Response:
      `),

      factual: PromptTemplate.fromTemplate(`
        You are a fact-checking expert. Provide accurate, well-sourced information:
        
        Context: {context}
        Question: {question}
        
        Ensure accuracy and cite sources where possible.
        
        Factual Response:
      `),

      debate: PromptTemplate.fromTemplate(`
        You are participating in a structured debate. Present your position clearly:
        
        Context: {context}
        Topic: {question}
        Other Positions: {other_positions}
        
        Present your argument with evidence and reasoning.
        
        Position:
      `),
    }

    const chain = RunnableSequence.from([promptTemplates[promptType], model, new StringOutputParser()])

    return chain
  }

  // Multi-step reasoning chain
  async createReasoningChain(modelId: string) {
    const model = this.models.get(modelId)

    const stepByStepPrompt = PromptTemplate.fromTemplate(`
      Break down this problem into steps:
      
      Problem: {problem}
      Context: {context}
      
      Step 1: Identify the key components
      Step 2: Analyze relationships
      Step 3: Consider implications
      Step 4: Synthesize solution
      
      Reasoning:
    `)

    const synthesisPrompt = PromptTemplate.fromTemplate(`
      Based on this step-by-step analysis:
      {reasoning}
      
      Provide a final synthesis and recommendation:
    `)

    const reasoningChain = RunnableSequence.from([stepByStepPrompt, model, new StringOutputParser()])

    const synthesisChain = RunnableSequence.from([synthesisPrompt, model, new StringOutputParser()])

    return {
      reasoning: reasoningChain,
      synthesis: synthesisChain,
    }
  }

  // Enhanced model comparison with chains
  async compareModelsWithChains(
    prompt: string,
    context: string,
    models: string[],
    promptType: "analysis" | "creative" | "factual" | "debate",
  ) {
    const results: Record<string, any> = {}

    for (const modelId of models) {
      try {
        const chain = this.createPromptChain(modelId, promptType)

        const response = await chain.invoke({
          question: prompt,
          context: context,
          other_positions: "", // For debate mode
        })

        results[modelId] = {
          response,
          metadata: {
            model: modelId,
            promptType,
            timestamp: new Date(),
          },
        }
      } catch (error) {
        results[modelId] = {
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }

    return results
  }

  // RAG-enhanced comparison
  async ragEnhancedComparison(query: string, models: string[], k = 3) {
    if (!this.vectorStore) {
      throw new Error("Vector store not initialized. Call setupRAGChain first.")
    }

    // Retrieve relevant documents
    const relevantDocs = await this.vectorStore.similaritySearch(query, k)
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n")

    // Compare models with enhanced context
    return this.compareModelsWithChains(query, context, models, "analysis")
  }

  // Create evaluation chain
  createEvaluationChain() {
    const evaluationPrompt = PromptTemplate.fromTemplate(`
      Evaluate these AI model responses on the following criteria:
      
      Original Prompt: {prompt}
      
      Responses:
      {responses}
      
      Evaluate each response on:
      1. Accuracy (1-10)
      2. Relevance (1-10)
      3. Clarity (1-10)
      4. Completeness (1-10)
      5. Creativity (1-10)
      
      Provide scores and brief justification for each.
      
      Evaluation:
    `)

    const evaluationModel = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.1 })

    return RunnableSequence.from([evaluationPrompt, evaluationModel, new StringOutputParser()])
  }
}
