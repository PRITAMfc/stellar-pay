import * as StellarSdk from "@stellar/stellar-sdk";
import {
  isConnected,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

const HORIZON_URL = process.env.HORIZON_URL || "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = process.env.NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function checkFreighterConnection(): Promise<boolean> {
  try {
    const result = await isConnected();
    console.log("Freighter isConnected result:", result);
    return !!result.isConnected;
  } catch (e) {
    console.error("Freighter not detected:", e);
    return false;
  }
}

export async function getFreighterAddress(): Promise<{ address: string; error?: string }> {
  try {
    const result = await getAddress();
    console.log("Freighter getAddress result:", result);
    if (result.error) {
      return { address: "", error: result.error || "Failed to get address" };
    }
    return { address: result.address };
  } catch (e) {
    console.error("getAddress failed:", e);
    return { address: "", error: "Freighter extension not found. Please install it from freighter.app" };
  }
}

export async function fetchXLMBalance(publicKey: string): Promise<string> {
  try {
    const response = await fetch(`/api/balance?address=${publicKey}`);
    if (!response.ok) {
      return "0";
    }
    const data = await response.json();
    return data.balance || "0";
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return "0";
  }
}

export async function sendXLM(
  destination: string,
  amount: string,
  sourcePublicKey: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const sourceAccount = await server.loadAccount(sourcePublicKey);
    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(180)
      .build();

    const txXDR = transaction.toXDR();

    const signResult = await signTransaction(txXDR, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (signResult.error) throw new Error(signResult.error);

    const result = await server
      .submitTransaction(StellarSdk.TransactionBuilder.fromXDR(
        signResult.signedTxXdr,
        NETWORK_PASSPHRASE
      ));

    return { success: true, hash: result.hash };
  } catch (error) {
    console.error("Transaction failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Transaction failed";
    return { success: false, error: errorMessage };
  }
}
