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
import { collection, onSnapshot, getDocs, deleteDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system"; // Importa FileSystem desde expo-file-system
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

  const handleImagePress = async (index) => {
    try {
      const confirmed = await promptForConfirmation();
      if (!confirmed) return; // Si el usuario cancela, salir de la función
      // Obtener la ruta de archivo de la imagen desde Firestore
      const fileUri = photos[index].uri;

      // Directorio de descargas en el dispositivo
      const downloadDirectory = FileSystem.documentDirectory + "downloads/";

      // Verificar si el directorio de descargas existe, si no, crearlo
      const directoryInfo = await FileSystem.getInfoAsync(downloadDirectory);
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDirectory, {
          intermediates: true,
        });
      }

      // Nombre del archivo descargado
      const fileName = "downloaded_photo.jpg";

      // Ruta de destino para la descarga
      const destinationUri = downloadDirectory + fileName;

      // Copiar el archivo desde su ubicación actual a la ubicación de descargas
      await FileSystem.copyAsync({
        from: fileUri,
        to: destinationUri,
      });

      // Guardar la imagen en la galería
      await MediaLibrary.saveToLibraryAsync(destinationUri);

      // Mostrar un mensaje de éxito
      Alert.alert(
        "Download Complete",
        "The image has been saved to your device gallery.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error downloading image:", error);
      // Mostrar un mensaje de error en caso de falla
      Alert.alert(
        "Error",
        "Failed to download the image. Please try again later.",
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
            <Text style={styles.clearButtonText}>Clear Photos</Text>
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

// Función para mostrar un mensaje de confirmación al usuario
const promptForConfirmation = () => {
  return new Promise((resolve) => {
    Alert.alert(
      "Confirmation",
      "Do you want to save the image to your device?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Save", onPress: () => resolve(true) },
      ]
    );
  });
};

export default PhotoScreen;
