"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, CheckCircle2 } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"
import { getCapabilities } from "@wagmi/core/experimental"
import { config } from "@/lib/wagmi"

type WalletCapability = {
  method: string
  type: 'method' | 'event'
}

export function GetCapabilitiesTile() {
  const { address } = useAccount()
  const [capabilities, setCapabilities] = useState<WalletCapability[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCapabilities = async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await getCapabilities(config)
      setCapabilities(Object.values(result).map(cap => ({
        method: cap.method,
        type: cap.type
      })))
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to get wallet capabilities")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>wallet_getCapabilities</code>
        </CardTitle>
        <CardDescription>Display the capabilities of the connected wallet (EIP-5792)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {capabilities.length > 0 && (
            <div className="rounded-md bg-green-50/50 border border-green-100 p-4 w-full">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3 space-y-2 w-full">
                  <div className="text-sm font-medium text-green-700">
                    Supported Methods
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {capabilities.map((cap, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                        {cap.method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full" 
          onClick={fetchCapabilities} 
          disabled={isLoading || !address}
        >
          {isLoading ? "Checking Capabilities..." : "Get Capabilities"}
          <Shield className="ml-2 h-4 w-4" />
        </Button>
        {error && <ErrorMessage message={error} />}
      </CardFooter>
    </Card>
  )
}

