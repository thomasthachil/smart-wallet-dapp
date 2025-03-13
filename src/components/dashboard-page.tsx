"use client"
import { useAccount } from "wagmi"
import { Header } from "@/components/header"
import { SignTypedDataTile } from "@/components/tiles/sign-typed-data-tile"
import { GetCapabilitiesTile } from "@/components/tiles/get-capabilities-tile"
import { GetCallsStatusTile } from "@/components/tiles/get-calls-status-tile"
import { SendTransactionTile } from "@/components/tiles/send-transaction-tile"
import { SendCallsTile } from "@/components/tiles/send-calls-tile"
import { ShowCallsStatusTile } from "@/components/tiles/show-calls-status-tile"

export default function DashboardPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">EIP-5792</h2>
          <span className="text-sm text-muted-foreground">Smart Wallet Interface</span>
        </div>
        {!isConnected ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">Please connect your wallet to test dApp functionalities</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <GetCapabilitiesTile />
            </div>
            <div className="md:col-span-1">
              <SendTransactionTile />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <SignTypedDataTile />
            </div>
            <div className="md:col-span-1">
              <GetCallsStatusTile />
            </div>
            <div className="md:col-span-1">
              <SendCallsTile />
            </div>
            <div className="md:col-span-1">
              <ShowCallsStatusTile />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

