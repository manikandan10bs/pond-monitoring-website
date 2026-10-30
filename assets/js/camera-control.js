import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const cameraConfig = {
  apiKey: "AIzaSyDPF0buvrdwfw98qqronhLOc22kphEFmjs",
  authDomain: "waterponddata.firebaseapp.com",
  databaseURL: "https://waterponddata-default-rtdb.firebaseio.com",
  projectId: "waterponddata",
  storageBucket: "waterponddata.appspot.com",
  messagingSenderId: "503227899754",
  appId: "1:503227899754:web:a82f279b2ac91b2deb8f13",
  measurementId: "G-ZL8QTFHEL6"
};

const cameraApp = initializeApp(cameraConfig, "pond-camera-control");
const cameraDatabase = getDatabase(cameraApp);
const positionGrid = document.getElementById("position-grid");
const controlStatus = document.getElementById("control-status");
const streamImage = document.getElementById("camera-stream");
const streamPlaceholder = document.getElementById("camera-placeholder");
const streamInput = document.getElementById("stream-url");
let selectedPosition = null;

function announce(message, state = "success") {
  controlStatus.textContent = message;
  controlStatus.dataset.state = state;
  controlStatus.hidden = false;
}

function validateStreamUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  return ["http:", "https:"].includes(url.protocol) ? url.href : null;
}

function loadStream(value) {
  const url = validateStreamUrl(value);
  if (!url) {
    announce("Enter a valid camera stream URL beginning with http:// or https://.", "error");
    return;
  }
  localStorage.setItem("pond-camera-stream-url", url);
  streamPlaceholder.hidden = true;
  streamImage.hidden = false;
  streamImage.src = url;
}

streamImage.addEventListener("load", () => {
  announce("Camera stream connected.");
});

streamImage.addEventListener("error", () => {
  streamImage.hidden = true;
  streamPlaceholder.hidden = false;
  announce("Could not load the stream. Check the camera URL, network and mixed-content settings.", "error");
});

for (let position = 1; position <= 8; position += 1) {
  const button = document.createElement("button");
  button.className = "position-button";
  button.type = "button";
  button.textContent = String(position);
  button.setAttribute("aria-label", `Set camera position ${position}`);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await set(ref(cameraDatabase, "direction/position"), position);
      positionGrid.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", "true");
      selectedPosition = position;
      announce(`Camera position ${position} selected.`);
    } catch (error) {
      announce("Could not update the camera position. Check Firebase database rules.", "error");
      console.error("Camera position update failed:", error);
    } finally {
      button.disabled = false;
    }
  });
  positionGrid.append(button);
}

document.querySelectorAll("[data-direction]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (selectedPosition === null) {
      announce("Select a camera position before sending a direction.", "error");
      return;
    }
    try {
      await set(ref(cameraDatabase, "direction/move"), button.dataset.direction);
      announce(`Move ${button.dataset.direction} sent for position ${selectedPosition}.`);
    } catch (error) {
      announce("Could not send the movement command. Check Firebase database rules.", "error");
      console.error("Camera direction update failed:", error);
    }
  });
});

document.getElementById("save-stream").addEventListener("click", () => loadStream(streamInput.value.trim()));
streamInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadStream(streamInput.value.trim());
});

const savedStream = localStorage.getItem("pond-camera-stream-url");
if (savedStream) {
  streamInput.value = savedStream;
  loadStream(savedStream);
}
