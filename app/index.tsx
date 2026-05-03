import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const [age, setAge] = useState("");
  const isValid = age.trim().length > 0 && Number(age) > 0;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ようこそ</Text>
        <Text style={styles.subtitle}>いま、おいくつですか?</Text>

        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="30"
            placeholderTextColor="#B6C0D6"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
            maxLength={3}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={() => {
            // 次の画面（残り食事数）への遷移は今後実装予定
          }}
        >
          <Text
            style={[
              styles.buttonText,
              !isValid && styles.buttonTextDisabled,
            ]}
          >
            はじめる
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/hello-world')} style={styles.linkButton}>
          <Text style={styles.linkText}>Hello World 画面を見る</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingTop: 96,
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1F2A44",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#5B6478",
    marginBottom: 96,
  },
  inputCard: {
    width: "85%",
    backgroundColor: "#F7F9FC",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    shadowColor: "#7E8AAB",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  input: {
    fontSize: 36,
    color: "#5C6884",
    textAlign: "center",
    minWidth: 80,
    paddingVertical: 4,
  },
  footer: {
    alignItems: "center",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 999,
    width: "85%",
    alignItems: "center",
    backgroundColor: "#4F7DF7",
  },
  buttonDisabled: {
    backgroundColor: "#E3E9F7",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  buttonTextDisabled: {
    color: "#A6B2CC",
  },
  linkButton: {
    marginTop: 16,
  },
  linkText: {
    color: "#7B8CAE",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
