import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CreateListDrawer } from "../components/CreateListDrawer";
import { HeaderButtons } from "../components/HeaderButtons";
import { ListItem } from "../components/ListItem";

export default function Index() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const handlePressAdd = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  const handleCreateList = useCallback(
    (name: string, isIndividual: boolean) => {
      // TODO: Implement list creation logic
      console.log("Create list:", { name, isIndividual });
    },
    []
  );

  const mockLists = [
    { name: "Lista de Compras", individual: false },
    { name: "Tarefas Diárias", individual: true },
  ];

  return (
    <View style={styles.container}>
      <HeaderButtons onPressAdd={handlePressAdd} />

      <View style={styles.content}>
        <Text style={styles.title}>Lista</Text>

        {mockLists.map((list, index) => (
          <ListItem key={index} name={list.name} individual={list.individual} />
        ))}
      </View>

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
    marginBottom: 24,
  },
});
