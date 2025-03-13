import { WalletProvider } from "@/components/wallet-provider"
import DashboardPage from "@/components/dashboard-page"

export default function Home() {
  return (
    <WalletProvider>
      <DashboardPage />
    </WalletProvider>
  )
}

