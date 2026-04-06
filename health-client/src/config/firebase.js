// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpJaRNA07MFfwMT3knn-1MZemqsJP6-Js",
  authDomain: "health-51dbe.firebaseapp.com",
  projectId: "health-51dbe",
  storageBucket: "health-51dbe.appspot.com",
  messagingSenderId: "150851038186",
  appId: "1:150851038186:web:4415c05149233a9ac9a093",
  measurementId: "G-NFRXKJL2BB",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
