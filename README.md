# Smart Wallet dApp Tester

A testing application for various dApp functionalities, with a focus on EIP-5792 related capabilities. This project allows you to test different wallet interactions including transactions, signing, and smart wallet specific features.

## Features

- Wallet connection with chain switching
- Basic transaction sending
- EIP-712 typed data signing
- EIP-5792 related methods:
  - `wallet_getCapabilities`
  - `wallet_getCallsStatus`
  - `wallet_sendCalls`

## Technologies Used

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui for components
- viem and wagmi for blockchain interactions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A WalletConnect Project ID (for WalletConnect support)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-wallet-dapp.git
cd smart-wallet-dapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your WalletConnect Project ID:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Switch networks if needed
3. Use the different tiles to test various wallet functionalities:
   - Send transactions
   - Sign typed data
   - Test EIP-5792 methods

## Notes on EIP-5792

EIP-5792 introduces methods for smart contract wallets to handle batched transactions and provide information about their capabilities. Not all wallets support these methods yet, so results may vary depending on the wallet you're using.

## License

MIT
