import { defineChain } from "viem"
import { mainnet, sepolia, arbitrum, base } from "wagmi/chains"

// Re-export individual chains
export { mainnet, sepolia, arbitrum, base }

// Define Unichain (example values - replace with actual ones)
export const unichain = defineChain({
  id: 130,
  name: "UniChain",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.unichain.network"] },
  },
  blockExplorers: {
    default: {
      name: "Unichain Explorer",
      url: "https://uniscan.xyz",
    },
  },
  testnet: false,
})

// Export all chains as a tuple to satisfy readonly [Chain, ...Chain[]]
export const chains = [mainnet, sepolia, arbitrum, base, unichain] as const

// Chain metadata type
type ChainMetadata = {
  icon: string
  name: string
}

// Chain metadata mapping type
type ChainMetadataMapping = {
  [chainId: number]: ChainMetadata
}

// Chain metadata for UI
export const chainMetadata: ChainMetadataMapping = {
  [mainnet.id]: {
    icon: "🌐",
    name: "Ethereum",
  },
  [sepolia.id]: {
    icon: "🔷",
    name: "Sepolia",
  },
  [arbitrum.id]: {
    icon: "⚡",
    name: "Arbitrum",
  },
  [base.id]: {
    icon: "🔵",
    name: "Base",
  },
  [unichain.id]: {
    icon: "🦄",
    name: "Unichain",
  },
}
