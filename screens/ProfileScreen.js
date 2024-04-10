// HealthProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import appConfig from "../constants/appConfig";
import { Audio } from "expo-av";
import { useAudio } from "../utils/AudioContext";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
} from "../utils/firebase-config";
import {
  doc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const HealthProfileScreen = ({ navigation }) => {
  const { dispatch } = useAudio();
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        loadUserRecordings(user.uid);
      } else {
        console.log("Usuario no autenticado");
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserRecordings = async (userId) => {
    try {
      const userInfoRef = doc(db, "userInfo", userId);
      const audioInfoCollectionRef = collection(userInfoRef, "audioInfo");
      const querySnapshot = await getDocs(audioInfoCollectionRef);

      const userRecordings = [];
      querySnapshot.forEach((doc) => {
        const recordingData = doc.data();
        userRecordings.push({
          id: recordingData.id,
          title: recordingData.title,
          duration: recordingData.duration,
          file: recordingData.file,
        });
      });

      setRecordings(userRecordings);
      dispatch({ type: "SET_RECORDINGS", payload: userRecordings });
    } catch (error) {
      console.error("Error loading user recordings: ", error);
    }
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error("Error al iniciar la grabación", err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      const { sound, status } = await recording.createNewLoadedSoundAsync();

      const newRecording = {
        id: uuidv4(),
        title: `Recording ${recordings.length + 1}`,
        duration: status.durationMillis,
        file: recording.getURI(),
      };

      setRecordings([...recordings, newRecording]);

      try {
        const userInfoRef = doc(db, "userInfo", userId);
        const audioInfoCollectionRef = collection(userInfoRef, "audioInfo");

        // Log para verificar userId y referencia userInfoRef
        console.log("userId:", userId);
        console.log("userInfoRef:", userInfoRef);

        const audioDocRef = await addDoc(audioInfoCollectionRef, {
          id: newRecording.id,
          title: newRecording.title,
          duration: newRecording.duration,
          file: newRecording.file,
          timestamp: serverTimestamp(),
        });

        // Log para verificar que se ha creado el documento de audio
        console.log("Audio document written with ID: ", audioDocRef.id);
        
        // Después de guardar la grabación, vuelve a cargar las grabaciones del usuario
        loadUserRecordings(userId);
      } catch (error) {
        console.error("Error adding audio document: ", error);
      }

      dispatch({ type: "ADD_RECORDING", payload: newRecording });
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appConfig.COLORS.background }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={{
          flex: 1,
          backgroundColor: appConfig.COLORS.background,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Health Profile</Text>
          <View style={styles.btn}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={recording ? stopRecording : startRecording}
            >
              <FontAwesome5
                name={recording ? "stop" : "microphone"}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>
                {recording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    ...appConfig.FONTS.h1,
    color: appConfig.COLORS.black,
    marginBottom: 16,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 125,
  },
  uploadButton: {
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: appConfig.COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },
  uploadIcon: {
    fontSize: 60,
    color: appConfig.COLORS.white,
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: appConfig.COLORS.white,
  },
});

export default HealthProfileScreen;
