import { router, useLocalSearchParams } from "expo-router";
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

export default function AddExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { events, addExpense } = useEvents();

  const event = events.find((item) => item.id === id);

  const [paidBy, setPaidBy] = useState("");
  const [paidFor, setPaidFor] = useState("");
  const [amount, setAmount] = useState("");

  function handleSaveExpense() {
    if (!event) {
      return;
    }

    const numericAmount = Number(amount);

    if (
      !paidBy ||
      !paidFor ||
      paidBy === paidFor ||
      !numericAmount ||
      numericAmount <= 0
    ) {
      return;
    }

    addExpense(
      event.id,
      paidBy,
      paidFor,
      Math.round(numericAmount * 100)
    );

    router.back();
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>
          Event not found.
        </Text>
      </View>
    );
  }

  const canSave =
    paidBy !== "" &&
    paidFor !== "" &&
    paidBy !== paidFor &&
    Number(amount) > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Add Expense
        </Text>

        <Text style={styles.label}>
          Who paid?
        </Text>

        {event.members.map((member, index) => (
          <Pressable
            key={`payer-${member}-${index}`}
            style={[
              styles.memberOption,
              paidBy === member &&
                styles.memberOptionSelected,
            ]}
            onPress={() => setPaidBy(member)}
          >
            <Text
              style={[
                styles.memberOptionText,
                paidBy === member &&
                  styles.memberOptionTextSelected,
              ]}
            >
              {member}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.label}>
          Who did they pay for?
        </Text>

        {event.members.map((member, index) => (
          <Pressable
            key={`recipient-${member}-${index}`}
            style={[
              styles.memberOption,
              paidFor === member &&
                styles.memberOptionSelected,
              paidBy === member &&
                styles.memberOptionDisabled,
            ]}
            disabled={paidBy === member}
            onPress={() => setPaidFor(member)}
          >
            <Text
              style={[
                styles.memberOptionText,
                paidFor === member &&
                  styles.memberOptionTextSelected,
                paidBy === member &&
                  styles.memberOptionTextDisabled,
              ]}
            >
              {member}
            </Text>
          </Pressable>
        ))}

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

        <Pressable
          style={[
            styles.saveButton,
            !canSave &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSaveExpense}
        >
          <Text style={styles.saveButtonText}>
            Save Expense
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
    marginBottom: 28,
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

  memberOptionDisabled: {
    opacity: 0.35,
  },

  memberOptionText: {
    fontSize: 16,
    color: "#374151",
  },

  memberOptionTextSelected: {
    color: "#111827",
    fontWeight: "600",
  },

  memberOptionTextDisabled: {
    color: "#9CA3AF",
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

  saveButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },

  saveButtonDisabled: {
    opacity: 0.4,
  },

  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  notFoundText: {
    fontSize: 16,
    color: "#6B7280",
  },
});