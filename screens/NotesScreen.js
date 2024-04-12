// NotesScreen.js
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

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);
  const [showAddNoteContainer, setShowAddNoteContainer] = useState(false);

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNoteTitle, setEditedNoteTitle] = useState("");
  const [editedNoteContent, setEditedNoteContent] = useState("");

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

      const snapshot = await getDocs(textInfoRef);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setNotes([]);
    } catch (error) {
      console.error("Error deleting notes:", error);
      Alert.alert("Error", "An error occurred while deleting the notes.");
    }
  };

  const handleEditNote = (noteId) => {
    // Muestra opciones para editar o eliminar la nota
    Alert.alert(
      "What would you like to do with this note",
      "",
      [
        { text: "Edit Note", onPress: () => handleEditOption(noteId) },
        { text: "Delete Note", onPress: () => confirmDeleteNote(noteId) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleEditOption = (noteId) => {
    const selectedNote = notes.find((note) => note.id === noteId);
    setEditingNoteId(noteId);
    setEditedNoteTitle(selectedNote.title);
    setEditedNoteContent(selectedNote.content);
  };

  const handleSaveEditedNote = async () => {
    try {
      const updatedNotes = notes.map((note) => {
        if (note.id === editingNoteId) {
          return {
            ...note,
            title: editedNoteTitle,
            content: editedNoteContent,
          };
        }
        return note;
      });
      setNotes(updatedNotes);
      setEditingNoteId(null);
      setEditedNoteTitle("");
      setEditedNoteContent("");

      // Aquí puedes guardar los cambios en Firestore si es necesario
    } catch (error) {
      console.error("Error saving edited note:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedNoteTitle("");
    setEditedNoteContent("");
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
      const textInfoRef = collection(userInfoRef, "textInfo");
      await deleteDoc(doc(textInfoRef, noteId));

      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "An error occurred while deleting the note.");
    }
  };

  const confirmDeleteNote = (noteId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleDeleteNote(noteId) },
      ],
      { cancelable: false }
    );
  };

  const confirmDeleteAllNotes = () => {
    Alert.alert(
      "Confirm Delete All",
      "Are you sure you want to delete all notes?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Delete All", onPress: handleDeleteAllNotes },
      ],
      { cancelable: false }
    );
  };

  const renderNotes = () => {
    return notes.map((note) => (
      <TouchableOpacity
        key={note.id}
        style={styles.note}
        onPress={() => handleEditNote(note.id)}
      >
        {editingNoteId === note.id ? (
          <View>
            <TextInput
              style={styles.noteTitleInput}
              value={editedNoteTitle}
              onChangeText={setEditedNoteTitle}
            />
            <TextInput
              style={styles.noteContentInput}
              value={editedNoteContent}
              onChangeText={setEditedNoteContent}
              multiline
            />
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity
                onPress={handleSaveEditedNote}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelEdit}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDeleteNote(note.id)}
                style={styles.deleteNoteButton}
              >
                <Text style={styles.deleteNoteButtonText}>Delete Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
          </View>
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          My Notes
        </Text>
        {renderNotes()}
      </ScrollView>

      {notes.length > 0 && (
        <TouchableOpacity
          style={styles.deleteAllButton}
          onPress={confirmDeleteAllNotes}
        >
          <Text style={styles.deleteAllButtonText}>Delete All Notes</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appConfig.COLORS.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Adjusted padding to make space for the button
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
  noteTitleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  noteContentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    minHeight: 100,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: "top",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 5,
    padding: 8,
    width: "30%",
  },
  cancelButton: {
    borderRadius: 5,
    padding: 8,
    width: "30%",
  },
  deleteNoteButton: {
    borderRadius: 5,
    padding: 8,
    width: "30%",
  },
  saveButtonText: {
    color: appConfig.COLORS.primary,
    textAlign: "center",
  },
  cancelButtonText: {
    color: appConfig.COLORS.primary,
    textAlign: "center",
  },
  deleteNoteButtonText: {
    color: "red",
    textAlign: "center",
  },
  deleteAllButton: {
    position: "absolute",
    bottom: 20,
    left: 300,
    right: 300,
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginBottom: 30,
  },
  deleteAllButtonText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default NotesScreen;
