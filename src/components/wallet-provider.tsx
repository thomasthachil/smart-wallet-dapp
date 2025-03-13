"use client"

import { config } from "@/lib/wagmi"
import { ReactNode } from "react"
import { useAccount, WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Account } from "./Account"
import { WalletOptions } from "./WalletOptions"

const queryClient = new QueryClient()



export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* <ConnectWallet /> */}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

