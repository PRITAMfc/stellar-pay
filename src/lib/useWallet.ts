"use client";

import { useState, useEffect, useCallback } from "react";
import {
  checkFreighterConnection,
  getFreighterAddress,
  fetchXLMBalance,
  sendXLM,
} from "./stellar";

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  isLoading: boolean;
  isBalanceLoading: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: "",
    balance: "0",
    isLoading: false,
    isBalanceLoading: false,
  });

  const refreshBalance = useCallback(async (address: string) => {
    setWallet((prev) => ({ ...prev, isBalanceLoading: true }));
    try {
      const balance = await fetchXLMBalance(address);
      setWallet((prev) => ({ ...prev, balance, isBalanceLoading: false }));
    } catch {
      setWallet((prev) => ({ ...prev, isBalanceLoading: false }));
    }
  }, []);

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isLoading: true }));
    try {
      const connected = await checkFreighterConnection();
      if (!connected) {
        setWallet((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "Please install Freighter wallet" };
      }

      const address = await getFreighterAddress();
      if (!address || address.length === 0) {
        setWallet((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: "Could not get wallet address" };
      }
      setWallet((prev) => ({
        ...prev,
        isConnected: true,
        address,
        isLoading: false,
      }));

      await refreshBalance(address);
      return { success: true };
    } catch (error) {
      setWallet((prev) => ({ ...prev, isLoading: false }));
      const msg = error instanceof Error ? error.message : "Connection failed";
      return { success: false, error: msg };
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      address: "",
      balance: "0",
      isLoading: false,
      isBalanceLoading: false,
    });
  }, []);

  const sendTransaction = useCallback(
    async (destination: string, amount: string) => {
      if (!wallet.address) {
        return { success: false, error: "Wallet not connected" };
      }
      const result = await sendXLM(destination, amount, wallet.address);
      if (result.success) {
        await refreshBalance(wallet.address);
      }
      return result;
    },
    [wallet.address, refreshBalance]
  );

  useEffect(() => {
    const checkExisting = async () => {
      try {
        const connected = await checkFreighterConnection();
        if (connected) {
          const address = await getFreighterAddress();
          if (address && address.length > 0) {
            setWallet((prev) => ({
              ...prev,
              isConnected: true,
              address,
            }));
            await refreshBalance(address);
          }
        }
      } catch {
        // Freighter not available
      }
    };
    checkExisting();
  }, [refreshBalance]);

  return {
    ...wallet,
    connect,
    disconnect,
    refreshBalance: () => {
      if (wallet.address) refreshBalance(wallet.address);
    },
    sendTransaction,
  };
}
