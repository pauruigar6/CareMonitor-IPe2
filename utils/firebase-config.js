import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  deleteDoc,
  collection,
  serverTimestamp,
  addDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhDgKZL8-NOwb4FKNQX0-TpE_aEAKJcQQ",
  authDomain: "caremonitor-xruizg03-c7bc3.firebaseapp.com",
  projectId: "caremonitor-xruizg03-c7bc3",
  storageBucket: "caremonitor-xruizg03-c7bc3.appspot.com",
  messagingSenderId: "455852542390",
  appId: "1:455852542390:web:901467d266eb0d2e355917",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(); // Inicializa Firestore

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  db,
  deleteDoc,
  collection,
  serverTimestamp,
  addDoc,
  doc,
  getDocs,
};
