import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import appConfig from "../constants/appConfig";

const PaintScreen = () => {
  const [paths, setPaths] = useState([]);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [drawingError, setDrawingError] = useState("");

  const handleTouchStart = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPaths = [
      ...paths,
      { id: Date.now(), d: `M${locationX},${locationY}` },
    ];
    setPaths(newPaths);
  };

  const handleTouchMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const id = paths.length - 1;
    const path = paths[id];
    const newPath = { ...path, d: `${path.d} L${locationX},${locationY}` };
    const newPaths = [...paths.slice(0, id), newPath];
    setPaths(newPaths);
  };

  const handleTitleChange = (text) => {
    setTitle(text);
    setTitleError(""); // Reset title error when title changes
  };

  const handleCancelHandwriting = () => {
    setTitle("");
    setPaths([]);
    setTitleError("");
    setDrawingError("");
  };

  const handleAddPaint = async () => {
    if (paths.length === 0) {
      setDrawingError("Drawing is required");
      return;
    }
    if (paths.length != 0 && title.trim() === "") {
      setDrawingError("");
      setTitleError("Title is required");
      return;
    }
    if (paths.length != 0 && title.trim() !== "") {
      setDrawingError("");
      setTitleError("");
      return;
    }

    // Aquí puedes agregar la lógica para guardar el dibujo si es necesario
    console.log("handleAddPaint");
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...appConfig.FONTS.h1, color: appConfig.COLORS.black }}>
        New Handwriting
      </Text>
      <View style={styles.titleContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={handleTitleChange}
        />
        {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
      </View>
      <View style={styles.canvasContainer}>
        <Svg style={styles.canvas}>
          {paths.map((path) => (
            <Path
              key={path.id}
              d={path.d}
              fill="none"
              stroke="black"
              strokeWidth={2}
            />
          ))}
        </Svg>
        <View
          style={styles.touchArea}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />
      </View>
      {drawingError ? (
        <Text style={styles.errorText}>{drawingError}</Text>
      ) : null}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.cancelHandwritingButton}
          onPress={handleCancelHandwriting}
        >
          <Text style={styles.cancelHandwritingButtonText}>
            Cancel Handwriting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addHandwritingButton}
          onPress={handleAddPaint}
        >
          <Text style={styles.addHandwritingButtonText}>Save Handwriting</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appConfig.COLORS.background,
    padding: 16,
  },
  canvasContainer: {
    flex: 1,
    borderWidth: 1,
    borderBottomColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    marginTop: 50,
    marginBottom: 25,
  },
  addHandwritingButton: {
    marginTop: 50,
    backgroundColor: appConfig.COLORS.primary,
    borderRadius: 8,
    padding: 10,
    width: "45%",
  },
  addHandwritingButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 100,
  },
  cancelHandwritingButton: {
    marginTop: 50,
    paddingTop: 15,
    borderRadius: 8,
    padding: 10,
    width: "45%",
  },
  cancelHandwritingButtonText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 20, // Adjust the margin to align with the corresponding input
  },
});

export default PaintScreen;
