import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/apiService";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [userStats, setUserStats] = useState({
    listsCreated: 0,
    itemsCompleted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchUserProfile();
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserProfile();

      if (response.data) {
        updateUser(response.data.user);
        setUserStats(response.data.stats);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "Funcionalidade em desenvolvimento");
  };

  const handleChangePassword = () => {
    Alert.alert("Alterar Senha", "Digite sua senha atual e a nova senha", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Alterar",
        onPress: () => {
          // TODO: Implementar modal para alterar senha
          Alert.alert("Info", "Funcionalidade será implementada em breve");
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            Alert.prompt(
              "Confirmar Exclusão",
              "Digite sua senha para confirmar:",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Excluir",
                  style: "destructive",
                  onPress: async (password) => {
                    if (!password) {
                      Alert.alert("Erro", "Senha é obrigatória");
                      return;
                    }

                    try {
                      const response = await apiService.deleteAccount(password);
                      if (response.data) {
                        Alert.alert("Sucesso", "Conta excluída com sucesso");
                        await logout();
                        router.replace("/login");
                      } else {
                        Alert.alert(
                          "Erro",
                          response.error || "Erro ao excluir conta"
                        );
                      }
                    } catch (error) {
                      Alert.alert("Erro", "Erro ao excluir conta");
                    }
                  },
                },
              ],
              "secure-text"
            );
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    try {
      Alert.alert("Exportar Dados", "Preparando exportação...");
      const response = await apiService.exportData();

      if (response.data) {
        Alert.alert(
          "Dados Exportados",
          "Seus dados foram coletados com sucesso. Em uma implementação completa, eles seriam baixados como arquivo JSON.",
          [
            {
              text: "Ver Dados",
              onPress: () => {
                console.log("Dados exportados:", response.data);
                Alert.alert("Debug", "Dados foram impressos no console");
              },
            },
            { text: "OK" },
          ]
        );
      } else {
        Alert.alert("Erro", response.error || "Erro ao exportar dados");
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao exportar dados");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Perfil</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Feather name="user" size={48} color="#007AFF" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.joinDate}>
            Membro desde{" "}
            {new Date(user.createdAt || Date.now()).toLocaleDateString(
              "pt-BR",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.listsCreated}</Text>
            <Text style={styles.statLabel}>Listas Criadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.itemsCompleted}</Text>
            <Text style={styles.statLabel}>Itens Concluídos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações da Conta</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemContent}>
              <Feather name="edit" size={20} color="#333" />
              <Text style={styles.menuText}>Editar Perfil</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
          >
            <View style={styles.menuItemContent}>
              <Feather name="lock" size={20} color="#333" />
              <Text style={styles.menuText}>Alterar Senha</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="bell" size={20} color="#333" />
              <Text style={styles.menuText}>Notificações</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="shield" size={20} color="#333" />
              <Text style={styles.menuText}>Privacidade</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleExportData}>
            <View style={styles.menuItemContent}>
              <Feather name="download" size={20} color="#333" />
              <Text style={styles.menuText}>Exportar Dados</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Feather name="upload" size={20} color="#333" />
              <Text style={styles.menuText}>Importar Dados</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zona de Perigo</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
          >
            <Feather name="trash-2" size={20} color="#FF3B30" />
            <Text style={styles.dangerButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
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
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    backgroundColor: "#F0F8FF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: "#999",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  dangerZone: {
    marginTop: 20,
    marginBottom: 32,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "#FFE5E5",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B30",
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
});
