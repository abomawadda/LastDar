import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "firebase/auth";
import { auth } from "../../../lib/firebase/auth";

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export async function requestResetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function changeCurrentPassword(newPassword) {
  if (!auth.currentUser) {
    throw new Error("No authenticated user");
  }

  await updatePassword(auth.currentUser, newPassword);
}

