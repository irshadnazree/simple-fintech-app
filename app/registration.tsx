import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Button from './components/Button';
import Navbar from './components/Navbar';

export default function Registration() {
  const handleAddBiometric = async () => {
    // TODO: Implement biometric authentication
    console.log('Add biometric pressed');
  };

  const handleUsePin = () => {
    // TODO: Navigate to PIN setup
    console.log('Use PIN pressed');
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Navbar title='Registration' showBack={true} />
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.text, styles.title]}>Add your biometric</Text>
            <Text style={[styles.text, styles.subtitle]}>
              You can use your biometric data to quickly and securely view your
              sensitive data.
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button title='Add biometric' onPress={handleAddBiometric} />
            <Button title='Use PIN' onPress={handleUsePin} color='lightGray' />
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
    paddingHorizontal: 20,
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
