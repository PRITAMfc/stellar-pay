"use client";

import { useState } from "react";
import {
  Wallet,
  Copy,
  Check,
  ArrowUpRight,
  Refresh,
  Logout,
  AlertCircle,
  CheckCircle,
  Loader,
  Lightning,
} from "reicon-react";

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  balance: string;
  isLoading: boolean;
  isBalanceLoading: boolean;
  onConnect: () => Promise<{ success: boolean; error?: string }>;
  onDisconnect: () => void;
  onRefreshBalance: () => void;
}

export default function WalletConnect({
  isConnected,
  address,
  balance,
  isLoading,
  isBalanceLoading,
  onConnect,
  onDisconnect,
  onRefreshBalance,
}: WalletConnectProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    const result = await onConnect();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (!isConnected) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-[#08051A] to-[#140E2E] rounded-2xl border border-purple-500/20 p-8 shadow-2xl shadow-purple-500/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Lightning className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Connect Wallet
            </h2>
            <p className="text-gray-400 text-sm">
              Connect your Freighter wallet to start sending XLM on testnet
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Connect Freighter
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-xs mt-4">
            Don&apos;t have Freighter?{" "}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Install it here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-[#08051A] to-[#140E2E] rounded-2xl border border-purple-500/20 p-6 shadow-2xl shadow-purple-500/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Connected</p>
              <p className="text-gray-400 text-xs">Freighter Wallet</p>
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Disconnect"
          >
            <Logout className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-black/30 rounded-xl p-4 mb-4">
          <p className="text-gray-400 text-xs mb-2">Address</p>
          <div className="flex items-center gap-2">
            <code className="text-white text-sm font-mono flex-1 truncate">
              {shortAddress}
            </code>
            <button
              onClick={copyAddress}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all"
              title="View on explorer"
            >
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-xs">XLM Balance</p>
            <button
              onClick={onRefreshBalance}
              disabled={isBalanceLoading}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-all disabled:opacity-50"
              title="Refresh balance"
            >
              <Refresh
                className={`w-3 h-3 ${isBalanceLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-white">
              {parseFloat(balance).toFixed(2)}
            </span>
            <span className="text-gray-400 text-sm">XLM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
