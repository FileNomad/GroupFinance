import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function CreateProfileScreen() {
  const { session } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateProfile() {
    if (!session || !displayName.trim()) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .insert({
        id: session.user.id,
        display_name: displayName.trim(),
      });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Profile creation failed",
        error.message
      );
      return;
    }

    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Choose your name
        </Text>

        <Text style={styles.subtitle}>
          This is how other members will see you.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. John Doe"
          placeholderTextColor="#9CA3AF"
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={40}
        />

        <Pressable
          style={[
            styles.button,
            (!displayName.trim() || loading) &&
              styles.buttonDisabled,
          ]}
          onPress={handleCreateProfile}
          disabled={
            !displayName.trim() || loading
          }
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Creating..."
              : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 90,
  },

  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
  },

  button: {
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});