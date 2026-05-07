import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MAX_MESSAGE_LENGTH = 100;

export default function NewBookmarkScreen() {
  const [message, setMessage] = useState("");
  const trimmed = message.trim();
  const isValid = trimmed.length > 0;

  const handleSave = () => {
    const today = new Date().toISOString().slice(0, 10);
    console.log("[bookmark]", { date: today, message: trimmed });
    setMessage("");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="ひとことを残す"
            placeholderTextColor="#B6C0D6"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
            maxLength={MAX_MESSAGE_LENGTH}
          />
        </View>
        <Text style={styles.counter}>
          {message.length} / {MAX_MESSAGE_LENGTH}
        </Text>
        <Text style={styles.note}>
          ※ 試作中。再起動するとデータは消えます
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          disabled={!isValid}
          onPress={handleSave}
        >
          <Text
            style={[
              styles.buttonText,
              !isValid && styles.buttonTextDisabled,
            ]}
          >
            保存する
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.linkButton}>
          <Text style={styles.linkText}>戻る</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingTop: 64,
    paddingBottom: 48,
  },
  content: {
    flex: 1,
  },
  inputCard: {
    width: "100%",
    backgroundColor: "#F7F9FC",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: 160,
    shadowColor: "#7E8AAB",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: "#1F2A44",
    lineHeight: 22,
    minHeight: 120,
  },
  counter: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    color: "#7B8CAE",
  },
  note: {
    marginTop: 16,
    fontSize: 12,
    color: "#7B8CAE",
    textAlign: "center",
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
