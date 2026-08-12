import {
  router,
} from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEvents } from "../context/EventContext";

export default function CreateEventScreen() {
  const {
    createEvent,
  } = useEvents();

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleCreateEvent() {
    if (!name.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    const newEvent =
      await createEvent(
        name.trim(),
        description.trim()
      );

    setLoading(false);

    if (!newEvent) {
      setError(
        "Could not create the event."
      );

      return;
    }

    router.replace({
      pathname:
        "/events/[id]",
      params: {
        id: newEvent.id,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Event
      </Text>

      <Text style={styles.label}>
        Event name
      </Text>

      <TextInput
        style={styles.nameInput}
        placeholder="e.g. Barcelona Holiday"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={
          styles.descriptionInput
        }
        placeholder="What's the event for?"
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={
          setDescription
        }
        multiline
        maxLength={200}
      />

      <Text
        style={
          styles.characterCount
        }
      >
        {description.length}/200
      </Text>

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      <Pressable
        style={[
          styles.createButton,
          (!name.trim() ||
            loading) &&
            styles.createButtonDisabled,
        ]}
        onPress={
          handleCreateEvent
        }
        disabled={
          !name.trim() || loading
        }
      >
        <Text
          style={
            styles.createButtonText
          }
        >
          {loading
            ? "Creating..."
            : "Create Event"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      paddingHorizontal: 24,
      paddingTop: 40,
    },

    title: {
      fontSize: 30,
      fontWeight: "700",
      color: "#111827",
      marginBottom: 32,
    },

    label: {
      fontSize: 15,
      fontWeight: "600",
      color: "#374151",
      marginBottom: 8,
      marginTop: 8,
    },

    nameInput: {
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: "#111827",
      marginBottom: 16,
    },

    descriptionInput: {
      minHeight: 120,
      borderWidth: 1,
      borderColor: "#D1D5DB",
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: "#111827",
      textAlignVertical: "top",
    },

    characterCount: {
      fontSize: 13,
      color: "#9CA3AF",
      textAlign: "right",
      marginTop: 6,
    },

    errorText: {
      color: "#DC2626",
      fontSize: 14,
      marginTop: 18,
    },

    createButton: {
      backgroundColor: "#111827",
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 28,
    },

    createButtonDisabled: {
      opacity: 0.4,
    },

    createButtonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "600",
    },
  });