import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Navbar title='Welcome' />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.text, styles.title]}>Just a demo</Text>
            <Text style={[styles.text, styles.subtitle]}>
              a simple transaction and biometric enabled app
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title='Get Started'
              onPress={() => {
                router.push('/transaction');
              }}
            />
          </View>
        </View>
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
  text: {
    fontFamily: 'Satoshi',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#666',
  },
});
