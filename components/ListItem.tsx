import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemProps {
  id?: string;
  name: string;
  individual: boolean;
  onPress?: () => void;
}

export function ListItem({ id, name, individual, onPress }: ListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navegar para a tela de detalhes da lista
      router.push(`/list/${id || "1"}`);
    }
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handlePress}>
      <View>
        <Text style={styles.listName}>{name}</Text>
        <Text style={styles.listStatus}>
          {individual ? "Individual" : "Compartilhada"}
        </Text>
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  listName: {
    fontSize: 16,
    marginBottom: 4,
  },
  listStatus: {
    fontSize: 14,
    color: "#666",
  },
});
