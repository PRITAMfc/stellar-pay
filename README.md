# StellarPay - Simple Payment dApp

A modern Stellar payment dApp built for the **Stellar Developer Challenge Program - Level 1 White Belt** submission. Send XLM on the Stellar testnet using the Freighter wallet.

## Project Description

StellarPay is a clean, minimal payment dApp that allows users to connect their Freighter wallet and send XLM on the Stellar testnet. The application features a dark-themed UI with gradient accents, real-time balance fetching, input validation, and clear transaction feedback including success/failure states with links to view transactions on Stellar Expert.

**Key capabilities:**
- Connect and disconnect Freighter wallet
- Display real-time XLM balance with refresh
- Send XLM to any Stellar address on testnet
- Show transaction hash and confirmation on success
- Comprehensive error handling and validation

## Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Icons**: Reicon React
- **Blockchain**: Stellar SDK + Freighter API
- **Language**: TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Freighter Browser Extension](https://www.freighter.app/) (Chrome / Firefox / Brave)

## Setup Instructions (How to Run Locally)

1. **Clone the repository**

```bash
git clone https://github.com/PRITAMfc/stellar-pay.git
cd stellar-pay
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open in browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Install Freighter** - Add the Freighter browser extension and create/import a wallet
2. **Switch to Testnet** - In Freighter settings, select "Testnet" as the network
3. **Get Test XLM** - Visit the [Stellar Testnet Faucet](https://friendbot.stellar.org/) to fund your wallet
4. **Connect Wallet** - Click "Connect Freighter" on the dApp
5. **Send XLM** - Enter a destination address and amount, then click "Send XLM"

---

## Screenshots

### 1. Wallet Connected State

![Wallet Connected](public/screenshots/wallet-connected.png)

The wallet connection card displays the connected Freighter wallet address (truncated with a copy button) and a green "Connected" indicator in the header. The address can be viewed on Stellar Expert via the external link icon.

### 2. Balance Displayed

![Balance Displayed](public/screenshots/balance-displayed.png)

The XLM balance is fetched in real-time from the Stellar testnet Horizon API and displayed prominently in the wallet card. A refresh button allows the user to re-fetch the balance at any time.

### 3. Successful Testnet Transaction

![Successful Transaction](public/screenshots/transaction-success.png)

After entering a valid destination address and amount and clicking "Send XLM", the transaction is signed via Freighter and submitted to the testnet. A green success card appears showing a confirmation message and a clickable link to view the transaction hash on Stellar Expert.

### 4. Transaction Result Shown to User

![Transaction Result](public/screenshots/transaction-result.png)

The transaction result panel shows the status (success or failure), the transaction hash as a link to Stellar Expert, and a summary of the amount sent and the destination address. On failure, a red error card with the error message is displayed instead.

---

## Project Structure

```
stellar-pay/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── WalletConnect.tsx  # Wallet connection component
│   │   └── SendXLM.tsx       # Send XLM form component
│   └── lib/
│       ├── stellar.ts        # Stellar SDK utilities
│       └── useWallet.ts      # Wallet React hook
├── public/
│   └── screenshots/          # App screenshots for README
├── package.json
├── README.md
└── tsconfig.json
```

## Network

This dApp operates on **Stellar Testnet** only. No real funds are involved.

## License

MIT

## Acknowledgments

- [Stellar Development Foundation](https://stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Reicon Icons](https://reicon.dev/)
