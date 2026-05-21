import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, Timestamp, getDoc, setDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser,
} from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVHJwDgSyeAg3Xtv0OllEkuAUdBFZ-eww",
  authDomain: "taxi-management-4f300.firebaseapp.com",
  projectId: "taxi-management-4f300",
  storageBucket: "taxi-management-4f300.firebasestorage.app",
  messagingSenderId: "438222063680",
  appId: "1:438222063680:web:1f19e4e07c01e261ebf7a5",
  measurementId: "G-4CF7P90X47"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export {
  app, db, auth, analytics,
  collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, Timestamp, getDoc, setDoc,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail,
  type FirebaseUser,
};
