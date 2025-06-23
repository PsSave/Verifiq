import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListItemProps {
  name: string;
  individual: boolean;
  onPress?: () => void;
}

export function ListItem({ name, individual, onPress }: ListItemProps) {
  return (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
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
