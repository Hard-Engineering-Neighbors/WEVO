// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1mSsqcMCgVM_JH6shUQceQZDTFwET3Dk",
  authDomain: "wevo-project.firebaseapp.com",
  projectId: "wevo-project",
  storageBucket: "wevo-project.firebasestorage.app",
  messagingSenderId: "748267571899",
  appId: "1:748267571899:web:df1e87482116da8bdb779e",
  measurementId: "G-SCRGNTE7D5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
