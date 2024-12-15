import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  color?: 'blue' | 'gray' | 'lightGray';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  onPress,
  title,
  color = 'blue',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[`${color}Button`], style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={
            color === 'blue'
              ? '#F7FAFC'
              : color === 'gray'
              ? '#1B1D25'
              : '#F7FAFC'
          }
        />
      ) : (
        <Text style={[styles.buttonText, styles[`${color}Button`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  buttonText: {
    color: '#F7FAFC',
    fontFamily: 'Satoshi',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  blueButton: {
    backgroundColor: '#1A5EE6',
  },
  grayButton: {
    backgroundColor: '#7E7E7E',
  },
  lightGrayButton: {
    color: '#1B1D25',
    backgroundColor: '#E7EBF3',
  },
});
