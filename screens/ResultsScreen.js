// ResultsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import appConfig from "../constants/appConfig";
import { useAudio } from "../utils/AudioContext";
import { Audio } from "expo-av";
import { getDocs, deleteDoc, doc, collection } from 'firebase/firestore';
import { auth, db } from '../utils/firebase-config'

const ResultsScreen = () => {
  const { state, dispatch } = useAudio();
  const [sound, setSound] = useState();
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const getDurationFormatted = (milliseconds) => {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  };

  const handlePlayRecording = async (title, file) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: file },
        { shouldPlay: true }
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };

  const handleCardPress = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDeleteRecording = async () => {
    try {
      const user = auth.currentUser;
      const userInfoRef = doc(db, 'userInfo', user.uid);
      const audioInfoCollectionRef = collection(userInfoRef, 'audioInfo');

      if (expandedIndex !== null) {
        const recordingToDelete = state.recordings[expandedIndex];

        // Encontrar el documento en la colección según el ID del audio
        const querySnapshot = await getDocs(audioInfoCollectionRef);
        const audioDoc = querySnapshot.docs.find(doc => doc.id === recordingToDelete.id);

        if (audioDoc) {
          // Borrar el documento de la colección
          await deleteDoc(audioDoc.ref);

          // Actualizar el estado local eliminando el audio
          const updatedRecordings = state.recordings.filter((_, i) => i !== expandedIndex);
          dispatch({ type: 'SET_RECORDINGS', payload: updatedRecordings });
        }
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
    }
  };
  

  const handleClearRecordings = async () => {
    try {
      const user = auth.currentUser;
      const userInfoRef = doc(db, 'userInfo', user.uid);
      const audioInfoCollectionRef = collection(userInfoRef, 'audioInfo');
      
      const querySnapshot = await getDocs(audioInfoCollectionRef);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      dispatch({ type: 'CLEAR_ALL_RECORDINGS' });
      setExpandedIndex(null);
    } catch (error) {
      console.error('Error clearing recordings:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
          Results
        </Text>
        {state.recordings.map((recording, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardPress(index)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.label}>{`Recording ${index + 1}`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.durationText}>
                {getDurationFormatted(recording.duration)}
              </Text>
            </View>
            {expandedIndex === index && (
              <View style={styles.expandedContent}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() =>
                    handlePlayRecording(
                      `Recording ${index + 1}`,
                      recording.file
                    )
                  }
                >
                  <FontAwesome5 name="play" style={styles.playIcon} />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
        {state.recordings.length > 0 && (
          <TouchableOpacity
            onPress={handleClearRecordings}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear Recordings</Text>
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
  card: {
    backgroundColor: appConfig.COLORS.white,
    borderRadius: 10,
    marginTop: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationText: {
    fontSize: 16,
    color: appConfig.COLORS.gray,
  },
  playButton: {
    width: 35,
    height: 35,
    borderWidth: 1.5,
    borderColor: appConfig.COLORS.primary,
    borderRadius: 20,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  playIcon: {
    fontSize: 15,
    padding: 5,
    color: appConfig.COLORS.primary,
  },
  clearButton: {
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  clearButtonText: {
    color: appConfig.COLORS.white,
    fontSize: 16,
  },
  expandedContent: {
    alignItems: "center",
  },
});

export default ResultsScreen;
