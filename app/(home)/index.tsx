import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import PinModal from '@/components/PinModal';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const PIN_KEY = 'user_pin';

export default function Index() {
  const router = useRouter();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isCreatingPin, setIsCreatingPin] = useState(false);

  useEffect(() => {
    checkExistingPin();
  }, []);

  async function checkExistingPin() {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      const needsPin = !storedPin;
      setIsCreatingPin(needsPin);
      if (needsPin) {
        setShowPinModal(true);
      }
    } catch (error) {
      console.error('Error checking PIN:', error);
      setIsCreatingPin(true);
      setShowPinModal(true);
    }
  }

  async function handleGetStarted() {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (!storedPin) {
        setIsCreatingPin(true);
        setShowPinModal(true);
        return;
      }

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
        router.push('/transaction');
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

  async function verifyPin(pin: string) {
    try {
      if (isCreatingPin) {
        await SecureStore.setItemAsync(PIN_KEY, pin);
        setIsCreatingPin(false);
        setShowPinModal(false);
        router.push('/transaction');
      } else {
        const storedPin = await SecureStore.getItemAsync(PIN_KEY);
        if (pin === storedPin) {
          setShowPinModal(false);
          router.push('/transaction');
        } else {
          setPinError('Incorrect PIN. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error handling PIN:', error);
      setPinError('An error occurred. Please try again.');
    }
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Navbar title='Welcome' />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Just a demo</Text>
            <Text style={styles.subtitle}>
              a simple transaction and biometric enabled app
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title='Get Started' onPress={handleGetStarted} />
          </View>
        </View>
        <PinModal
          visible={showPinModal}
          onClose={() => {
            setShowPinModal(false);
            setPinError(null);
          }}
          onVerify={verifyPin}
          error={pinError}
          isCreatingPin={isCreatingPin}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    gap: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },

  title: {
    fontFamily: 'Satoshi',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Satoshi',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#666',
  },
});
