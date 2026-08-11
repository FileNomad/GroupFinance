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
    setCurrentUser,
    addMember,
    confirmTransaction,
    rejectTransaction,
    markTransactionPaid,
    confirmSettlement,
    rejectSettlement,
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

  const activeTransactions =
    event.transactions.filter(
      (transaction) =>
        transaction.status === "confirmed" ||
        transaction.status ===
          "payment_pending"
    );

  const settledTransactions =
    event.transactions.filter(
      (transaction) =>
        transaction.status === "settled"
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

    activeTransactions.forEach(
      (transaction) => {
        const pair = [
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

        balances[pair] =
          (balances[pair] || 0) +
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
          Testing As
        </Text>

        <View style={styles.userSwitcher}>
          {event.members.map(
            (member, index) => (
              <Pressable
                key={`${member}-${index}`}
                style={[
                  styles.userButton,
                  currentUser === member &&
                    styles.userButtonSelected,
                ]}
                onPress={() =>
                  setCurrentUser(member)
                }
              >
                <Text
                  style={[
                    styles.userButtonText,
                    currentUser === member &&
                      styles.userButtonTextSelected,
                  ]}
                >
                  {member}
                </Text>
              </Pressable>
            )
          )}
        </View>

        <Text style={styles.currentUserText}>
          You are testing as {currentUser}
        </Text>

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
                style={
                  styles.transactionCard
                }
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
                      styles.actionRow
                    }
                  >
                    <Pressable
                      style={
                        styles.primaryButton
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
                          styles.primaryButtonText
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
                    style={styles.statusText}
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

        {activeTransactions.length ===
        0 ? (
          <Text style={styles.emptyText}>
            No confirmed transactions yet.
          </Text>
        ) : (
          activeTransactions.map(
            (transaction) => (
              <View
                key={transaction.id}
                style={
                  styles.transactionCard
                }
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

                {transaction.status ===
                  "confirmed" &&
                currentUser ===
                  transaction.debtor ? (
                  <Pressable
                    style={
                      styles.markPaidButton
                    }
                    onPress={() =>
                      markTransactionPaid(
                        event.id,
                        transaction.id
                      )
                    }
                  >
                    <Text
                      style={
                        styles.markPaidButtonText
                      }
                    >
                      Mark as Paid
                    </Text>
                  </Pressable>
                ) : null}

                {transaction.status ===
                  "payment_pending" &&
                currentUser ===
                  transaction.debtor ? (
                  <Text
                    style={styles.statusText}
                  >
                    Waiting for{" "}
                    {transaction.creditor} to
                    confirm payment
                  </Text>
                ) : null}

                {transaction.status ===
                  "payment_pending" &&
                currentUser ===
                  transaction.creditor ? (
                  <>
                    <Text
                      style={
                        styles.paymentNotice
                      }
                    >
                      {transaction.debtor} says
                      this has been paid.
                    </Text>

                    <View
                      style={styles.actionRow}
                    >
                      <Pressable
                        style={
                          styles.primaryButton
                        }
                        onPress={() =>
                          confirmSettlement(
                            event.id,
                            transaction.id
                          )
                        }
                      >
                        <Text
                          style={
                            styles.primaryButtonText
                          }
                        >
                          Confirm Payment
                        </Text>
                      </Pressable>

                      <Pressable
                        style={
                          styles.rejectButton
                        }
                        onPress={() =>
                          rejectSettlement(
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
                          Not Received
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : null}
              </View>
            )
          )
        )}

        <Text style={styles.sectionTitle}>
          Net Balance
        </Text>

        {Object.entries(balances).filter(
          ([, balance]) => balance !== 0
        ).length === 0 ? (
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

        <Text style={styles.sectionTitle}>
          Settled
        </Text>

        {settledTransactions.length ===
        0 ? (
          <Text style={styles.emptyText}>
            No settled transactions yet.
          </Text>
        ) : (
          settledTransactions.map(
            (transaction) => (
              <View
                key={transaction.id}
                style={
                  styles.settledCard
                }
              >
                <Text
                  style={
                    styles.transactionSummary
                  }
                >
                  {transaction.debtor} paid{" "}
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

                <Text style={styles.settledText}>
                  Settled
                </Text>
              </View>
            )
          )
        )}

        <Pressable
          style={
            styles.transactionButton
          }
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

  userSwitcher: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  userButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  userButtonSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  userButtonText: {
    color: "#374151",
    fontWeight: "600",
  },

  userButtonTextSelected: {
    color: "white",
  },

  currentUserText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
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

  settledCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    opacity: 0.75,
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

  statusText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 12,
  },

  paymentNotice: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginTop: 12,
  },

  settledText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginTop: 10,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  primaryButtonText: {
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

  markPaidButton: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },

  markPaidButtonText: {
    color: "white",
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