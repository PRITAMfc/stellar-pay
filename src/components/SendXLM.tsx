"use client";

import { useState } from "react";
import {
  Send,
  ArrowRight,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Loader,
  AlertCircle,
} from "reicon-react";

interface SendXLMProps {
  isConnected: boolean;
  balance: string;
  onSend: (
    destination: string,
    amount: string
  ) => Promise<{ success: boolean; hash?: string; error?: string }>;
}

export default function SendXLM({ isConnected, balance, onSend }: SendXLMProps) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
    hash?: string;
  } | null>(null);

  const handleSend = async () => {
    if (!destination || !amount) return;

    setIsSending(true);
    setResult(null);

    try {
      const txResult = await onSend(destination, amount);

      if (txResult.success) {
        setResult({
          type: "success",
          message: "Transaction sent successfully!",
          hash: txResult.hash,
        });
        setDestination("");
        setAmount("");
      } else {
        setResult({
          type: "error",
          message: txResult.error || "Transaction failed",
        });
      }
    } catch (error) {
      setResult({
        type: "error",
        message: error instanceof Error ? error.message : "Transaction failed",
      });
    } finally {
      setIsSending(false);
    }
  };

  const setMaxAmount = () => {
    const max = Math.max(0, parseFloat(balance) - 0.00001);
    setAmount(max.toFixed(7));
  };

  const isValid =
    destination.startsWith("G") &&
    destination.length === 56 &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= parseFloat(balance);

  if (!isConnected) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-to-br from-[#08051A] to-[#140E2E] rounded-2xl border border-purple-500/20 p-6 shadow-2xl shadow-purple-500/10 opacity-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-400">Send XLM</h2>
          </div>
          <p className="text-gray-500 text-sm text-center py-8">
            Connect your wallet to send XLM
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-br from-[#08051A] to-[#140E2E] rounded-2xl border border-purple-500/20 p-6 shadow-2xl shadow-purple-500/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Send XLM</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs mb-2 block">
              Destination Address
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="G..."
              className="w-full bg-black/30 border border-purple-500/20 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
            />
            {destination && !destination.startsWith("G") && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Address must start with G
              </p>
            )}
            {destination &&
              destination.startsWith("G") &&
              destination.length !== 56 && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Address must be 56 characters
                </p>
              )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-400 text-xs">Amount (XLM)</label>
              <button
                onClick={setMaxAmount}
                className="text-purple-400 text-xs hover:text-purple-300 transition-colors"
              >
                Max
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0000001"
                min="0"
                className="w-full bg-black/30 border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                XLM
              </span>
            </div>
            {amount && parseFloat(amount) > parseFloat(balance) && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Insufficient balance
              </p>
            )}
          </div>

          {destination && amount && isValid && (
            <div className="bg-black/30 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You send</span>
                <span className="text-white font-semibold">{amount} XLM</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-400">To</span>
                <span className="text-white font-mono text-xs">
                  {destination.slice(0, 8)}...{destination.slice(-4)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!isValid || isSending}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
          >
            {isSending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Send XLM
              </>
            )}
          </button>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              result.type === "success"
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    result.type === "success"
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {result.type === "success"
                    ? "Transaction Successful!"
                    : "Transaction Failed"}
                </p>
                <p className="text-gray-400 text-xs mt-1">{result.message}</p>
                {result.hash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs mt-2 transition-colors"
                  >
                    View on Explorer
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
