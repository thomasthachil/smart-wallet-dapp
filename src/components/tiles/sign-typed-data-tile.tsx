"use client"

import { useState } from "react"
import { useChainId, useSignTypedData } from "wagmi"
import type { TypedDataDomain } from "viem"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, PenLine, CheckCircle2 } from "lucide-react"
import { ErrorMessage } from "@/components/custom/error-message"

type TypedDataField = { name: string; type: string }

// Example EIP-712 typed data
const domainWithChainId = (chainId: number): TypedDataDomain => ({
  name: 'Permit2',
  chainId,
  verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3' // Permit2 contract
} as const)

const types = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' }
  ] as TypedDataField[],
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' }
  ] as TypedDataField[]
} as const

const value = {
  details: {
    token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`, // WETH
    amount: BigInt('1000000000000000000'), // 1 WETH
    expiration: BigInt('1742169600'), // March 14, 2025
    nonce: BigInt('0')
  },
  spender: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' as `0x${string}`, // Uniswap Router
  sigDeadline: BigInt('1742169600') // March 14, 2025
} as const

// Helper function to safely stringify BigInt values
function replacer(_: string, value: unknown) {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return value
}

export function SignTypedDataTile() {
  const [signature, setSignature] = useState<`0x${string}` | null>(null)
  const { signTypedDataAsync: signTypedData, status, error } = useSignTypedData()

  const chainId = useChainId()
  const domain = domainWithChainId(chainId)
  const [messageToSign, setMessageToSign] = useState(JSON.stringify({ domain, types, value }, replacer, 2))

  const handleSign = async () => {
    try {
      const sig = await signTypedData({ 
        domain,
        types,
        primaryType: "PermitSingle" as const,
        message: value,
      })
      setSignature(sig)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <code>eth_signTypedData</code>
        </CardTitle>
        <CardDescription>
          Sign a typed message to approve WETH spending on Uniswap
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid w-full gap-2">
            <Label className="text-sm font-medium">Message to Sign</Label>
            <Textarea
              readOnly={false}
              value={messageToSign}
              onChange={(e) => setMessageToSign(e.target.value)}
              className="font-mono text-xs h-[180px] bg-slate-50/50"
            />
          </div>

          {signature && (
            <div className="rounded-md bg-green-50/50 border border-green-100 p-4 w-full">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="ml-3 space-y-2 w-full">
                  <div className="text-sm font-medium text-green-700">
                    Signature Generated
                  </div>
                  <div className="text-sm text-green-700 font-mono bg-green-100/50 p-3 rounded break-all">
                    {signature}
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'pending' && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={handleSign} 
          disabled={status === 'pending'}
          className="w-full"
        >
          {status === 'pending' ? 'Signing Message...' : 'Sign Message'}
          <PenLine className="ml-2 h-4 w-4" />
        </Button>
        {error?.message && <ErrorMessage message={error.message} />}
      </CardFooter>
    </Card>
  )
}

