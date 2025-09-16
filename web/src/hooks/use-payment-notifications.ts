import { useEffect, useRef, useState } from 'react';
import { useWalletStore } from '@/store/wallet-store';
import { useToast } from '@/hooks/use-toast';

interface PaymentNotification {
  id: string;
  amount: string;
  asset: string;
  from: string;
  timestamp: Date;
  hash: string;
}

export function usePaymentNotifications() {
  const { publicKey, transactions } = useWalletStore();
  const { toast } = useToast();
  const [lastTransactionCount, setLastTransactionCount] = useState(0);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const previousTransactionsRef = useRef<string[]>([]);

  // Monitor for new incoming transactions
  useEffect(() => {
    if (!publicKey || !transactions.length) {
      setLastTransactionCount(0);
      return;
    }

    console.log('🔔 Payment notifications - checking transactions:', {
      publicKey,
      transactionsCount: transactions.length,
      lastTransactionCount,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        from: t.from,
        to: t.to,
        amount: t.amount,
        hash: t.hash
      }))
    });

    // Check if we have new transactions
    if (transactions.length > lastTransactionCount) {
      const newTransactions = transactions.slice(0, transactions.length - lastTransactionCount);
      
      console.log('🔔 New transactions detected:', newTransactions.length);
      
      newTransactions.forEach(transaction => {
        console.log('🔔 Processing transaction:', {
          id: transaction.id,
          type: transaction.type,
          from: transaction.from,
          to: transaction.to,
          amount: transaction.amount,
          publicKey,
          isReceive: transaction.to === publicKey,
          isNotFromUs: transaction.from !== publicKey,
          hasAmount: transaction.amount && parseFloat(transaction.amount) > 0
        });

        // Check if this is an incoming payment (not sent by us)
        // Look for transactions where we are the recipient but not the sender
        if (transaction.to === publicKey && 
            transaction.from !== publicKey &&
            transaction.amount && 
            parseFloat(transaction.amount) > 0) {
          
          console.log('🔔 Incoming payment detected!', transaction);
          
          // Check if we've already notified about this transaction
          if (!previousTransactionsRef.current.includes(transaction.hash)) {
            const notification: PaymentNotification = {
              id: transaction.hash,
              amount: transaction.amount,
              asset: transaction.asset || 'XLM',
              from: transaction.from,
              timestamp: new Date(transaction.timestamp || Date.now()),
              hash: transaction.hash
            };

            console.log('🔔 Creating notification:', notification);

            setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10

            // Show toast notification
            toast({
              title: "💰 Dinero recibido!",
              description: `Recibiste ${transaction.amount} ${transaction.asset || 'XLM'} de ${transaction.from.substring(0, 8)}...`,
            });

            // Add to previous transactions to avoid duplicate notifications
            previousTransactionsRef.current.push(transaction.hash);
          } else {
            console.log('🔔 Already notified about this transaction:', transaction.hash);
          }
        }
      });

      setLastTransactionCount(transactions.length);
    }
  }, [transactions, publicKey, lastTransactionCount, toast]);

  // Clean up old notifications (older than 1 hour)
  useEffect(() => {
    const interval = setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      setNotifications(prev => 
        prev.filter(notification => notification.timestamp > oneHourAgo)
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return {
    notifications,
    clearNotifications,
    markAsRead,
    hasNewNotifications: notifications.length > 0,
  };
}
