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
import { COLORS } from "../constants/appConfig";
import {
  db,
  auth,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc
} from "../utils/firebase-config";

const NotesScreen = () => {
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
        Alert.alert("Note Saved", "The note has been saved successfully.");

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
      Alert.alert("Notes Deleted", "All notes have been deleted successfully.");
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
        
        {renderNotes()}
        {!showAddNoteContainer && (
          <TouchableOpacity
            style={styles.addNoteButton}
            onPress={handleNoteAction}
          >
            <Text style={styles.addNoteButtonText}>{buttonText}</Text>
          </TouchableOpacity>
          
        )}
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
        <TouchableOpacity
          style={styles.deleteAllButton}
          onPress={handleDeleteAllNotes}>
          <Text style={styles.deleteAllButtonText}>Delete All Notes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  note: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
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
    backgroundColor: COLORS.primary,
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
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  deleteAllButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotesScreen;
