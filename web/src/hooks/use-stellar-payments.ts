import { useState } from "react";
import {
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
} from "@stellar/stellar-sdk";
import * as StellarSdk from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export function useStellarPayment(sourceSecret?: string) {
  const [loading, setLoading] = useState(false);
  const [txResult, setTxResult] = useState<null | {
    success: boolean;
    hash?: string;
    error?: string;
  }>(null);

  const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonURL);

  // Estimate fee and time
  const estimations = async () => {
    try {
      const basefee = await server.fetchBaseFee();

      const feeXLM = (basefee * 0.0000001).toFixed(6);

      return {
        estimatedFee: feeXLM,
        estimatedTime: 5,
      };
    } catch (err: unknown) {
      let errorMessage = "Unknown_error_while_estimating_transaction";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      return {
        error: errorMessage,
      };
    }
  };

  const sendXLM = async ({
    destination,
    amount,
    memo,
    privateKey,
  }: {
    destination: string;
    amount: string;
    memo?: string;
    privateKey?: string;
  }) => {
    setLoading(true);
    setTxResult(null);

    try {
      // Use provided private key or the one from initialization
      const secretKey = privateKey || sourceSecret;
      if (!secretKey) {
        throw new Error("Private key is required for transaction");
      }

      if (
        !destination ||
        destination.length !== 56 ||
        !destination.startsWith("G")
      ) {
        throw new Error("Invalid_Stellar_address");
      }

      Keypair.fromPublicKey(destination);

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid_amount");
      }

      const sourceKeypair = Keypair.fromSecret(secretKey);
      const account = await server.loadAccount(sourceKeypair.publicKey());

      const fee = await server.fetchBaseFee();

      // Check if destination account exists
      let destinationExists = false;
      try {
        await server.loadAccount(destination);
        destinationExists = true;
      } catch (error) {
        // Account doesn't exist, we'll need to create it
        destinationExists = false;
      }

      const txBuilder = new TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      });

      if (destinationExists) {
        // Account exists, use payment operation
        txBuilder.addOperation(
          Operation.payment({
            destination,
            asset: Asset.native(),
            amount: parsedAmount.toFixed(7),
          })
        );
      } else {
        // Account doesn't exist, use createAccount operation
        // In Stellar, createAccount requires a minimum balance of 1 XLM
        const minBalance = 1.0;
        const totalAmount = Math.max(parsedAmount, minBalance);
        
        txBuilder.addOperation(
          Operation.createAccount({
            destination,
            startingBalance: totalAmount.toFixed(7),
          })
        );
      }

      console.log(txBuilder);

      if (memo) {
        txBuilder.addMemo(Memo.text(memo));
      }

      const transaction = txBuilder.setTimeout(180).build();
      transaction.sign(sourceKeypair);

      const response = await server.submitTransaction(transaction);

      console.log(response);

      setTxResult({ success: true, hash: response.hash });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTxResult({ success: false, error: err.message });
      } else {
        setTxResult({ success: false, error: "Unknown error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetTxResult = () => {
    setTxResult(null);
  };

  return {
    sendXLM,
    loading,
    txResult,
    estimations,
    resetTxResult,
  };
}
