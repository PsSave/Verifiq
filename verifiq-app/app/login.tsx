import { Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import Icon from "../assets/Icon.svg";
import { LoginForm } from "../components/LoginForm";

export default function LoginScreen() {
  const handleLogin = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Icon width={120} height={120} style={styles.logo} />
      <View style={styles.contentContainer}>
        <Text style={styles.loginText}>Login</Text>
        <LoginForm onLogin={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C6BE7",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  contentContainer: {
    width: "100%",
  },
  loginText: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 20,
  },
  logo: {
    marginBottom: 20,
  },
});
