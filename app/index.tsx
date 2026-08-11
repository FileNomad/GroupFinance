import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useEvents } from "../context/EventContext";

export default function HomeScreen() {
  const { events } = useEvents();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Group Finance
        </Text>

        <Text style={styles.subtitle}>
          Keep group spending simple.
        </Text>

        <Pressable
          style={styles.createButton}
          onPress={() =>
            router.push("/create-event")
          }
        >
          <Text style={styles.createButtonText}>
            + Create Event
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>
          Your Events
        </Text>

        {events.length === 0 ? (
          <Text style={styles.emptyText}>
            You haven't created any events yet.
          </Text>
        ) : (
          events.map((event) => (
            <Pressable
              key={event.id}
              style={styles.eventCard}
              onPress={() =>
                router.push({
                  pathname: "/events/[id]",
                  params: {
                    id: event.id,
                  },
                })
              }
            >
              <Text style={styles.eventName}>
                {event.name}
              </Text>

              {event.description ? (
                <Text
                  style={styles.eventDescription}
                >
                  {event.description}
                </Text>
              ) : null}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 6,
  },

  createButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },

  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 36,
    marginBottom: 14,
  },

  emptyText: {
    color: "#6B7280",
    fontSize: 15,
  },

  eventCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  eventName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  eventDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },
});