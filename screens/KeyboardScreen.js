// KeyboardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import appConfig from "../constants/appConfig";
import {
  db,
  auth,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from "../utils/firebase-config";

const KeyboardScreen = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
        const textInfoRef = collection(userInfoRef, "textInfo");
        const snapshot = await getDocs(textInfoRef);
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    setTitleError("");
    setContentError("");

    let hasError = false;
    if (newNoteTitle.trim() === "") {
      setTitleError("Title is required.");
      hasError = true;
    }
    if (newNoteContent.trim() === "") {
      setContentError("Content is required.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const mediaData = {
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
        timestamp: new Date().toISOString(),
      };

      const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
      const textInfoRef = collection(userInfoRef, "textInfo");

      await addDoc(textInfoRef, mediaData);

      const newNote = {
        id: Math.random().toString(),
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
      };
      setNotes([...notes, newNote]);
      setNewNoteTitle("");
      setNewNoteContent("");
    } catch (error) {
      console.error("Error saving note:", error);
      // Handle error saving note
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          New Note
        </Text>

        <View style={styles.newNoteContainer}>
          <TextInput
            style={styles.newNoteTitleInput}
            placeholder="Title"
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
          />
          {titleError ? (
            <Text style={styles.errorText}>{titleError}</Text>
          ) : null}
          <TextInput
            style={styles.newNoteContentInput}
            placeholder="Type something..."
            multiline
            value={newNoteContent}
            onChangeText={setNewNoteContent}
          />
          {contentError ? (
            <Text style={styles.errorText}>{contentError}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.addNoteButton}
            onPress={handleAddNote}
          >
            <Text style={styles.addNoteButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appConfig.COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  newNoteContainer: {
    marginTop: 250,
    width: "100%",
    padding: 16,
  },
  newNoteTitleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  newNoteContentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    minHeight: 100,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: "top",
  },
  addNoteButton: {
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  addNoteButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});

export default KeyboardScreen;
