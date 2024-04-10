// appConfig.js
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

export const FONTS = {
  h1: { fontWeight: 'bold', fontSize: 28, lineHeight: 36 },
  h2: { fontWeight: 'bold', fontSize: 20, lineHeight: 30 },
  h3: { fontWeight: 'bold', fontSize: 18, lineHeight: 22 },
  h4: { fontWeight: 'bold', fontSize: 16, lineHeight: 20 },
  body1: {fontSize: 28, lineHeight: 36 },
  body2: {fontSize: 20, lineHeight: 30 },
  body3: {fontSize: 18, lineHeight: 22 },
  body4: {fontSize: 12, lineHeight: 20 },
};

export const COLORS = {
  primary: '#7C9A92',
  white: "#FFFFFF",
  background: "#F4F4F4",
  modal: "#E9E9E9",
  gray: "#BEC2C2",
  darkolivegreen: "#556b2f",
  black: "#000000"
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 30,
  padding: 8,
  padding2: 12,
  padding3: 16,
  largeTitle: 50,
  width,
  height,
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
