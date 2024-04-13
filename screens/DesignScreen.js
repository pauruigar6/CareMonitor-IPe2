import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
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
import Svg, { Path } from "react-native-svg";

const DesignScreen = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "userInfo", auth.currentUser.uid, "handwritingInfo"),
      (snapshot) => {
        const fetchedDrawings = [];
        snapshot.forEach((doc) => {
          const drawingData = doc.data();
          fetchedDrawings.push({ id: doc.id, ...drawingData });
        });
        setDrawings(fetchedDrawings);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteAllDrawings = async () => {
    Alert.alert(
      "Confirm Delete All",
      "Are you sure you want to delete all Handwritings?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          onPress: async () => {
            try {
              const userInfoRef = doc(db, "userInfo", auth.currentUser.uid);
              const handwritingInfoRef = collection(
                userInfoRef,
                "handwritingInfo"
              );

              // Delete all drawings in the 'handwritingInfo' collection
              const snapshot = await getDocs(handwritingInfoRef);
              snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });

              setDrawings([]); // Clear the drawings array
              Alert.alert(
                "Handwritings Deleted",
                "All handwritings have been deleted successfully."
              );
            } catch (error) {
              console.error("Error deleting handwritings:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the handwritings."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderDrawings = () => {
    return drawings.map((drawing) => (
      <View key={drawing.id} style={styles.drawingContainer}>
        <View style={styles.drawingWrapper}>
          <Text style={styles.drawingTitle}>{drawing.title}</Text>
          <Svg style={styles.drawing}>
            {drawing.paths.map((path, index) => (
              <Path
                key={index}
                d={path.d}
                fill="none"
                stroke="black"
                strokeWidth={2}
              />
            ))}
          </Svg>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text
          style={{
            ...appConfig.FONTS.h1,
            color: appConfig.COLORS.black,
            marginBottom: 20,
          }}
        >
          My Handwritings
        </Text>
        {renderDrawings()}

        {drawings.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={handleDeleteAllDrawings}
          >
            <Text style={styles.deleteAllButtonText}>Delete All Handwritings</Text>
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
  drawingContainer: {
    marginBottom: 16,
  },
  drawingWrapper: {
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
    width: "45%",
    aspectRatio: 1, // Cuadrado
  },
  drawingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    padding: 8,
  },
  drawing: {
    flex: 1,
  },
  deleteAllButton: {
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  deleteAllButtonText: {
    color: "red",
    fontSize: 16,
  },
});

export default DesignScreen;
