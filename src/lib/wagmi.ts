import { http, type Transport } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { createConfig } from 'wagmi'
import { QueryClient } from '@tanstack/react-query'
import { chains, mainnet, sepolia, arbitrum, base } from './chains'
import { optimism, unichain, unichainSepolia } from 'wagmi/chains'

// Create a query client
export const queryClient = new QueryClient()

// Create wagmi config
export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http() as Transport,
    [sepolia.id]: http() as Transport,
    [arbitrum.id]: http() as Transport,
    [base.id]: http() as Transport,
    [unichain.id]: http() as Transport,
    [unichainSepolia.id]: http() as Transport,
    [optimism.id]: http() as Transport,
  } as Record<(typeof chains)[number]['id'], Transport>,
  connectors: [
    injected(),
  ],
})
