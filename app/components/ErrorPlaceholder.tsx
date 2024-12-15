import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Button from './Button';

interface ErrorPlaceholderProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorPlaceholder({
  message = 'Something went wrong',
  onRetry,
}: ErrorPlaceholderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name='alert-circle-outline' size={48} color='#FF3B30' />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Button onPress={onRetry} title='Try Again' />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Satoshi',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'Satoshi',
    fontWeight: '600',
  },
});
