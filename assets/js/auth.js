import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { auth } from "./firebase.js";

const page = document.body.dataset.page;
const status = document.getElementById("auth-status");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

function showStatus(message, state = "error") {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
}

function authErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account already uses that email address.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/network-request-failed": "Could not reach the sign-in service. Check your connection.",
    "auth/weak-password": "Choose a password with at least 6 characters."
  };
  return messages[error.code] || "Authentication failed. Please try again.";
}

if (page === "login") {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.replace("home.html");
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await signInWithEmailAndPassword(
        auth,
        loginForm.elements.email.value.trim(),
        loginForm.elements.password.value
      );
      window.location.replace("home.html");
    } catch (error) {
      showStatus(authErrorMessage(error));
    } finally {
      button.disabled = false;
    }
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = signupForm.querySelector('button[type="submit"]');
    const password = signupForm.elements.password.value;
    if (password !== signupForm.elements.confirmPassword.value) {
      showStatus("The passwords do not match.");
      signupForm.elements.confirmPassword.focus();
      return;
    }

    button.disabled = true;
    try {
      await createUserWithEmailAndPassword(
        auth,
        signupForm.elements.email.value.trim(),
        password
      );
      window.location.replace("home.html");
    } catch (error) {
      showStatus(authErrorMessage(error));
    } finally {
      button.disabled = false;
    }
  });

  document.querySelectorAll("[data-auth-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const showSignup = button.dataset.authView === "signup";
      loginForm.hidden = showSignup;
      signupForm.hidden = !showSignup;
      status.hidden = true;
      (showSignup ? signupForm : loginForm).querySelector("input").focus();
    });
  });
}

if (page === "protected") {
  onAuthStateChanged(auth, (user) => {
    if (!user) window.location.replace("index.html");
    document.documentElement.dataset.authenticated = user ? "true" : "false";
  });
}

document.querySelectorAll("[data-logout]").forEach((button) => {
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await signOut(auth);
      window.location.replace("index.html");
    } catch (error) {
      showStatus("Could not sign out. Please try again.");
      button.disabled = false;
      console.error("Sign-out failed:", error);
    }
  });
});
