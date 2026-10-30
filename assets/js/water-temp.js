import { onValue, ref } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { database } from "./firebase.js";

const valueElement = document.getElementById("realtime-temp");
const statusElement = document.getElementById("temperature-status");
const dot = document.getElementById("temperature-dot");

onValue(
  ref(database, "sensor/temperature"),
  (snapshot) => {
    const value = snapshot.val();
    const hasValue = value !== null && value !== undefined && value !== "";
    valueElement.textContent = hasValue ? `${value} °C` : "Waiting for sensor";
    statusElement.textContent = hasValue
      ? `Last updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "The dashboard will update when the sensor sends a reading.";
    dot.classList.toggle("is-live", hasValue);
    dot.classList.remove("is-error");
  },
  (error) => {
    valueElement.textContent = "Unavailable";
    statusElement.textContent = "Could not read the sensor. Check your connection or database rules.";
    dot.classList.add("is-error");
    console.error("Temperature subscription failed:", error);
  }
);
