import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CreateListDrawer } from "../components/CreateListDrawer";
import { HeaderButtons } from "../components/HeaderButtons";
import { ListItem } from "../components/ListItem";
import { useAuth } from "../contexts/AuthContext";
import { useLists } from "../utils/hooks";

export default function Index() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { lists, isLoading, error, refetch, createList } = useLists();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, authLoading]);

  const handlePressAdd = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  const handleCreateList = useCallback(
    async (name: string, isIndividual: boolean) => {
      const result = await createList({
        name,
        description: "",
        isIndividual,
      });

      if (result.success) {
        Alert.alert("Sucesso", "Lista criada com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao criar lista");
      }
    },
    [createList]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (authLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Evita flash antes do redirect
  }

  return (
    <View style={styles.container}>
      <HeaderButtons onPressAdd={handlePressAdd} />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Minhas Listas</Text>

        {user && <Text style={styles.welcomeText}>Olá, {user.name}!</Text>}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading && lists.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando listas...</Text>
          </View>
        ) : lists.length > 0 ? (
          lists.map((list) => (
            <ListItem
              key={list.id}
              id={list.id.toString()}
              name={list.name}
              individual={list.is_individual}
              stats={list.stats}
              userPermission={list.user_permission}
              creatorName={list.creator_name}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma lista encontrada</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para criar sua primeira lista
            </Text>
          </View>
        )}
      </ScrollView>

      <CreateListDrawer
        isVisible={isDrawerVisible}
        onClose={handleCloseDrawer}
        onSubmit={handleCreateList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
