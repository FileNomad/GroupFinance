import {
    router,
    useLocalSearchParams,
} from "expo-router";
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

import { useEvents } from "../../../context/EventContext";

export default function EventDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const {
    events,
    currentUser,
    addMember,
    confirmTransaction,
    rejectTransaction,
    deleteEvent,
  } = useEvents();

  const [memberName, setMemberName] =
    useState("");

  const event = events.find(
    (item) => item.id === id
  );

  function handleAddMember() {
    if (!event) {
      return;
    }

    const trimmedName =
      memberName.trim();

    if (!trimmedName) {
      return;
    }

    addMember(
      event.id,
      trimmedName
    );

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
        <Text>
          Event not found.
        </Text>
      </View>
    );
  }

  const pendingTransactions =
    event.transactions.filter(
      (transaction) =>
        transaction.status === "pending"
    );

  const confirmedTransactions =
    event.transactions.filter(
      (transaction) =>
        transaction.status === "confirmed"
    );

  function formatDate(dateString: string) {
    return new Date(
      dateString
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function calculatePairBalances() {
    const balances: Record<
      string,
      number
    > = {};

    confirmedTransactions.forEach(
      (transaction) => {
        const first = [
          transaction.debtor,
          transaction.creditor,
        ]
          .sort()
          .join("|");

        const direction =
          transaction.debtor <
          transaction.creditor
            ? 1
            : -1;

        balances[first] =
          (balances[first] || 0) +
          transaction.amountInPence *
            direction;
      }
    );

    return balances;
  }

  const balances =
    calculatePairBalances();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
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

        {event.members.map(
          (member, index) => (
            <View
              key={`${member}-${index}`}
              style={styles.memberCard}
            >
              <Text style={styles.memberName}>
                {member}
              </Text>
            </View>
          )
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
            <Text
              style={
                styles.addMemberButtonText
              }
            >
              Add
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          Pending
        </Text>

        {pendingTransactions.length ===
        0 ? (
          <Text style={styles.emptyText}>
            No pending transactions.
          </Text>
        ) : (
          pendingTransactions.map(
            (transaction) => (
              <View
                key={transaction.id}
                style={styles.transactionCard}
              >
                <Text
                  style={
                    styles.transactionSummary
                  }
                >
                  {transaction.debtor} owes{" "}
                  {transaction.creditor} £
                  {(
                    transaction.amountInPence /
                    100
                  ).toFixed(2)}
                </Text>

                <Text
                  style={
                    styles.transactionDescription
                  }
                >
                  {transaction.description}
                </Text>

                <Text
                  style={
                    styles.transactionDate
                  }
                >
                  {formatDate(
                    transaction.createdAt
                  )}
                </Text>

                {currentUser ===
                transaction.creditor ? (
                  <View
                    style={
                      styles.confirmationRow
                    }
                  >
                    <Pressable
                      style={
                        styles.confirmButton
                      }
                      onPress={() =>
                        confirmTransaction(
                          event.id,
                          transaction.id
                        )
                      }
                    >
                      <Text
                        style={
                          styles.confirmButtonText
                        }
                      >
                        Confirm
                      </Text>
                    </Pressable>

                    <Pressable
                      style={
                        styles.rejectButton
                      }
                      onPress={() =>
                        rejectTransaction(
                          event.id,
                          transaction.id
                        )
                      }
                    >
                      <Text
                        style={
                          styles.rejectButtonText
                        }
                      >
                        Reject
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <Text
                    style={styles.pendingText}
                  >
                    Waiting for{" "}
                    {transaction.creditor}
                  </Text>
                )}
              </View>
            )
          )
        )}

        <Text style={styles.sectionTitle}>
          Transactions
        </Text>

        {confirmedTransactions.length ===
        0 ? (
          <Text style={styles.emptyText}>
            No confirmed transactions yet.
          </Text>
        ) : (
          confirmedTransactions.map(
            (transaction) => (
              <View
                key={transaction.id}
                style={styles.transactionCard}
              >
                <Text
                  style={
                    styles.transactionSummary
                  }
                >
                  {transaction.debtor} owes{" "}
                  {transaction.creditor} £
                  {(
                    transaction.amountInPence /
                    100
                  ).toFixed(2)}
                </Text>

                <Text
                  style={
                    styles.transactionDescription
                  }
                >
                  {transaction.description}
                </Text>

                <Text
                  style={
                    styles.transactionDate
                  }
                >
                  {formatDate(
                    transaction.createdAt
                  )}
                </Text>
              </View>
            )
          )
        )}

        <Text style={styles.sectionTitle}>
          Net Balance
        </Text>

        {Object.keys(balances).length ===
        0 ? (
          <Text style={styles.emptyText}>
            No outstanding balance.
          </Text>
        ) : (
          Object.entries(balances).map(
            ([pair, balance]) => {
              if (balance === 0) {
                return null;
              }

              const [
                firstMember,
                secondMember,
              ] = pair.split("|");

              const debtor =
                balance > 0
                  ? firstMember
                  : secondMember;

              const creditor =
                balance > 0
                  ? secondMember
                  : firstMember;

              return (
                <Text
                  key={pair}
                  style={styles.balanceText}
                >
                  {debtor} owes {creditor} £
                  {(
                    Math.abs(balance) / 100
                  ).toFixed(2)}
                </Text>
              );
            }
          )
        )}

        <Pressable
          style={styles.transactionButton}
          onPress={() =>
            router.push({
              pathname:
                "/events/[id]/add-transaction",
              params: {
                id: event.id,
              },
            })
          }
        >
          <Text
            style={
              styles.transactionButtonText
            }
          >
            + Add Transaction
          </Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={handleDeleteEvent}
        >
          <Text
            style={styles.deleteButtonText}
          >
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
    fontWeight: "500",
    color: "#111827",
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

  transactionCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  transactionSummary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  transactionDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  transactionDate: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },

  pendingText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 12,
  },

  confirmationRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },

  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  rejectButtonText: {
    color: "#DC2626",
    fontWeight: "600",
  },

  balanceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  transactionButton: {
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },

  transactionButtonText: {
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
});