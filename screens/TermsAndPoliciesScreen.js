import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appConfig, { COLORS, SIZES, FONTS } from "../constants/appConfig";

const TermsAndPoliciesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text
          style={{ ...appConfig.FONTS.h1, color: COLORS.black, marginTop: 30 }}
        >
          Terms and Policies
        </Text>

        <Text style={styles.sectionHeading}>1. Terms of Service</Text>
        <Text style={styles.paragraph}>
          By using our parking app, you agree to comply with our Terms of
          Service. This includes the terms related to searching, booking, and
          using parking spaces through the app.
        </Text>

        <Text style={styles.sectionHeading}>2. Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is crucial to us. Our Privacy Policy outlines how we
          collect, use, and protect your personal information when you use our
          parking app.
        </Text>

        <Text style={styles.sectionHeading}>3. Cookie Policy</Text>
        <Text style={styles.paragraph}>
          We use cookies to enhance your experience. Our Cookie Policy explains
          how we use cookies and similar technologies to provide you with a
          personalized and secure parking app experience.
        </Text>

        <Text style={styles.sectionHeading}>4. Refund Policy</Text>
        <Text style={styles.paragraph}>
          Refund policies for parking reservations may vary by provider. Please
          review the specific parking provider's refund policy before confirming
          a reservation through our app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    padding: SIZES.padding * 2,
  },
  sectionHeading: {
    ...FONTS.h2,
    fontWeight: "bold",
    color: COLORS.black,
    marginVertical: SIZES.padding,
    marginTop: SIZES.padding * 3,
  },
  paragraph: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
});

export default TermsAndPoliciesScreen;
