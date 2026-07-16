"use client";

import { useWallet } from "@/lib/useWallet";
import WalletConnect from "@/components/WalletConnect";
import SendXLM from "@/components/SendXLM";
import { Lightning, CodeSquare } from "reicon-react";

export default function Home() {
  const wallet = useWallet();

  return (
    <div className="min-h-screen bg-[#050212] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Lightning className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">StellarPay</h1>
                <p className="text-gray-500 text-xs">Testnet Payment dApp</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium">
                Testnet
              </span>
              {wallet.isConnected && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs">Connected</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Send{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                XLM
              </span>{" "}
              on Testnet
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Connect your Freighter wallet and send Stellar payments on
              testnet
            </p>
          </div>

          <div className="w-full max-w-lg space-y-6">
            <WalletConnect
              isConnected={wallet.isConnected}
              address={wallet.address}
              balance={wallet.balance}
              isLoading={wallet.isLoading}
              isBalanceLoading={wallet.isBalanceLoading}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
              onRefreshBalance={wallet.refreshBalance}
            />

            <SendXLM
              isConnected={wallet.isConnected}
              balance={wallet.balance}
              onSend={wallet.sendTransaction}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-xs">
              Built for Stellar Developer Challenge Program - Level 1 White
              Belt
            </p>
          </div>
        </main>

        <footer className="p-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-gray-600 text-xs">
              &copy; 2026 StellarPay
            </p>
            <a
              href="https://github.com/PRITAMfc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors"
            >
              <CodeSquare className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
