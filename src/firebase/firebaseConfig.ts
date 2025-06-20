import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyBY_P7XCepmEiwmIEV86YPdupbJdDlJ-Io",
  authDomain: "baby-app-react-4a265.firebaseapp.com",
  projectId: "baby-app-react-4a265",
  storageBucket: "baby-app-react-4a265.firebasestorage.app",
  messagingSenderId: "905801082233",
  appId: "1:905801082233:web:3bd432ded61095f043bba8",
  measurementId: "G-YWH0SP556F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
