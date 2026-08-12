import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      Alert.alert("Sign in failed", error.message);
    }
  }

async function handleSignUp() {
  if (!email.trim() || !password) {
    return;
  }

  setLoading(true);

  const { data, error } =
    await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

  setLoading(false);

  console.log("SIGN UP DATA:", data);
  console.log("SIGN UP ERROR:", error);

  if (error) {
    console.error("Sign up failed:", error.message);

    if (typeof window !== "undefined") {
      window.alert(`Sign up failed: ${error.message}`);
    }

    return;
  }

  if (typeof window !== "undefined") {
    window.alert(
      "Account created. Check your email for the confirmation link."
    );
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Group Finance
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[
            styles.primaryButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Please wait..." : "Sign In"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            Create Account
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
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
    marginBottom: 18,
  },

  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },

  secondaryButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "600",
  },
});