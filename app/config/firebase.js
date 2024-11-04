import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyAizQZeJe4czylbR8CXCH2aalDGvpRvJ9Q",
  authDomain: "bloging-app-ba99e.firebaseapp.com",
  projectId: "bloging-app-ba99e",
  storageBucket: "bloging-app-ba99e.appspot.com",
  messagingSenderId: "1080753195493",
  appId: "1:1080753195493:web:9c10628a54fe1eb177c70c",
  measurementId: "G-FCS5H35L7M"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize Firebase Storage

export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};
