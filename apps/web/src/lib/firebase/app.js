import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB1Q9NezgrOmBXntnsuRsDbl7wYhGR5SwM",
  authDomain: "dar-monajat.firebaseapp.com",
  projectId: "dar-monajat",
  storageBucket: "dar-monajat.firebasestorage.app",
  messagingSenderId: "456661418454",
  appId: "1:456661418454:web:09fceec26594f57350e477"
};

export const firebaseApp = initializeApp(firebaseConfig);