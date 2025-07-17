import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useListDetails } from "../../utils/hooks";

interface ListItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  completed: boolean;
}

export default function ListDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();

  const {
    list,
    items,
    isLoading,
    error,
    refetch,
    createItem,
    updateItem,
    toggleItemCompleted,
    deleteItem,
  } = useListDetails(id as string);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  const handleToggleItem = async (itemId: number) => {
    const result = await toggleItemCompleted(itemId.toString());
    if (!result.success) {
      Alert.alert("Erro", result.error || "Erro ao alterar status do item");
    }
  };

  const handleAddNewItem = async () => {
    if (newItemName.trim()) {
      const result = await createItem({
        name: newItemName.trim(),
        description: newItemDescription.trim() || undefined,
      });

      if (result.success) {
        setNewItemName("");
        setNewItemDescription("");
        setIsAddModalVisible(false);
        Alert.alert("Sucesso", "Item adicionado com sucesso!");
      } else {
        Alert.alert("Erro", result.error || "Erro ao adicionar item");
      }
    }
  };

  const openItemDetail = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalVisible(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading && !list) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando lista...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!list) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Lista não encontrada</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.subtitle}>
            {completedCount} de {totalCount} concluídos
          </Text>
        </View>
      </View>

      {/* Lista de itens */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="list" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Lista vazia</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar itens
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => openItemDetail(item)}
            >
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleToggleItem(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxCompleted,
                  ]}
                >
                  {item.completed && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.itemContent}>
                <Text
                  style={[
                    styles.itemName,
                    item.completed && styles.itemNameCompleted,
                  ]}
                >
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    style={[
                      styles.itemDescription,
                      item.completed && styles.itemDescriptionCompleted,
                    ]}
                  >
                    {item.description}
                  </Text>
                )}
              </View>

              <Feather name="chevron-right" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botão flutuante para adicionar item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal para adicionar item */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Item</Text>
              <TouchableOpacity
                onPress={() => setIsAddModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome do item"
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (opcional)"
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNewItem}
            >
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de detalhes do item */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Item</Text>
              <TouchableOpacity
                onPress={() => setIsDetailModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView style={styles.detailContent}>
                <Text style={styles.detailName}>{selectedItem.name}</Text>

                {selectedItem.description && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Descrição:</Text>
                    <Text style={styles.detailText}>
                      {selectedItem.description}
                    </Text>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusIndicator,
                        selectedItem.completed && styles.statusCompleted,
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {selectedItem.completed ? "Concluído" : "Pendente"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedItem.completed && styles.toggleButtonCompleted,
                  ]}
                  onPress={() => {
                    handleToggleItem(selectedItem.id);
                    setIsDetailModalVisible(false);
                  }}
                >
                  <Feather
                    name={selectedItem.completed ? "x" : "check"}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.toggleButtonText}>
                    {selectedItem.completed
                      ? "Marcar como Pendente"
                      : "Marcar como Concluído"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#007AFF",
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemNameCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  itemDescriptionCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    margin: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#007AFF",
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  detailContent: {
    padding: 20,
  },
  detailName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFA500",
    marginRight: 8,
  },
  statusCompleted: {
    backgroundColor: "#34C759",
  },
  statusText: {
    fontSize: 16,
    color: "#666",
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  toggleButtonCompleted: {
    backgroundColor: "#FF3B30",
  },
  toggleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#333",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});
