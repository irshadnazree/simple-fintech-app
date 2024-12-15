import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './Button';

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => void;
  error: string | null;
  isCreatingPin?: boolean;
}

export default function PinModal({
  visible,
  onClose,
  onVerify,
  error,
  isCreatingPin = false,
}: PinModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');

  const handleVerify = () => {
    if (isCreatingPin) {
      if (step === 'enter') {
        setStep('confirm');
        return;
      }
      if (pin === confirmPin) {
        onVerify(pin);
        resetState();
      } else {
        setConfirmPin('');
        setStep('enter');
      }
    } else {
      onVerify(pin);
      resetState();
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setPin('');
    setConfirmPin('');
    setStep('enter');
  };

  const getTitle = () => {
    if (isCreatingPin) {
      return step === 'enter' ? 'Create PIN' : 'Confirm PIN';
    }
    return 'Enter PIN';
  };

  const currentPin = isCreatingPin && step === 'confirm' ? confirmPin : pin;
  const setCurrentPin =
    isCreatingPin && step === 'confirm' ? setConfirmPin : setPin;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{getTitle()}</Text>
          <TextInput
            style={styles.pinInput}
            value={currentPin}
            onChangeText={setCurrentPin}
            keyboardType='numeric'
            secureTextEntry
            maxLength={4}
            placeholder='Enter 4-digit PIN'
            placeholderTextColor='#999'
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.modalButtons}>
            <Button title='Cancel' onPress={handleClose} color='lightGray' />
            <Button
              title={isCreatingPin && step === 'enter' ? 'Next' : 'Confirm'}
              onPress={handleVerify}
              color='blue'
              disabled={currentPin.length !== 4}
            />
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
