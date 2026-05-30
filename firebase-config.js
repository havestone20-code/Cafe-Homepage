import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGtghFSIL_Qyf-MWlXnyH3xMpjJ-cj05g",
  authDomain: "my-cafe-project-4b8f3.firebaseapp.com",
  projectId: "my-cafe-project-4b8f3",
  storageBucket: "my-cafe-project-4b8f3.firebasestorage.app",
  messagingSenderId: "419783587562",
  appId: "1:419783587562:web:4a95ab1d101eea2bf2c993"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
