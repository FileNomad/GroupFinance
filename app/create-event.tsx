import { router } from "expo-router";
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberName, setMemberName] = useState("");

  const { createEvent } = useEvents();

  function handleAddMember() {
    const trimmedName = memberName.trim();

    if (!trimmedName) {
      return;
    }

    setMembers((currentMembers) => [
      ...currentMembers,
      trimmedName,
    ]);

    setMemberName("");
  }

  function handleCreateEvent() {
    if (!name.trim()) {
      return;
    }

    createEvent(
      name.trim(),
      description.trim(),
      members
    );

    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <Text style={styles.label}>Event name</Text>

      <TextInput
        style={styles.nameInput}
        placeholder="e.g. Barcelona Holiday"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>

      <TextInput
        style={styles.descriptionInput}
        placeholder="What's the event for?"
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={200}
      />

      <Text style={styles.characterCount}>
        {description.length}/200
      </Text>

      <Text style={styles.label}>Members</Text>

      <View style={styles.memberRow}>
        <TextInput
          style={styles.memberInput}
          placeholder="Enter a name"
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

      {members.map((member, index) => (
        <Text
          key={`${member}-${index}`}
          style={styles.memberName}
        >
          {member}
        </Text>
      ))}

      <Pressable
        style={[
          styles.createButton,
          !name.trim() && styles.createButtonDisabled,
        ]}
        onPress={handleCreateEvent}
      >
        <Text style={styles.createButtonText}>
          Create Event
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
  },

  memberRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
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

  memberName: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
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