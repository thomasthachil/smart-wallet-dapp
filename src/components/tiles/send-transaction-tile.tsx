"use client"

import { useState } from "react"
import { useSendTransaction } from "wagmi"
import { parseEther } from "viem"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"

export function SendTransactionTile() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")

  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction({
    mutation: {
      onSuccess() {
        setAmount('')
        setRecipient('')
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>eth_sendTransaction</code>
        </CardTitle>
        <CardDescription>Send ETH to another address</CardDescription>
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

          {isSuccess && (
            <div className="rounded-md bg-green-50/50 border border-green-100 p-4 w-full">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3 space-y-2 w-full">
                  <div className="text-sm font-medium text-green-700">
                    Transaction Sent
                  </div>
                  <div className="text-sm text-green-700">
                    Your transaction has been sent successfully!
                  </div>
                </div>
              </div>
            </div>
          )}

          {isPending && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          className="w-full" 
          onClick={() => sendTransaction?.({ 
            to: recipient as `0x${string}`,
            value: amount ? parseEther(amount) : undefined 
          })}
          disabled={!sendTransaction || isPending}
        >
          {isPending ? "Sending Transaction..." : "Send Transaction"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {error?.message && <ErrorMessage message={error.message} />}
      </CardFooter>
    </Card>
  )
}

