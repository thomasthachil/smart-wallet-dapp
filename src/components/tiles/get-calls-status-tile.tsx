"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Activity, CheckCircle2 } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"

type CallStatus = {
  id: string
  status: string
  txHash?: string
}

export function GetCallsStatusTile() {
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const [callId, setCallId] = useState("")
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCallStatus = async () => {
    if (!address || !publicClient || !callId) return

    setIsLoading(true)
    setError(null)

    try {
      // This is a custom RPC method for EIP-5792
      const result = (await publicClient.request({
        method: "eth_call",
        params: [{ to: callId.startsWith('0x') ? callId as `0x${string}` : `0x${callId}` }],
      })) as unknown as CallStatus

      setCallStatus(result)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to get call status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>wallet_getCallsStatus</code>
        </CardTitle>
        <CardDescription>Check the status of wallet calls (EIP-5792)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="callId" className="text-sm font-medium">Call ID</Label>
            <Input
              id="callId"
              placeholder="Enter call ID"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              className="font-mono"
            />
          </div>

          {callStatus && (
            <div className="rounded-md bg-green-50/50 border border-green-100 p-4 w-full">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3 space-y-3 w-full">
                  <div className="text-sm font-medium text-green-700">
                    Call Status
                  </div>
                  <div className="grid gap-2 text-sm text-green-700">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <code className="font-mono bg-green-100/50 px-2 py-0.5 rounded">{callStatus.status}</code>
                    </div>
                    {callStatus.txHash && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Transaction:</span>
                        <code className="font-mono bg-green-100/50 px-2 py-0.5 rounded truncate">{callStatus.txHash}</code>
                      </div>
                    )}
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
          onClick={getCallStatus} 
          disabled={isLoading || !address || !callId}
        >
          {isLoading ? "Checking Status..." : "Get Call Status"}
          <Activity className="ml-2 h-4 w-4" />
        </Button>
        {error && <ErrorMessage message={error} />}
      </CardFooter>
    </Card>
  )
}

