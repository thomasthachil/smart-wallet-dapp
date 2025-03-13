"use client"

import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Activity } from "lucide-react"

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
        method: "wallet_getCallsStatus",
        params: [callId],
      })) as CallStatus

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
          <code>
            wallet_getCallsStatus
          </code>
        </CardTitle>
        <CardDescription>Check the status of wallet calls (EIP-5792)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="callId">Call ID</Label>
            <Input id="callId" placeholder="Enter call ID" value={callId} onChange={(e) => setCallId(e.target.value)} />
          </div>

          {callStatus && (
            <div className="space-y-2">
              <Label>Call Status</Label>
              <Textarea readOnly value={JSON.stringify(callStatus, null, 2)} className="h-[100px] font-mono text-xs" />
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={getCallStatus} disabled={isLoading || !address || !callId}>
          Get Call Status
          <Activity className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

