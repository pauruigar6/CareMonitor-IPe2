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
} from "react-native";
import appConfig from "../constants/appConfig";
import { db, auth } from "../utils/firebase-config";
import { collection, onSnapshot, getDocs, deleteDoc } from "firebase/firestore";
import ImageViewer from "react-native-image-zoom-viewer";
import { MaterialIcons } from "@expo/vector-icons";

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
      console.error("Error clearing photos from Firestore:", error);
    }
  };

  const handleImagePress = (index) => {
    setCurrentImageIndex(index);
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
        <Text style={styles.title}>Photo Gallery</Text>
        <View style={styles.gallery}>{renderPhotos()}</View>
        {photos.length > 0 && (
          <TouchableOpacity onPress={clearPhotos} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Photos</Text>
          </TouchableOpacity>
        )}
      
      {currentImageIndex !== null && (
        <View style={styles.fullScreenContainer}>
          <ImageViewer
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
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
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
