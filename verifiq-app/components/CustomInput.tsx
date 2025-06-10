import { TextInput, StyleSheet } from "react-native";
import { useState } from "react";

interface CustomInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

export function CustomInput({
  placeholder,
  secureTextEntry,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[styles.input, isFocused && styles.inputFocused]}
      placeholder={placeholder}
      placeholderTextColor="#666"
      secureTextEntry={secureTextEntry}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    outlineColor: "transparent",
    outlineWidth: 0,
  },
  inputFocused: {
    borderColor: "#0855b2",
    borderWidth: 2,
  },
});
