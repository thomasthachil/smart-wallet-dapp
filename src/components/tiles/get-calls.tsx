"use client"

import { useAccount, usePublicClient } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ErrorMessage } from "@/components/custom/error-message"
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
    if (!address || !callId) return

    setIsLoading(true)
    setError(null)

    try {
      // This is a custom RPC method for EIP-5792
      // @ts-expect-error Viem types are not updated yet
      const result = await publicClient.request({
        method: "wallet_getCallsStatus",
        params: [callId as `0x${string}`],
      })

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
        <CardTitle>Get Calls Status</CardTitle>
        <CardDescription>
          Check the status of a call using its ID
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="callId">Call ID</Label>
          <Input
            id="callId"
            placeholder="0x..."
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
          />
        </div>

        {callStatus && (
          <div className="rounded-md bg-muted p-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="font-medium">Status:</span> {callStatus.status}
              </div>
              {callStatus.txHash && (
                <div>
                  <span className="font-medium">Transaction Hash:</span>{" "}
                  {callStatus.txHash}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {error && <ErrorMessage message={error} />}
        <Button className="w-full" onClick={getCallStatus} disabled={isLoading || !callId}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Status
        </Button>
      </CardFooter>
    </Card>
  )
}
