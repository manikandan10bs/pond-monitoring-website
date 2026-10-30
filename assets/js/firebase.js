import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDRh3-c-_CYTxdESpQK2sGl6Vi4g8LUMJQ",
  authDomain: "pond-water-monitoring.firebaseapp.com",
  databaseURL: "https://pond-water-monitoring-default-rtdb.firebaseio.com",
  projectId: "pond-water-monitoring",
  storageBucket: "pond-water-monitoring.firebasestorage.app",
  messagingSenderId: "10939313098",
  appId: "1:10939313098:web:a4c63f0cdf21e022363d33",
  measurementId: "G-8MEP7CYRQ7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(app);
  })
  .catch((error) => {
    console.error("Firebase Analytics support check failed:", error);
  });
