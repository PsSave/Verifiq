import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  onPress: () => void;
  text: string;
  variant?: "primary" | "link";
}

export function Button({ onPress, text, variant = "primary" }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "link" && styles.linkButton]}
      onPress={onPress}
    >
      <Text style={[styles.text, variant === "link" && styles.linkText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    backgroundColor: "transparent",
    alignSelf: "flex-end",
    width: "auto",
    padding: 0,
    marginRight: "5%",
    marginBottom: 20,
  },
  linkText: {
    color: "#fff",
    fontSize: 18,
  },
});
