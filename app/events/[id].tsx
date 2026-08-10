import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEvents } from "../../context/EventContext";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    events,
    addMember,
    deleteEvent,
  } = useEvents();

  const [memberName, setMemberName] = useState("");

  const event = events.find(
    (item) => item.id === id
  );

  function handleAddMember() {
    const trimmedName = memberName.trim();

    if (!trimmedName || !event) {
      return;
    }

    addMember(event.id, trimmedName);
    setMemberName("");
  }

  function handleDeleteEvent() {
    if (!event) {
      return;
    }

    Alert.alert(
      "Delete event?",
      `Are you sure you want to delete "${event.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteEvent(event.id);
            router.replace("/");
          },
        },
      ]
    );
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {event.name}
        </Text>

        {event.description ? (
          <Text style={styles.description}>
            {event.description}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>
          Members
        </Text>

        {event.members.length === 0 ? (
          <Text style={styles.emptyText}>
            No members have been added yet.
          </Text>
        ) : (
          event.members.map((member, index) => (
            <View
              key={`${member}-${index}`}
              style={styles.memberCard}
            >
              <Text style={styles.memberName}>
                {member}
              </Text>
            </View>
          ))
        )}

        <View style={styles.memberRow}>
          <TextInput
            style={styles.memberInput}
            placeholder="Add another member"
            placeholderTextColor="#9CA3AF"
            value={memberName}
            onChangeText={setMemberName}
          />

          <Pressable
            style={styles.addMemberButton}
            onPress={handleAddMember}
          >
            <Text style={styles.addMemberButtonText}>
              Add
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          Expenses
        </Text>

        {event.expenses.length === 0 ? (
          <Text style={styles.emptyText}>
            No expenses have been added yet.
          </Text>
        ) : (
          event.expenses.map((expense) => (
            <View
              key={expense.id}
              style={styles.expenseCard}
            >
              <View>
                <Text style={styles.expenseTitle}>
                  {expense.paidBy} paid for {expense.paidFor}
                </Text>

                <Text style={styles.expenseSubtitle}>
                  Expense
                </Text>
              </View>

              <Text style={styles.expenseAmount}>
                £{(expense.amountInPence / 100).toFixed(2)}
              </Text>
            </View>
          ))
        )}

        <Pressable
          style={styles.expenseButton}
          onPress={() =>
            router.push({
              pathname: "/events/[id]/add-expense",
              params: {
                id: event.id,
              },
            })
          }
        >
          <Text style={styles.expenseButtonText}>
            + Add Expense
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteEvent}
        >
          <Text style={styles.deleteButtonText}>
            Delete Event
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 23,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 32,
    marginBottom: 12,
  },

  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
  },

  memberCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },

  memberName: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },

  memberRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  memberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
  },

  addMemberButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 12,
  },

  addMemberButtonText: {
    color: "white",
    fontWeight: "600",
  },

  expenseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  expenseSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },

  expenseAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  expenseButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  expenseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    marginTop: 40,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "600",
  },

  notFoundText: {
    fontSize: 16,
    color: "#6B7280",
  },
});