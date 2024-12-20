import { api, ApiError } from '@/api/api';
import ErrorPlaceholder from '@/components/ErrorPlaceholder';
import Navbar from '@/components/Navbar';
import { Transaction } from '@/utils/transactionUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactionDetail();
  }, [id]);

  const fetchTransactionDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getTransactionDetail(id as string);
      setTransaction(response.data.transaction);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load transaction details';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <ErrorPlaceholder message={error} onRetry={fetchTransactionDetail} />
      );
    }

    if (!transaction) {
      return <ErrorPlaceholder message='Transaction not found' />;
    }

    return (
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.merchantContainer}>
              <View style={styles.merchantIcon}>
                <Ionicons
                  name={getIconForCategory(transaction.category)}
                  size={24}
                  color='#007AFF'
                />
              </View>
              <View>
                <Text style={styles.merchantName}>{transaction.merchant}</Text>
                <Text style={styles.category}>{transaction.category}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.amount,
                transaction.type === 'debit'
                  ? styles.debitAmount
                  : styles.creditAmount,
              ]}
            >
              {transaction.type === 'debit' ? '-' : '+'}$
              {transaction.amount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
            <DetailRow
              label='Date'
              value={transaction.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
            <DetailRow
              label='Time'
              value={transaction.date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            />
            <DetailRow
              label='Type'
              value={
                transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)
              }
            />
            <DetailRow
              label='Status'
              value='Completed'
              valueStyle={styles.statusCompleted}
            />
            <DetailRow
              label='Transaction ID'
              value={transaction.id}
              valueStyle={styles.transactionId}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar
        title='Transaction Details'
        showBack
        onBackPress={() => router.back()}
      />
      {renderContent()}
    </View>
  );
}

function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function getIconForCategory(category?: string): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'Shopping':
      return 'cart-outline';
    case 'Groceries':
      return 'basket-outline';
    case 'Entertainment':
      return 'film-outline';
    case 'Transportation':
      return 'car-outline';
    case 'Food & Dining':
      return 'restaurant-outline';
    case 'Bills & Utilities':
      return 'receipt-outline';
    case 'Gas & Fuel':
      return 'speedometer-outline';
    case 'Travel':
      return 'airplane-outline';
    default:
      return 'card-outline';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  merchantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantName: {
    fontFamily: 'Satoshi',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontFamily: 'Satoshi',
    fontSize: 20,
    fontWeight: '600',
  },
  debitAmount: {
    color: '#FF3B30',
  },
  creditAmount: {
    color: '#34C759',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontFamily: 'Satoshi',
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  statusCompleted: {
    fontFamily: 'Satoshi',
    color: '#34C759',
  },
  transactionId: {
    fontFamily: 'Satoshi',
    fontSize: 12,
    color: '#999',
  },
});
