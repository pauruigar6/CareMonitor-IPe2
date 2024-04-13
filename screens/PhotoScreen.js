// PhotoScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
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

const PhotoScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "userInfo", auth.currentUser.uid, "photoInfo"),
      (snapshot) => {
        const fetchedPhotos = [];
        snapshot.forEach((doc) => {
          const photoData = doc.data();
          fetchedPhotos.push({ id: doc.id, uri: photoData.uri });
        });
        setPhotos(fetchedPhotos);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearPhotos = async () => {
    Alert.alert(
      "Confirm Delete All",
      "Are you sure you want to delete all photos?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Photos Cancelled"),
          style: "cancel",
        },
        { text: "Delete All", onPress: () => handleClearPhotos() },
      ]
    );
  };

  const handleClearPhotos = async () => {
    try {
      const userInfoSnapshot = await getDocs(collection(db, "userInfo"));
      userInfoSnapshot.forEach(async (userInfoDoc) => {
        const photoInfoSnapshot = await getDocs(
          collection(userInfoDoc.ref, "photoInfo")
        );
        photoInfoSnapshot.forEach(async (photoDoc) => {
          await deleteDoc(photoDoc.ref);
        });
      });
      setPhotos([]);
    } catch (error) {
      console.error("Error deleting photos from Firestore:", error);
    }
  };

  const handleImagePress = (index) => {
    Alert.alert("Photo Options", "What would you like to do with this photo?", [
      { text: "Save Photo", onPress: () => handleSavePhoto(index) },
      { text: "Delete", onPress: () => handleDeletePhoto(index) },

      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDeletePhoto = async (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this photo?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Photo Cancelled"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => confirmDeletePhoto(index) },
      ]
    );
  };

  const confirmDeletePhoto = async (index) => {
    try {
      const photoToDelete = photos[index];
      await deleteDoc(
        doc(db, "userInfo", auth.currentUser.uid, "photoInfo", photoToDelete.id)
      );
      setPhotos(photos.filter((photo, i) => i !== index));
      //Alert.alert("Success", "Photo deleted successfully.");
    } catch (error) {
      console.error("Error deleting photo:", error);
      Alert.alert("Error", "An error occurred while deleting the photo.");
    }
  };

  const handleSavePhoto = async (index) => {
    try {
      const photoToSave = photos[index];
      const fileUri = photoToSave.uri;
      const downloadDirectory = FileSystem.documentDirectory + "downloads/";
      const directoryInfo = await FileSystem.getInfoAsync(downloadDirectory);
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDirectory, {
          intermediates: true,
        });
      }
      const fileName = "downloaded_photo.jpg";
      const destinationUri = downloadDirectory + fileName;
      await FileSystem.copyAsync({
        from: fileUri,
        to: destinationUri,
      });
      await MediaLibrary.saveToLibraryAsync(destinationUri);
      Alert.alert(
        "Download Complete",
        "The image has been saved to your device gallery.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error saving photo:", error);
      Alert.alert(
        "Error",
        "Failed to save the photo. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  const renderPhotos = () => {
    return photos.map((photo, index) => (
      <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
        <Image source={{ uri: photo.uri }} style={styles.image} />
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appConfig.COLORS.background }}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Photos</Text>
        <View style={styles.gallery}>{renderPhotos()}</View>
        {photos.length > 0 && (
          <TouchableOpacity onPress={clearPhotos} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Delete All Photos</Text>
          </TouchableOpacity>
        )}

        {currentImageIndex !== null && (
          <View style={styles.fullScreenContainer}>
            <View
              imageUrls={photos.map((photo) => ({ url: photo.uri }))}
              index={currentImageIndex}
              enableSwipeDown
              renderHeader={() => (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCurrentImageIndex(null)}
                >
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              )}
              style={styles.imageViewer}
            />
          </View>
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
  image: {
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  imageViewer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default PhotoScreen;
