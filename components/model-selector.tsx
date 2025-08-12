"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface ModelData {
  id: string
  name: string
  provider: string
}

interface ModelSelectorProps {
  availableModels: ModelData[]
  selectedModels: string[]
  onChange: (models: string[]) => void
}

export function ModelSelector({ availableModels, selectedModels, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onChange(selectedModels.filter((id) => id !== modelId))
    } else {
      onChange([...selectedModels, modelId])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[250px] justify-between bg-transparent"
        >
          {selectedModels.length > 0
            ? `${selectedModels.length} model${selectedModels.length > 1 ? "s" : ""} selected`
            : "Select models..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            <CommandGroup>
              {availableModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => {
                    toggleModel(model.id)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedModels.includes(model.id) ? "opacity-100" : "opacity-0")}
                  />
                  <span className="flex-1">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.provider}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
