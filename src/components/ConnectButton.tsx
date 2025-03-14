'use client'

import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'

export function ConnectButton() {
  const [open, setOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setOpen(false)
    }
  }

  const handleSwitchChain = (id: number) => {
    try {
      switchChain({ chainId: id })
      toast.success(`Switched to ${chains.find(c => c.id === id)?.name || id}`)
    } catch (error) {
      toast.error('Failed to switch chain')
      console.error(error)
    }
  }

  if (isConnected) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Connected to</span>
          <span className="font-mono text-sm">{address}</span>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Chain: {chains.find(c => c.id === chainId)?.name || chainId}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Switch Network</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {chains.map((chain) => (
                  <Button
                    key={chain.id}
                    onClick={() => handleSwitchChain(chain.id)}
                    variant={chain.id === chainId ? "default" : "outline"}
                  >
                    {chain.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              disabled={!connector.ready || isPending}
            >
              {connector.name}
              {isPending && connector.id === connectors.find(c => c.id)?.id && ' (connecting...)'}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 