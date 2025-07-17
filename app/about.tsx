import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function About() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Sobre</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Feather name="check-square" size={48} color="#007AFF" />
          </View>
          <Text style={styles.appName}>Verifiq</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>
            O Verifiq é um aplicativo de listas de verificação que ajuda você a
            organizar suas tarefas e acompanhar o progresso de suas atividades
            diárias. Com uma interface simples e intuitiva, você pode criar
            listas personalizadas e marcar itens conforme os completa.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos</Text>
          <View style={styles.featureList}>
            <View style={styles.feature}>
              <Feather name="plus" size={16} color="#007AFF" />
              <Text style={styles.featureText}>
                Criar listas personalizadas
              </Text>
            </View>
            <View style={styles.feature}>
              <Feather name="check" size={16} color="#007AFF" />
              <Text style={styles.featureText}>
                Marcar itens como concluídos
              </Text>
            </View>
            <View style={styles.feature}>
              <Feather name="edit" size={16} color="#007AFF" />
              <Text style={styles.featureText}>Editar listas e itens</Text>
            </View>
            <View style={styles.feature}>
              <Feather name="users" size={16} color="#007AFF" />
              <Text style={styles.featureText}>
                Listas individuais e compartilhadas
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvedor</Text>
          <Text style={styles.developer}>Desenvolvido com ❤️ no IFMS</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <TouchableOpacity style={styles.contactItem}>
            <Feather name="mail" size={16} color="#007AFF" />
            <Text style={styles.contactText}>suporte@verifiq.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem}>
            <Feather name="globe" size={16} color="#007AFF" />
            <Text style={styles.contactText}>www.verifiq.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Verifiq. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#F0F8FF",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  featureList: {
    gap: 12,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#666",
  },
  developer: {
    fontSize: 16,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#007AFF",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
});
