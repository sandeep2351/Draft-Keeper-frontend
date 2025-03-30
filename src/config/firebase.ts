// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLLEdAr4fLKyYAW7iypmXFLdln-Lb_QR8",
  authDomain: "draft-keeper.firebaseapp.com",
  projectId: "draft-keeper",
  storageBucket: "draft-keeper.appspot.com", // ✅ FIXED domain
  messagingSenderId: "291793696270",
  appId: "1:291793696270:web:514dc8bf439d098bb0ee5f",
  measurementId: "G-ML4WQMTH8R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
