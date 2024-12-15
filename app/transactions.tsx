import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Navbar from './components/Navbar';

interface AccountBalance {
  available: number;
  pending: number;
}

export default function TransactionsScreen() {
  const router = useRouter();
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const balance: AccountBalance = {
    available: 2459.32,
    pending: 150.0,
  };

  const transactions = useMemo(
    () => generateMockTransactions(20),
    [refreshKey]
  );
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Navbar
        title='Transactions'
        showBack
        onBackPress={() => router.push('/')}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor='#999'
          />
        }
      >
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <TouchableOpacity
              onPress={toggleBalanceVisibility}
              style={styles.eyeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isBalanceHidden ? 'eye-off' : 'eye'}
                size={18}
                color='#999'
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {isBalanceHidden ? '****' : `$${balance.available.toFixed(2)}`}
          </Text>
          {balance.pending > 0 && (
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Pending</Text>
              <Text style={[styles.balanceAmount, styles.pendingAmount]}>
                {isBalanceHidden ? '****' : `-$${balance.pending.toFixed(2)}`}
              </Text>
            </View>
          )}
        </View>

        {Object.entries(groupedTransactions).map(([date, transactions]) => (
          <View key={date}>
            <Text style={styles.dateHeader}>{date}</Text>
            {transactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionText}>
                    You spent{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {isBalanceHidden
                        ? maskAmount(transaction.amount)
                        : revealAmount(transaction.amount)}
                    </Text>{' '}
                    at{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {isBalanceHidden
                        ? maskMerchant(transaction.merchant || '')
                        : revealMerchant(transaction.merchant || '')}
                    </Text>
                  </Text>
                  <Text style={styles.methodText}>{transaction.category}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  dateHeader: {
    fontSize: 14,
    fontFamily: 'Satoshi',
    fontWeight: '500',
    color: '#666',
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    marginHorizontal: -16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionText: {
    fontSize: 16,
    fontFamily: 'Satoshi',
    fontWeight: '400',
    marginBottom: 4,
  },
  methodText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Satoshi',
    fontWeight: '400',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceSection: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Satoshi',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: 'ClashDisplay',
    fontWeight: '600',
    color: '#000',
  },
  pendingAmount: {
    fontSize: 18,
    color: '#666',
  },
  eyeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
});

interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'debit' | 'credit';
  category?: string;
  merchant?: string;
}

// function to group transactions by date
function groupTransactionsByDate(transactions: Transaction[]): {
  [date: string]: Transaction[];
} {
  return transactions.reduce((groups, transaction) => {
    const date = transaction.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as { [date: string]: Transaction[] });
}

// Generate mock transaction data
function generateMockTransactions(count: number = 20): Transaction[] {
  const transactions: Transaction[] = [];
  const merchants = ['Amazon', 'Uber', 'Starbucks', 'Spotify', 'Netflix'];
  const categories = [
    'Groceries',
    'Entertainment',
    'Transportation',
    'Subscriptions',
  ];

  // Distribute transactions across these dates
  for (let i = 0; i < count; i++) {
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 13) * 24 * 60 * 60 * 1000
    );

    transactions.push({
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(Math.random() * 500),
      date: randomDate,
      description: `Payment to ${
        merchants[Math.floor(Math.random() * merchants.length)]
      }`,
      type: Math.random() > 0.5 ? 'debit' : 'credit',
      category: categories[Math.floor(Math.random() * categories.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
    });
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
}

// Mask sensitive transaction details
function maskAmount(amount: number): string {
  return `${'*'.repeat(amount.toString().length)}`;
}

function maskMerchant(merchant: string): string {
  return `${merchant.slice(0, 3)}***`;
}

// Reveal amount after biometric authentication
function revealAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function revealMerchant(merchant: string): string {
  return merchant;
}
