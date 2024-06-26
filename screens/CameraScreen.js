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
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [cameraRef]);

  const initializeCamera = async () => {
    if (cameraRef && cameraRef.current) {
      const camera = cameraRef.current;
      try {
        await camera.unlockAsync();
      } catch (error) {
        console.error("Error unlocking camera:", error);
      }
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "photo" ? "video" : "photo"));
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    console.log("takePicture");
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
    if (cameraRef && mode === "video") {
      try {
        setIsRecording(true);
        const { uri } = await cameraRef.recordAsync();
        saveMedia(uri);
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      cameraRef.stopRecording();
      setIsRecording(false);
    }
  };

  const saveMedia = async (uri) => {
    try {
      const mediaData = {
        uri: uri,
        type: mode,
        timestamp: serverTimestamp(),
      };

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
        ref={(ref) => {
          setCameraRef(ref);
          if (ref) {
            initializeCamera();
          }
        }}
        style={styles.camera}
        type={cameraType}
        flashMode={Camera.Constants.FlashMode.auto}
        ratio="16:9"
      />

      <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
        <Text style={styles.modeText}>
          {mode === "photo" ? "Video" : "Photo"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
        <FontAwesome5 name="sync" style={styles.icon} />
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
  flipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 50,
    padding: 10,
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
    fontSize: 20,
    color: appConfig.COLORS.white,
  },
});

export default CameraScreen;
