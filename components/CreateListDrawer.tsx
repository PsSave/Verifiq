import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateListDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (name: string, isIndividual: boolean) => void;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.5;

export function CreateListDrawer({
  isVisible,
  onClose,
  onSubmit,
}: CreateListDrawerProps) {
  const [listName, setListName] = useState("");
  const [isIndividual, setIsIndividual] = useState(true);

  const translateY = useRef(new Animated.Value(DRAWER_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.locationY < 60,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > DRAWER_HEIGHT / 3) {
          closeDrawer();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY]);

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: DRAWER_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onClose();
      setListName("");
    });
  };

  const handleSubmit = () => {
    if (listName.trim()) {
      onSubmit(listName, isIndividual);
      closeDrawer();
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={closeDrawer}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeDrawer}
        />
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.dragHandle}>
            <View style={styles.handle} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Criar uma nova lista</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da lista"
              placeholderTextColor="#666666"
              value={listName}
              onChangeText={setListName}
            />

            <View style={styles.selectContainer}>
              <TouchableOpacity
                style={[
                  styles.selectOption,
                  isIndividual && styles.selectOptionSelected,
                ]}
                onPress={() => setIsIndividual(true)}
              >
                <Text
                  style={[
                    styles.selectText,
                    isIndividual && styles.selectTextSelected,
                  ]}
                >
                  Lista Individual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.selectOption,
                  !isIndividual && styles.selectOptionSelected,
                ]}
                onPress={() => setIsIndividual(false)}
              >
                <Text
                  style={[
                    styles.selectText,
                    !isIndividual && styles.selectTextSelected,
                  ]}
                >
                  Lista Compartilhada
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Criar lista</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: DRAWER_HEIGHT,
  },
  dragHandle: {
    padding: 16,
    paddingBottom: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
    alignSelf: "center",
  },
  content: {
    padding: 16,
    paddingTop: 0,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  selectOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#EBEBEB",
    alignItems: "center",
  },
  selectOptionSelected: {
    backgroundColor: "#007AFF",
  },
  selectText: {
    fontSize: 14,
    color: "#666666",
  },
  selectTextSelected: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    marginBottom: 26,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
