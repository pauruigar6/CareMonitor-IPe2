// VideoScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import appConfig from "../constants/appConfig";
import { db, auth } from "../utils/firebase-config";
import {
  collection,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";

const VideoScreen = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "userInfo", auth.currentUser.uid, "videoInfo"),
      (snapshot) => {
        const fetchedVideos = [];
        snapshot.forEach((doc) => {
          const videoData = doc.data();
          fetchedVideos.push({ id: doc.id, uri: videoData.uri });
        });
        setVideos(fetchedVideos);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearVideos = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all videos?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Videos Cancelled"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleClearVideos() },
      ]
    );
  };

  const handleClearVideos = async () => {
    try {
      const userInfoSnapshot = await getDocs(collection(db, "userInfo"));
      userInfoSnapshot.forEach(async (userInfoDoc) => {
        const videosInfoSnapshot = await getDocs(
          collection(userInfoDoc.ref, "videoInfo")
        );
        videosInfoSnapshot.forEach(async (videoDoc) => {
          await deleteDoc(videoDoc.ref);
        });
      });
      setVideos([]);
    } catch (error) {
      console.error("Error deleting videos from Firestore:", error);
    }
  };

  const handleVideoPress = (index) => {
    Alert.alert("Video Options", "What would you like to do with this video?", [
      { text: "Delete Video", onPress: () => handleDeleteVideo(index) },
      { text: "Save Video", onPress: () => handleSaveVideo(index) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDeleteVideo = async (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this video?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Video Cancelled"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => confirmDeleteVideo(index) },
      ]
    );
  };

  const confirmDeleteVideo = async (index) => {
    try {
      const videoToDelete = videos[index];
      await deleteDoc(
        doc(db, "userInfo", auth.currentUser.uid, "videoInfo", videoToDelete.id)
      );
      setVideos(videos.filter((video, i) => i !== index));
    } catch (error) {
      console.error("Error deleting video:", error);
      Alert.alert("Error", "An error occurred while deleting the video.");
    }
  };

  const handleSaveVideo = async (index) => {
    const saveConfirmed = await promptForConfirmation();
    if (saveConfirmed) {
      try {
        const videoToSave = videos[index];
        const fileUri = videoToSave.uri;
        const downloadDirectory = FileSystem.documentDirectory + "downloads/";
        const directoryInfo = await FileSystem.getInfoAsync(downloadDirectory);
        if (!directoryInfo.exists) {
          await FileSystem.makeDirectoryAsync(downloadDirectory, {
            intermediates: true,
          });
        }
        const fileName = "downloaded_video.mp4";
        const destinationUri = downloadDirectory + fileName;
        await FileSystem.copyAsync({
          from: fileUri,
          to: destinationUri,
        });
        await MediaLibrary.saveToLibraryAsync(destinationUri);
        Alert.alert(
          "Download Complete",
          "The video has been saved to your device gallery.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Error saving video:", error);
        Alert.alert(
          "Error",
          "Failed to save the video. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  const renderVideos = () => {
    return videos.map((video, index) => (
      <TouchableOpacity key={index} onPress={() => handleVideoPress(index)}>
        <Video
          source={{ uri: video.uri }}
          style={styles.videoPreview}
          resizeMode="cover"
          useNativeControls={true}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appConfig.COLORS.background }}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Videos</Text>
        <View style={styles.gallery}>{renderVideos()}</View>
        {videos.length > 0 && (
          <TouchableOpacity onPress={clearVideos} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Delete All Videos</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  title: {
    ...appConfig.FONTS.h1,
    color: appConfig.COLORS.black,
    marginBottom: 16,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  videoPreview: {
    width: 220,
    height: 220,
    margin: 10,
    borderRadius: 10,
  },
  clearButton: {
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  clearButtonText: {
    color: "red",
    fontSize: 16,
  },
});

// Función para mostrar un mensaje de confirmación al usuario
const promptForConfirmation = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Confirmation",
      "Do you want to save the video to your device?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Save", onPress: () => resolve(true) },
      ]
    );
  });
};

export default VideoScreen;
