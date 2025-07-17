import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import { CustomInput } from "./CustomInput";

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  return (
    <View style={styles.inputContainer}>
      <CustomInput placeholder="Email" />
      <CustomInput placeholder="Senha" secureTextEntry />
      <Button text="Entrar" onPress={onLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
});
