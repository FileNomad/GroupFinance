import { router } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function EmailConfirmedScreen() {
  function handleContinue() {
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>
            ✓
          </Text>
        </View>

        <Text style={styles.title}>
          Email confirmed
        </Text>

        <Text style={styles.description}>
          Your GroupFinance account has been
          successfully confirmed.
        </Text>

        <Text style={styles.secondaryText}>
          You can now sign in and start using
          GroupFinance.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            Continue to Sign In
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  checkmark: {
    fontSize: 36,
    fontWeight: "700",
    color: "#059669",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 23,
    textAlign: "center",
    marginTop: 14,
  },

  secondaryText: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
  },

  button: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 28,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});