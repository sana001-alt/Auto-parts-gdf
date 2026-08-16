import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  getReactNativePersistence, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import configFromFile from "./firebase-applet-config.json";

const firebaseConfig = {
  apiKey: configFromFile?.apiKey || "AIzaSyAGYut7q3nCW-qSDPSldGSbxAjnna_-bvo",
  authDomain: configFromFile?.authDomain || "auto-parts-market-place-20312.firebaseapp.com",
  projectId: configFromFile?.projectId || "auto-parts-market-place-20312",
  storageBucket: configFromFile?.storageBucket || "auto-parts-market-place-20312.firebasestorage.app",
  messagingSenderId: configFromFile?.messagingSenderId || "751764116522",
  appId: configFromFile?.appId || "1:751764116522:web:c7eb06038e6a85337adf53"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: any;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const dbId = configFromFile?.firestoreDatabaseId;
const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

export { 
  app, 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
};
