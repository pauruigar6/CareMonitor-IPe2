// CameraScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import appConfig from "../constants/appConfig";
import {
  db,
  serverTimestamp,
  addDoc,
  collection,
  doc,
  auth,
} from "../utils/firebase-config";

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState("photo");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    
    const initializeCamera = async () => {
      const camera = await cameraRef?.current;
      if (camera) {
        try {
          await camera.unlockAsync();
        } catch (error) {
          console.error("Error unlocking camera:", error);
        }
      }
    };
  
    if (cameraRef) {
      initializeCamera();
    }
  }, [cameraRef]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "photo" ? "video" : "photo"));
  };

  const takePicture = async () => {
    console.log("takePicture"); // Agregar mensaje de depuración
    if (cameraRef && mode === "photo") {
      try {
        const photo = await cameraRef.takePictureAsync();
        saveMedia(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const startRecording = async () => {
    console.log("Recording started 1"); // Agregar mensaje de depuración
    if (cameraRef && mode === "video") {
      console.log("Recording started 2"); // Agregar mensaje de depuración
      try {
        console.log("Recording started 3"); // Agregar mensaje de depuración
        const data = await cameraRef.current.recordAsync();
        console.log("Recording started 4"); // Agregar mensaje de depuración
        setIsRecording(true);

        Alert.alert("Recording started");
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const stopRecording = async () => {
    console.log("Recording stopped 1"); // Agregar mensaje de depuración

    if (cameraRef && isRecording && mode === "video") {
      console.log("Recording stopped 2"); // Agregar mensaje de depuración
      try {
        await cameraRef.current.stopRecording();
        saveMedia(startRecording.data.uri);
        setIsRecording(false);
        console.log("Recording stopped 3"); // Agregar mensaje de depuración
        Alert.alert("Recording stopped");
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  const saveMedia = async (uri) => {
    try {
      const mediaData = {
        uri: uri,
        type: mode,
        timestamp: serverTimestamp(),
      };

      // Construir la referencia a la subcolección
      const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
      const mediaRef = collection(
        userInfoRef,
        mode === "photo" ? "photoInfo" : "videoInfo"
      );

      await addDoc(mediaRef, mediaData);

      // Alert.alert("Media Saved", "The media has been saved successfully.");
    } catch (error) {
      console.error("Error saving media:", error);
      Alert.alert("Error", "An error occurred while saving the media.");
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCameraRef(ref)}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={Camera.Constants.FlashMode.auto}
        ratio="16:9"
      />

      <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
        <Text style={styles.modeText}>
          {mode === "photo" ? "Video" : "Photo"}
        </Text>
      </TouchableOpacity>
      {mode === "photo" ? (
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <FontAwesome5 name="camera" style={styles.icon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.captureButton}
          onPressIn={startRecording}
          onPressOut={stopRecording}
        >
          <FontAwesome5
            name={isRecording ? "stop" : "circle"}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: appConfig.COLORS.background,
  },
  camera: {
    flex: 1,
  },
  modeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: appConfig.COLORS.primary,
  },
  modeText: {
    fontSize: 16,
    color: appConfig.COLORS.white,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 50,
    padding: 20,
  },
  icon: {
    fontSize: 40,
    color: appConfig.COLORS.white,
  },
});

export default CameraScreen;
