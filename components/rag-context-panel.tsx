"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FileText, Upload, Database, Search, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface RagContextPanelProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  context: string
  onContextChange: (context: string) => void
  onRetrieve: () => void
  retrievedDocuments: string[]
  isRetrieving: boolean
}

export function RagContextPanel({
  enabled,
  onToggle,
  context,
  onContextChange,
  onRetrieve,
  retrievedDocuments,
  isRetrieving,
}: RagContextPanelProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Database className="h-5 w-5 mr-2 text-primary" />
            RAG Context
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="rag-toggle" className="text-sm text-muted-foreground">
              {enabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch id="rag-toggle" checked={enabled} onCheckedChange={onToggle} />
          </div>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Manual Input</TabsTrigger>
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="retrieve">Retrieved Context</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="context">Enter context for RAG</Label>
                <Textarea
                  id="context"
                  placeholder="Enter documents, facts, or context to augment the prompt..."
                  className="min-h-[120px]"
                  value={context}
                  onChange={(e) => onContextChange(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">Upload PDF, TXT, or DOCX files to use as context</p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  multiple
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileChange}
                />
                <Button asChild variant="outline" size="sm">
                  <label htmlFor="file-upload">Select Files</label>
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  <ScrollArea className="h-[120px] rounded-md border p-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </TabsContent>

            <TabsContent value="retrieve" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Retrieved Documents</Label>
                  <Badge variant="outline" className="ml-2">
                    {retrievedDocuments.length} found
                  </Badge>
                </div>

                {retrievedDocuments.length > 0 ? (
                  <ScrollArea className="h-[150px] rounded-md border p-2">
                    {retrievedDocuments.map((doc, index) => (
                      <div key={index} className="py-2 border-b last:border-0">
                        <p className="text-sm">{doc}</p>
                      </div>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[150px] border rounded-md p-4">
                    <Search className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      No documents retrieved yet. Click "Retrieve Context" to search for relevant documents.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
      <CardFooter className={enabled ? "pt-0" : "pt-0 pb-3"}>
        {enabled && (
          <Button variant="outline" className="w-full bg-transparent" onClick={onRetrieve} disabled={isRetrieving}>
            {isRetrieving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Retrieving...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Retrieve Context
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
