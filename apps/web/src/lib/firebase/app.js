import { initializeApp } from "firebase/app";

const fallbackConfig = {
  apiKey: "AIzaSyB1Q9NezgrOmBXntnsuRsDbl7wYhGR5SwM",
  authDomain: "dar-monajat.firebaseapp.com",
  projectId: "dar-monajat",
  storageBucket: "dar-monajat.firebasestorage.app",
  messagingSenderId: "456661418454",
  appId: "1:456661418454:web:09fceec26594f57350e477"
};

function getEnv(name) {
  const value = import.meta.env[name];

  return value;
}

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || fallbackConfig.apiKey,
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || fallbackConfig.authDomain,
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || fallbackConfig.projectId,
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || fallbackConfig.storageBucket,
  messagingSenderId:
    getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || fallbackConfig.messagingSenderId,
  appId: getEnv("VITE_FIREBASE_APP_ID") || fallbackConfig.appId
};

export const firebaseApp = initializeApp(firebaseConfig);
