import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ErrorPlaceholder from './components/ErrorPlaceholder';
import Navbar from './components/Navbar';
import { api, ApiError } from './services/api';
import {
  groupTransactionsByDate,
  maskAmount,
  maskMerchant,
  revealAmount,
  revealMerchant,
  Transaction,
} from './utils/transactionUtils';

interface AccountBalance {
  available: number;
  pending: number;
  currency: string;
}

const TransactionsListLoader = () => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonTransactions}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonTransaction}>
          <Animated.View
            style={[styles.skeletonTransactionItem, { opacity }]}
          />
          <Animated.View
            style={[styles.skeletonTransactionCategory, { opacity }]}
          />
        </View>
      ))}
    </View>
  );
};

const BalanceTextLoader = () => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return <Animated.View style={[styles.skeletonBalanceText, { opacity }]} />;
};

export default function TransactionsScreen() {
  const router = useRouter();
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<AccountBalance>({
    available: 0,
    pending: 0,
    currency: 'USD',
  });

  // Group transactions by date
  const groupedTransactions = groupTransactionsByDate(transactions);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch transactions and balance in parallel
      const [transactionsResponse, balanceResponse] = await Promise.all([
        api.getTransactions(),
        api.getBalance(),
      ]);

      setTransactions(transactionsResponse.data.transactions);
      setBalance(balanceResponse.data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  const verifyPin = (enteredPin: string) => {
    // In a real app, you would verify against a stored PIN
    // For demo purposes, we're using a hardcoded PIN: 1234
    const correctPin = '1234';
    if (enteredPin === correctPin) {
      setIsBalanceHidden(!isBalanceHidden);
      setShowPinModal(false);
      setPin('');
    } else {
      Alert.alert('Error', 'Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  async function toggleBalanceVisibility() {
    // If we're going to hide the balance, do it immediately without authentication
    if (!isBalanceHidden) {
      setIsBalanceHidden(true);
      return;
    }

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Show PIN modal if biometric is not available
        setShowPinModal(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to show balance',
        fallbackLabel: 'Use PIN instead',
      });

      if (result.success) {
        setIsBalanceHidden(false);
      } else if (result.error === 'user_cancel') {
        // Show PIN modal when user cancels biometric
        setShowPinModal(true);
      } else {
        Alert.alert('Authentication Failed', 'Please try again');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'Failed to authenticate. Please try again later.');
    }
  }

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const response = await api.refreshTransactions();
      setTransactions(response.data.transactions);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to refresh transactions';
      setError(message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TouchableOpacity
                onPress={toggleBalanceVisibility}
                style={[styles.eyeButton, styles.eyeButtonDisabled]}
                disabled={true}
              >
                <Ionicons
                  name={isBalanceHidden ? 'eye-off' : 'eye'}
                  size={18}
                  color='#ccc'
                />
              </TouchableOpacity>
            </View>
            <BalanceTextLoader />
            <View style={styles.balanceSection}>
              <Text style={styles.balanceLabel}>Pending</Text>
              <BalanceTextLoader />
            </View>
          </View>
          <TransactionsListLoader />
        </>
      );
    }

    if (error) {
      return <ErrorPlaceholder message={error} onRetry={fetchData} />;
    }

    return (
      <>
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
      </>
    );
  };

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
          !error ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor='#999'
            />
          ) : undefined
        }
      >
        {renderContent()}
      </ScrollView>

      <Modal
        visible={showPinModal}
        transparent
        animationType='slide'
        onRequestClose={() => {
          setShowPinModal(false);
          setPin('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter PIN</Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              keyboardType='numeric'
              secureTextEntry
              maxLength={4}
              placeholder='Enter 4-digit PIN'
              placeholderTextColor='#999'
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPinModal(false);
                  setPin('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => verifyPin(pin)}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi',
    fontWeight: '600',
    marginBottom: 16,
  },
  pinInput: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Satoshi',
    fontWeight: '600',
    color: '#666',
  },
  confirmButtonText: {
    color: 'white',
  },
  // Skeleton styles
  skeletonTransactions: {
    gap: 16,
  },
  skeletonTransaction: {
    gap: 8,
  },
  skeletonTransactionItem: {
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '80%',
  },
  skeletonTransactionCategory: {
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '40%',
  },
  eyeButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  skeletonBalanceText: {
    height: 32,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    width: '50%',
    marginVertical: 4,
  },
});
