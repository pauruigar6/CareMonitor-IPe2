// TermsAndPoliciesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, FONTS } from "../constants/appConfig";
import { getDocs, collection, db } from "../utils/firebase-config";

const CustomHeader = ({ navigation }) => {
  const [userNameInitial, setUserNameInitial] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userInfo"));
        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          const initial = userData.name
            ? userData.name.charAt(0).toUpperCase()
            : "";
          setUserNameInitial(initial);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView
      style={{ height: 130, backgroundColor: COLORS.white }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          backgroundColor: COLORS.white,
          height: 100,
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            tintColor: COLORS.black,
            marginLeft: 10,
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.black,
          }}
        >
          Care Monitor
        </Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AccountScreen")}
          >
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: COLORS.primary,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 18 }}>
                {userNameInitial}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const TermsAndPoliciesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text
          style={{ ...FONTS.h1, color: COLORS.black, marginTop: 0 }}
        >
          Terms and Policies
        </Text>

        <Text style={styles.sectionHeading}>1. Terms of Service</Text>
        <Text style={styles.paragraph}>
          By using Care Monitor, you agree to comply with our Terms of
          Service. This includes, but is not limited to:
        </Text>
        <Text style={styles.listItem}>
          - Using the application to monitor and manage personal health data.
        </Text>
        <Text style={styles.listItem}>
          - Accepting responsibility for any actions taken using the application.
        </Text>
        <Text style={styles.listItem}>
          - Agreeing to comply with all applicable laws and regulations.
        </Text>
        <Text style={styles.listItem}>
          - Compliance with any additional terms and conditions provided by Care Monitor.
        </Text>

        <Text style={styles.sectionHeading}>2. Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Our Privacy Policy describes
          how we collect, use, and protect your personal information
          when you use our application.
        </Text>
        <Text style={styles.paragraph}>
          We may collect personal information such as your name, email address, and health data.
          This information is used solely for the purpose of providing and improving our services.
          We do not share your personal information with third parties unless required by law or with your consent.
        </Text>

        <Text style={styles.sectionHeading}>3. Cookie Policy</Text>
        <Text style={styles.paragraph}>
          We use cookies to enhance your experience. Our Cookie Policy explains
          how we use cookies and similar technologies to provide you with a
          personalized and secure experience.
        </Text>
        <Text style={styles.paragraph}>
          Cookies are small pieces of data stored on your device.
          They help us analyze website traffic, personalize content, and
          provide targeted advertisements. You can choose to accept or decline cookies.
          Most web browsers automatically accept cookies, but you can usually modify
          your browser setting to decline cookies if you prefer.
        </Text>

        <Text style={styles.sectionHeading}>4. Refund Policy</Text>
        <Text style={styles.paragraph}>
          Refund policies for premium features may vary.
          Please review the specific refund policy before making a purchase within the application.
        </Text>
        <Text style={styles.paragraph}>
          In case of dissatisfaction with a premium feature, you may be eligible for a refund within a specific period.
          Please contact our customer support team for assistance regarding refunds.
        </Text>

        <Text style={styles.sectionHeading}>5. User Conduct</Text>
        <Text style={styles.paragraph}>
          When using Care Monitor, you agree to adhere to the following user conduct:
        </Text>
        <Text style={styles.listItem}>
          - Do not engage in any unlawful or prohibited activities.
        </Text>
        <Text style={styles.listItem}>
          - Respect the privacy and rights of other users.
        </Text>
        <Text style={styles.listItem}>
          - Do not upload or share any content that violates intellectual property rights.
        </Text>
        <Text style={styles.listItem}>
          - Refrain from using the application for fraudulent purposes.
        </Text>

        <Text style={styles.sectionHeading}>6. Disclaimer</Text>
        <Text style={styles.paragraph}>
          Care Monitor provides the application on an "as is" basis.
          We make no representations or warranties of any kind, express or implied,
          regarding the use or performance of the application.
          By using Care Monitor, you agree that any reliance on the application
          is at your own risk and discretion.
        </Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify, suspend, or discontinue any aspect
          of the application at any time without prior notice.
          We shall not be liable to you or any third party for any modification,
          suspension, or discontinuation of the application.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 18,
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
  listItem: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: SIZES.padding / 2,
    marginLeft: SIZES.padding * 2,
  },
});

export default TermsAndPoliciesScreen;
