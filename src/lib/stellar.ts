import * as StellarSdk from "@stellar/stellar-sdk";
import {
  isConnected,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function checkFreighterConnection(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

export async function getFreighterAddress(): Promise<string> {
  const result = await getAddress();
  if (result.error) throw new Error(result.error);
  return result.address;
}

export async function fetchXLMBalance(publicKey: string): Promise<string> {
  try {
    const response = await fetch(
      `https://horizon-testnet.stellar.org/accounts/${publicKey}`
    );
    if (!response.ok) {
      throw new Error("Account not found");
    }
    const data = await response.json();
    const xlmBalance = data.balances?.find(
      (b: { asset_type: string }) => b.asset_type === "native"
    );
    return xlmBalance ? xlmBalance.balance : "0";
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
      networkPassphrase: StellarSdk.Networks.TESTNET,
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
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    if (signResult.error) throw new Error(signResult.error);

    const result = await server
      .submitTransaction(StellarSdk.TransactionBuilder.fromXDR(
        signResult.signedTxXdr,
        StellarSdk.Networks.TESTNET
      ));

    return { success: true, hash: result.hash };
  } catch (error) {
    console.error("Transaction failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Transaction failed";
    return { success: false, error: errorMessage };
  }
}
