import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Navbar({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name='arrow-back' size={24} color='black' />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    height: 60,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'ClashDisplay',
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
