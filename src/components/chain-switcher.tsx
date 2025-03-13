"use client"

import { useSwitchChain, useChainId } from "wagmi"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { chains, chainMetadata } from "@/lib/chains"
import { ChevronDown } from "lucide-react"

export function ChainSwitcher() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const currentChain = chainMetadata[chainId]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{currentChain?.icon}</span>
          <span>{currentChain?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid gap-2">
          {chains.map((chain) => (
            <Button
              key={chain.id}
              variant={chain.id === chainId ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => switchChain?.({ chainId: chain.id })}
            >
              <span>{chainMetadata[chain.id]?.icon}</span>
              <span>{chainMetadata[chain.id]?.name}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
