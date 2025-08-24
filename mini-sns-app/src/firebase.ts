import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA_qfhnjhOpy9sQ16XU5vRw0ocL17e9FEc",
  authDomain: "minisnsapp.firebaseapp.com",
  projectId: "minisnsapp",
  storageBucket: "minisnsapp.firebasestorage.app",
  messagingSenderId: "586324499986",
  appId: "1:586324499986:web:82c54f96df9c85e96382cb",
  measurementId: "G-DE7DLBN0T7",
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
