"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, SearchIcon } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"
import { showCallsStatus } from "@wagmi/core/experimental"
import { config } from "@/lib/wagmi"

type CallReceipt = {
  status: "success" | "reverted"
  transactionHash: string
}

type CallStatus = {
  status: "PENDING" | "CONFIRMED"
  receipts?: CallReceipt[]
}

type ShowCallsResponse = {
  status: "PENDING" | "CONFIRMED"
  receipts?: Array<{
    status: "success" | "reverted"
    transactionHash: string
  }>
}

export function ShowCallsStatusTile() {
  const { address } = useAccount()

  const [callId, setCallId] = useState("")
  const [status, setStatus] = useState<CallStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShowCallsStatus = async () => {
    if (!address || !callId) return

    setIsLoading(true)
    setError(null)
    setStatus(null)

    try {
      const result = await Promise.resolve(showCallsStatus(config, {
        id: callId,
      })) as unknown as ShowCallsResponse
      
      setStatus({
        status: result.status,
        receipts: result.receipts,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get call status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>wallet_showCallsStatus</code>
        </CardTitle>
        <CardDescription>Show the status of a call using its ID</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="callId" className="text-sm font-medium">Call ID</Label>
            <Input
              id="callId"
              placeholder="Enter call ID..."
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              className="font-mono"
            />
          </div>

          {status && (
            <div className="rounded-md bg-muted p-4 w-full">
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Status: <span className="font-mono">{status.status}</span>
                </div>
                {status.receipts?.map((receipt, index) => (
                  <div key={receipt.transactionHash} className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Transaction {index + 1}:</span>
                      <span className={receipt.status === "success" ? "text-green-500" : "text-red-500"}>
                        {receipt.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground break-all">
                      {receipt.transactionHash}
                    </div>
                  </div>
                ))}
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
          onClick={handleShowCallsStatus} 
          disabled={isLoading || !address || !callId}
        >
          {isLoading ? "Checking Status..." : "Check Status"}
          <SearchIcon className="ml-2 h-4 w-4" />
        </Button>
        {error && <ErrorMessage message={error} />}
      </CardFooter>
    </Card>
  )
}
