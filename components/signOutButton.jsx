import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4', // Button background color
    paddingVertical: 10, // Vertical padding
    paddingBottom: 13,
    paddingHorizontal: 50, // Horizontal padding
    borderRadius: 2, // Border radius
    marginTop: 10
  },
  
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 16, // Text font size
    textAlign: 'center', // Text alignment
  }
});

export default CustomButton;