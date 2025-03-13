"use client"

import { useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, SearchIcon } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"

type CallStatus = {
  status: string
  result?: string
  error?: string
}

type CustomPublicClient = {
  request(args: { method: 'wallet_showCallsStatus'; params: [string] }): Promise<CallStatus>
}

export function ShowCallsStatusTile() {
  const { address } = useAccount()
  const publicClient = usePublicClient() as unknown as CustomPublicClient

  const [callId, setCallId] = useState("")
  const [status, setStatus] = useState<CallStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showCallsStatus = async () => {
    if (!address || !publicClient || !callId) return

    setIsLoading(true)
    setError(null)
    setStatus(null)

    try {
      // This is a custom RPC method for EIP-5792
      const result = await publicClient.request({
        method: "wallet_showCallsStatus",
        params: [callId],
      })

      setStatus(result)
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
            <div className={`rounded-md ${
              status.error ? 'bg-red-50/50 border border-red-100' : 'bg-green-50/50 border border-green-100'
            } p-4 w-full`}>
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Status: <span className="font-mono">{status.status}</span>
                </div>
                {status.result && (
                  <div className="text-sm text-green-700 font-mono bg-green-100/50 p-3 rounded break-all">
                    {status.result}
                  </div>
                )}
                {status.error && (
                  <div className="text-sm text-red-700 font-mono bg-red-100/50 p-3 rounded break-all">
                    {status.error}
                  </div>
                )}
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
          onClick={showCallsStatus} 
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
