import { onValue, ref } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { database } from "./firebase.js";

const valueElement = document.getElementById("water-temp-value");
const statusElement = document.getElementById("water-temp-status");
const updatedElement = document.getElementById("water-temp-updated");
const dot = document.getElementById("water-temp-dot");

onValue(
  ref(database, "sensor/temperature"),
  (snapshot) => {
    const value = snapshot.val();
    const hasValue = value !== null && value !== undefined && value !== "";
    const isValidValue = hasValue && (typeof value === "string" || typeof value === "number");
    valueElement.textContent = isValidValue ? `${value} °C` : "—";
    statusElement.textContent = isValidValue
      ? "Live sensor reading"
      : hasValue
        ? "Invalid sensor value"
        : "Waiting for sensor data";
    updatedElement.textContent = isValidValue
      ? `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : hasValue
        ? "Expected a number or text value."
        : "No temperature has been reported yet.";
    dot.classList.toggle("is-live", isValidValue);
    dot.classList.remove("is-error");
  },
  (error) => {
    valueElement.textContent = "—";
    statusElement.textContent = "Unable to read sensor data";
    updatedElement.textContent = "Check your connection or Firebase database rules.";
    dot.classList.add("is-error");
    console.error("Temperature subscription failed:", error);
  }
);
