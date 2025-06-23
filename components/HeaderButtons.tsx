import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface HeaderButtonsProps {
  onPressAdd: () => void;
}

export function HeaderButtons({ onPressAdd }: HeaderButtonsProps) {
  const router = useRouter();

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={handleSettingsPress}
      >
        <Feather name="settings" size={24} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={onPressAdd}>
        <Feather name="plus" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
});
