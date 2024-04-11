// DesignScreen.js
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
import { onSnapshot } from "firebase/firestore";

const DesignScreen = () => {
  const [notes, setNotes] = useState([]);
  const [showAddNoteContainer, setShowAddNoteContainer] = useState(false);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "userInfo", auth.currentUser.uid, "textInfo"),
      (snapshot) => {
        const fetchedNotes = [];
        snapshot.forEach((doc) => {
          const notesData = doc.data();
          fetchedNotes.push({ id: doc.id, ...doc.data() });
        });
        setNotes(fetchedNotes);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteAllNotes = async () => {
    try {
      const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
      const textInfoRef = collection(userInfoRef, "textInfo");

      // Delete all notes in the 'textInfo' collection
      const snapshot = await getDocs(textInfoRef);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setNotes([]); // Clear the notes array
      //Alert.alert("Notes Deleted", "All notes have been deleted successfully.");
    } catch (error) {
      console.error("Error deleting notes:", error);
      Alert.alert("Error", "An error occurred while deleting the notes.");
    }
  };

  const renderNotes = () => {
    return notes.map((note) => (
      <TouchableOpacity key={note.id} style={styles.note}>
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text style={styles.noteContent}>{note.content}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          My Notes
        </Text>
        {renderNotes()}

        {notes.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={handleDeleteAllNotes}
          >
            <Text style={styles.deleteAllButtonText}>Delete All Notes</Text>
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
  note: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    marginTop: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 16,
    color: "#666",
  },
  newNoteContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
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
  addNoteButtonText: {
    color: "white",
    fontSize: 16,
  },
  deleteAllButton: {
    backgroundColor: "#ff4444",
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  deleteAllButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DesignScreen;
