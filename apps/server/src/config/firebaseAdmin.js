import admin from "firebase-admin";

let initialized = false;

export function getFirebaseAdmin() {
  if (!initialized && !admin.apps.length) {
    try {
      admin.initializeApp();
      initialized = true;
    } catch {
      initialized = false;
    }
  }

  return admin;
}

