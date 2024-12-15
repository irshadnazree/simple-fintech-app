import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => void;
  error: string | null;
}

export default function PinModal({
  visible,
  onClose,
  onVerify,
  error,
}: PinModalProps) {
  const [pin, setPin] = useState('');

  const handleVerify = () => {
    onVerify(pin);
    setPin('');
  };

  const handleClose = () => {
    setPin('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
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
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.modalButtons}>
            <Button title='Cancel' onPress={handleClose} color='lightGray' />
            <Button title='Confirm' onPress={handleVerify} color='blue' />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Satoshi',
    fontWeight: '500',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '50%',
  },
});
