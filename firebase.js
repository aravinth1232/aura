
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";





const firebaseConfig = {
  apiKey: "AIzaSyCT-HoX9P0tkspZqX6tfxXvji9FvgHYXUk",
  authDomain: "file-uploader-69ae3.firebaseapp.com",
  projectId: "file-uploader-69ae3",
  storageBucket: "file-uploader-69ae3.appspot.com",
  messagingSenderId: "641330604676",
  appId: "1:641330604676:web:3d874802667b57cd32b0d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const auth = getAuth(app) 
export const db = getFirestore(app) 