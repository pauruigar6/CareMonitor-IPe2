// PaintScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PaintScreen = () => {
  const [paths, setPaths] = useState([]);

  const handleTouchStart = event => {
    console.log("start")
    const { locationX, locationY } = event.nativeEvent;
    const newPaths = [...paths, { id: Date.now(), d: `M${locationX},${locationY}` }];
    setPaths(newPaths);
  };

  const handleTouchMove = event => {
    const { locationX, locationY } = event.nativeEvent;
    const id = paths.length - 1;
    const path = paths[id];
    const newPath = { ...path, d: `${path.d} L${locationX},${locationY}` };
    const newPaths = [...paths.slice(0, id), newPath];
    setPaths(newPaths);
  };

  return (
    <View style={styles.container}>
      <Svg style={styles.canvas}>
        {paths.map(path => (
          <Path key={path.id} d={path.d} fill="none" stroke="black" strokeWidth={2} />
        ))}
      </Svg>
      <View style={styles.touchArea} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  canvas: {
    flex: 1,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PaintScreen;
