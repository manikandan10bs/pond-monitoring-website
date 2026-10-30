import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWKnkzcElMsfS8RrZpLC5Hf-qx_hDsvSE",
  authDomain: "pond-water-monitoring.firebaseapp.com",
  databaseURL: "https://pond-water-monitoring-default-rtdb.firebaseio.com",
  projectId: "pond-water-monitoring",
  storageBucket: "pond-water-monitoring.firebasestorage.app",
  messagingSenderId: "10939313098",
  appId: "1:10939313098:web:55ac00863e41ed87363d33",
  measurementId: "G-HEEVW9LM5Y"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
