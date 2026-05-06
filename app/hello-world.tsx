import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HelloWorldScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World! 👋</Text>
      <Pressable onPress={() => router.push('/album')} style={styles.button}>
        <Text style={styles.buttonText}>しおりを見る</Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        style={[styles.button, styles.buttonSpaced]}
      >
        <Text style={styles.buttonText}>最初の画面へ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#4F7DF7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  buttonSpaced: {
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
