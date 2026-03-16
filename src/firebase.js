import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJE4xT5dbVpvNlCspKC-wB5Z1CSeuIdtE",
  authDomain: "live-bus-tracker-97d84.firebaseapp.com",
  projectId: "live-bus-tracker-97d84",
  storageBucket: "live-bus-tracker-97d84.firebasestorage.app",
  messagingSenderId: "415271245197",
  appId: "1:415271245197:web:d6cc60a7bebf78d3af59c4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);