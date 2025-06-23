import { View, StyleSheet } from "react-native";
import { CustomInput } from "./CustomInput";
import { Button } from "./Button";

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  return (
    <View style={styles.inputContainer}>
      <CustomInput placeholder="Email" />
      <CustomInput placeholder="Senha" secureTextEntry />
      <Button text="Esqueci minha senha" variant="link" onPress={() => {}} />
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
