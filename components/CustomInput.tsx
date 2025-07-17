import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function CustomInput({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  ...otherProps
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[styles.input, isFocused && styles.inputFocused]}
      placeholder={placeholder}
      placeholderTextColor="#666"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...otherProps}
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
