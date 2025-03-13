"use client"

import { useState } from "react"
import { useAccount, usePublicClient } from "wagmi"
import { parseEther } from "viem"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, SendHorizonal, CheckCircle2 } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"

// Define the shape of a wallet call
type WalletCall = {
  method: 'eth_sendTransaction'
  params: [{
    from: string
    to: string
    value: string
    gas: string
  }]
}

type CustomPublicClient = {
  request(args: { method: 'wallet_sendCalls'; params: [WalletCall[]] }): Promise<string>
}

export function SendCallsTile() {
  const { address } = useAccount()
  const publicClient = usePublicClient() as unknown as CustomPublicClient

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [callId, setCallId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendCalls = async () => {
    if (!address || !publicClient || !recipient || !amount) return

    setIsLoading(true)
    setError(null)

    try {
      // Prepare a transaction call
      const calls: WalletCall[] = [
        {
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: recipient as string,
              value: parseEther(amount).toString(),
              gas: "0x5208", // 21000
            },
          ],
        },
      ]

      // This is a custom RPC method for EIP-5792
      const result = await publicClient.request({
        method: "wallet_sendCalls",
        params: [calls],
      })

      setCallId(result)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Failed to send calls")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>wallet_sendCalls</code>
        </CardTitle>
        <CardDescription>Send multiple calls in a single transaction (EIP-5792)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="recipient" className="text-sm font-medium">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
            />
          </div>

          {callId && (
            <div className="rounded-md bg-green-50/50 border border-green-100 p-4 w-full">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3 space-y-2 w-full">
                  <div className="text-sm font-medium text-green-700">
                    Call ID Generated
                  </div>
                  <div className="text-sm text-green-700 font-mono bg-green-100/50 p-3 rounded break-all">
                    {callId}
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
          onClick={sendCalls} 
          disabled={isLoading || !address || !recipient || !amount}
        >
          {isLoading ? "Sending Calls..." : "Send Calls"}
          <SendHorizonal className="ml-2 h-4 w-4" />
        </Button>
        {error && <ErrorMessage message={error} />}
      </CardFooter>
    </Card>
  )
}

