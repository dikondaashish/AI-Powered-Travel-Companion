// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1kbWMMrK2DWCQnJQypLYfLiXgtagc1-g",
  authDomain: "ai---powered-travel-guide.firebaseapp.com",
  projectId: "ai---powered-travel-guide",
  storageBucket: "ai---powered-travel-guide.firebasestorage.app",
  messagingSenderId: "261479368396",
  appId: "1:261479368396:web:407d931420af8b0646a469",
  measurementId: "G-0LL87YD4JZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app)