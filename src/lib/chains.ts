import { mainnet, sepolia, arbitrum, base, optimism, unichainSepolia, unichain } from "wagmi/chains"

// Re-export individual chains
export { mainnet, sepolia, arbitrum, base, optimism, unichainSepolia }
// Export all chains as a tuple to satisfy readonly [Chain, ...Chain[]]
export const chains = [mainnet, sepolia, unichainSepolia, arbitrum, base, unichain, optimism] as const

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
  [sepolia.id]: {
    icon: "🔷",
    name: "Sepolia",
  },
  [unichainSepolia.id]: {
    icon: "🦄",
    name: "Unichain Sepolia",
  },
  [mainnet.id]: {
    icon: "🌐",
    name: "Ethereum",
  },
  [unichain.id]: {
    icon: "🦄",
    name: "Unichain",
  },
  [arbitrum.id]: {
    icon: "⚡",
    name: "Arbitrum",
  },
  [base.id]: {
    icon: "🔵",
    name: "Base",
  },
  [optimism.id]: {
    icon: "🔵",
    name: "Optimism",
  },
}
