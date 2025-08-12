import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ModelData {
  id: string
  name: string
  provider: string
}

interface ModelResponseProps {
  model: ModelData
  response: string
  loading: boolean
  error: string | null
}

export function ModelResponse({ model, response, loading, error }: ModelResponseProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{model.name}</span>
          <span className="text-xs text-muted-foreground font-normal">{model.provider}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">Error: {error}</div>
        ) : response ? (
          <div className="text-sm whitespace-pre-wrap">{response}</div>
        ) : (
          <div className="text-muted-foreground text-sm italic flex items-center justify-center h-full">
            No response yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}
