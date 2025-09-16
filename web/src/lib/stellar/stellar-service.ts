import { WalletAccount, WalletBalance, WalletTransaction } from "@/types/wallet";

class StellarService {
  private horizonUrl: string = '';

  async initialize(horizonUrl: string): Promise<void> {
    try {
      this.horizonUrl = horizonUrl;
    } catch (error) {
      console.error('❌ Failed to initialize Stellar service:', error);
      throw new Error('Failed to initialize Stellar service');
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const url = `${this.horizonUrl}${endpoint}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Account not found');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  async loadAccount(publicKey: string): Promise<WalletAccount> {
    if (!this.horizonUrl) {
      throw new Error('Stellar service not initialized');
    }

    const accountResponse = await this.makeRequest(`/accounts/${publicKey}`);

    return {
      publicKey: accountResponse.id,
      sequence: accountResponse.sequence,
      subentry_count: accountResponse.subentry_count,
      home_domain: accountResponse.home_domain,
      inflation_destination: accountResponse.inflation_destination,
      last_modified_ledger: accountResponse.last_modified_ledger,
      last_modified_time: accountResponse.last_modified_time,
      thresholds: {
        low_threshold: accountResponse.thresholds.low_threshold,
        med_threshold: accountResponse.thresholds.med_threshold,
        high_threshold: accountResponse.thresholds.high_threshold,
      },
      flags: {
        auth_required: accountResponse.flags.auth_required,
        auth_revocable: accountResponse.flags.auth_revocable,
        auth_immutable: accountResponse.flags.auth_immutable,
        auth_clawback_enabled: accountResponse.flags.auth_clawback_enabled,
      },
      signers: accountResponse.signers.map((signer: any) => ({
        weight: signer.weight,
        key: signer.key,
        type: signer.type,
      })),
      data: accountResponse.data_attr,
    };
  }

  async getAccountResponse(publicKey: string): Promise<any> {
    if (!this.horizonUrl) {
      throw new Error('Stellar service not initialized');
    }

    return await this.makeRequest(`/accounts/${publicKey}`);
  }

  async loadBalance(accountResponse: any): Promise<WalletBalance> {
    const xlmBalance = accountResponse.balances.find(
      (balance: any) => balance.asset_type === 'native'
    );

    const assetBalances = accountResponse.balances
      .filter((balance: any) => balance.asset_type !== 'native')
      .map((balance: any) => ({
        asset: {
          code: balance.asset_code,
          issuer: balance.asset_issuer,
          isNative: () => false,
          getCode: () => balance.asset_code,
          getIssuer: () => balance.asset_issuer,
        },
        balance: balance.balance,
        buying_liabilities: balance.buying_liabilities,
        selling_liabilities: balance.selling_liabilities,
        authorized: balance.is_authorized || false,
        last_modified_ledger: balance.last_modified_ledger || 0,
      }));

    return {
      xlm: {
        balance: xlmBalance?.balance || '0',
        buying_liabilities: xlmBalance?.buying_liabilities || '0',
        selling_liabilities: xlmBalance?.selling_liabilities || '0',
      },
      assets: assetBalances,
      totalXLMValue: xlmBalance?.balance || '0',
    };
  }

  async loadTransactions(publicKey: string): Promise<WalletTransaction[]> {
    if (!this.horizonUrl) {
      throw new Error('Stellar service not initialized');
    }

    // Get transactions with operations
    const transactionResponse = await this.makeRequest(`/accounts/${publicKey}/transactions?order=desc&limit=50&include_failed=false`);

    const transactions: WalletTransaction[] = [];

    for (const record of transactionResponse._embedded.records) {
      try {
        // Get operations for each transaction
        const operationsResponse = await this.makeRequest(`/transactions/${record.hash}/operations`);
        
        for (const operation of operationsResponse._embedded.records) {
          // Process payment operations
          if (operation.type === 'payment' || operation.type === 'create_account') {
            const isReceive = operation.to === publicKey || operation.account === publicKey;
            const isSend = operation.from === publicKey || operation.source_account === publicKey;
            
            if (isReceive || isSend) {
              const transaction: WalletTransaction = {
                id: `${record.id}-${operation.id}`,
                hash: record.hash,
                type: isReceive ? 'receive' : 'send',
                amount: operation.amount || operation.starting_balance || '0',
                asset: operation.asset_type === 'native' ? 'XLM' : operation.asset_code || 'XLM',
                from: operation.from || operation.source_account || record.source_account,
                to: operation.to || operation.account || publicKey,
                timestamp: new Date(record.created_at),
                fee: record.fee_charged,
                successful: record.successful,
                memo: record.memo,
              };
              
              transactions.push(transaction);
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to load operations for transaction ${record.hash}:`, error);
        // Fallback to basic transaction info
        const transaction: WalletTransaction = {
          id: record.id,
          hash: record.hash,
          type: 'other',
          amount: record.fee_charged,
          asset: 'XLM',
          from: record.source_account,
          to: record.source_account,
          timestamp: new Date(record.created_at),
          fee: record.fee_charged,
          successful: record.successful,
          memo: record.memo,
        };
        transactions.push(transaction);
      }
    }

    return transactions;
  }
}

// Export a singleton instance
export const stellarService = new StellarService();
