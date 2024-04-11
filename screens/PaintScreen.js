// PaintScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
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

const PaintScreen = () => {
  const [notes, setNotes] = useState([]);
  const [showAddNoteContainer, setShowAddNoteContainer] = useState(false);
  const [buttonText, setButtonText] = useState("Add Note");

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

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

  const handleNoteAction = async () => {
    if (buttonText === "Add Note") {
      setShowAddNoteContainer(true);
      setButtonText("Save Note");
    } else {
      await handleAddNote();
      setShowAddNoteContainer(false);
      setButtonText("Add Note");
    }
  };

  const handleAddNote = async () => {
    try {
      if (newNoteTitle.trim() !== "" && newNoteContent.trim() !== "") {
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
      }
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "An error occurred while saving the note.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          New Note
        </Text>
        {showAddNoteContainer && (
          <View style={styles.newNoteContainer}>
            <TextInput
              style={styles.newNoteTitleInput}
              placeholder="Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            <TextInput
              style={styles.newNoteContentInput}
              placeholder="Type something..."
              multiline
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            <TouchableOpacity
              style={styles.addNoteButton}
              onPress={handleNoteAction}
            >
              <Text style={styles.addNoteButtonText}>{buttonText}</Text>
            </TouchableOpacity>
          </View>
        )}
        {!showAddNoteContainer && (
          <TouchableOpacity
            style={styles.addNoteButtonCenter}
            onPress={handleNoteAction}
          >
            <Text style={styles.addNoteButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
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
    width: "100%",
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
    marginTop: 40,
    marginBottom: 20,
  },
  addNoteButtonCenter: {
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  addNoteButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PaintScreen;
