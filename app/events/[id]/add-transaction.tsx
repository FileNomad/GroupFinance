import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEvents } from "../../../context/EventContext";

export default function AddTransactionScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const {
    events,
    currentUser,
    createTransaction,
  } = useEvents();

  const event = events.find(
    (item) => item.id === id
  );

  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] =
    useState("");

  function handleSubmit() {
    if (!event) {
      return;
    }

    const numericAmount = Number(amount);

    if (
      !creditor ||
      creditor === currentUser ||
      numericAmount <= 0 ||
      !description.trim()
    ) {
      return;
    }

    createTransaction(
      event.id,
      creditor,
      Math.round(numericAmount * 100),
      description.trim()
    );

    router.back();
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  const availableCreditors =
    event.members.filter(
      (member) => member !== currentUser
    );

  const canSubmit =
    creditor !== "" &&
    Number(amount) > 0 &&
    description.trim() !== "";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Add Transaction
        </Text>

        <Text style={styles.intro}>
          {currentUser} owes...
        </Text>

        <Text style={styles.label}>
          Who do you owe?
        </Text>

        {availableCreditors.map(
          (member, index) => (
            <Pressable
              key={`${member}-${index}`}
              style={[
                styles.memberOption,
                creditor === member &&
                  styles.memberOptionSelected,
              ]}
              onPress={() =>
                setCreditor(member)
              }
            >
              <Text
                style={[
                  styles.memberOptionText,
                  creditor === member &&
                    styles.memberOptionTextSelected,
                ]}
              >
                {member}
              </Text>
            </Pressable>
          )
        )}

        <Text style={styles.label}>
          Amount
        </Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>
            £
          </Text>

          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          style={styles.descriptionInput}
          placeholder="e.g. Taxi from airport"
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          maxLength={100}
        />

        <Pressable
          style={[
            styles.submitButton,
            !canSubmit &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            Send for Confirmation
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  intro: {
    fontSize: 17,
    color: "#6B7280",
    marginBottom: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 18,
    marginBottom: 8,
  },

  memberOption: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },

  memberOptionSelected: {
    borderColor: "#111827",
    backgroundColor: "#F3F4F6",
  },

  memberOptionText: {
    fontSize: 16,
    color: "#374151",
  },

  memberOptionTextSelected: {
    color: "#111827",
    fontWeight: "600",
  },

  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  currencySymbol: {
    fontSize: 20,
    color: "#111827",
    marginRight: 6,
  },

  amountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 20,
    color: "#111827",
  },

  descriptionInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
  },

  submitButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  submitButtonDisabled: {
    opacity: 0.4,
  },

  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});