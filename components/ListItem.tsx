import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemProps {
  id?: string;
  name: string;
  individual: boolean;
  stats?: {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  };
  userPermission?: string;
  creatorName?: string;
  onPress?: () => void;
}

export function ListItem({
  id,
  name,
  individual,
  stats,
  userPermission,
  creatorName,
  onPress,
}: ListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navegar para a tela de detalhes da lista
      router.push(`/list/${id || "1"}`);
    }
  };

  const getPermissionText = () => {
    if (userPermission === "owner") return "Criador";
    if (userPermission === "admin") return "Administrador";
    if (userPermission === "write") return "Editor";
    if (userPermission === "read") return "Visualizador";
    return individual ? "Individual" : "Compartilhada";
  };

  const getStatusText = () => {
    if (stats) {
      if (stats.total === 0) return "Lista vazia";
      return `${stats.completed}/${stats.total} concluídos`;
    }
    return individual ? "Individual" : "Compartilhada";
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.listName}>{name}</Text>
          {stats && stats.total > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${stats.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{stats.percentage}%</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.listStatus}>{getStatusText()}</Text>
          {!individual && creatorName && userPermission !== "owner" && (
            <Text style={styles.creatorText}>Por {creatorName}</Text>
          )}
          <Text style={styles.permissionText}>{getPermissionText()}</Text>
        </View>
      </View>

      <Feather name="chevron-right" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    minWidth: 30,
    textAlign: "right",
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listStatus: {
    fontSize: 14,
    color: "#666",
  },
  creatorText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  permissionText: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#F0F8FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: "auto",
  },
});
