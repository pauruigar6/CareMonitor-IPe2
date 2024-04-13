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

  const handlePressDrawing = (drawing) => {
    Alert.alert(
      "Handwriting Options",
      "What would you like to do with this handwriting?",
      [
        
        {
          text: "Save Handwriting",
          onPress: () => {
            // Aquí puedes implementar la lógica para guardar el dibujo
            // Puedes usar AsyncStorage o cualquier otra forma de almacenamiento
            // Aquí simplemente mostraremos un mensaje de alerta
            Alert.alert("Save", "Feature coming soon!");
          },
        },
        {
          text: "Delete",
          onPress: () => handleDeleteDrawing(drawing.id),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleDeleteDrawing = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Handwriting?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, "userInfo", auth.currentUser.uid, "handwritingInfo", id)
              );
              setDrawings(drawings.filter((drawing) => drawing.id !== id));
              Alert.alert(
                "Handwriting Deleted",
                "The handwriting has been deleted successfully."
              );
            } catch (error) {
              console.error("Error deleting handwriting:", error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the handwriting."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderDrawings = () => {
    const rows = [];
    for (let i = 0; i < drawings.length; i += 2) {
      const drawing1 = drawings[i];
      const drawing2 = drawings[i + 1];
      rows.push(
        <View key={i} style={styles.row}>
          {drawing1 && (
            <TouchableOpacity
              style={styles.drawingContainer}
              onPress={() => handlePressDrawing(drawing1)}
            >
              <View style={styles.drawingWrapper}>
                <Text style={styles.drawingTitle}>{drawing1.title}</Text>
                <Svg
                  style={styles.drawing}
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${750} ${750}`}
                >
                  {drawing1.paths.map((path, index) => (
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
            </TouchableOpacity>
          )}
          {drawing2 && (
            <TouchableOpacity
              style={styles.drawingContainer}
              onPress={() => handlePressDrawing(drawing2)}
            >
              <View style={styles.drawingWrapper}>
                <Text style={styles.drawingTitle}>{drawing2.title}</Text>
                <Svg
                  style={styles.drawing}
                  width="100%"
                  height="100%"
                  viewBox={`0 0 ${750} ${750}`}
                >
                  {drawing2.paths.map((path, index) => (
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
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return rows;
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
            <Text style={styles.deleteAllButtonText}>
              Delete All Handwritings
            </Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  drawingContainer: {
    backgroundColor: appConfig.COLORS.white,
    width: "48%", // Adjust as needed
  },
  drawingWrapper: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    overflow: "hidden",
    aspectRatio: 1, // Cuadrado
  },
  drawingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
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
