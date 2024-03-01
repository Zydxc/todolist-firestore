import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; //analytics stuff

const firebaseConfig = {
  apiKey: "AIzaSyDs04YFuz9Fzrvb1BPhh6Q92yiCwJNBmbc",
  authDomain: "test-2e490.firebaseapp.com",
  databaseURL: "https://test-2e490-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-2e490",
  storageBucket: "test-2e490.appspot.com",
  messagingSenderId: "677253046867",
  appId: "1:677253046867:web:f665cebb7bcc5b7d24dca6",
  measurementId: "G-85DFWTYT3M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)