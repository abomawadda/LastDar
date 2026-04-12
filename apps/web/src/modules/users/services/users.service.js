import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";

const DEMO_ROLE_MAP = {
  "admin@dar.te": {
    fullName: "مدير النظام",
    role: "admin"
  },
  "teacher@dar.te": {
    fullName: "محفظ تجريبي",
    role: "teacher"
  },
  "parent@dar.te": {
    fullName: "ولي أمر تجريبي",
    role: "parent"
  },
  "student@dar.te": {
    fullName: "طالب تجريبي",
    role: "student"
  }
};

function getDefaultUserProfile(firebaseUser) {
  const email = firebaseUser?.email?.toLowerCase?.() || "";
  const mapped = DEMO_ROLE_MAP[email];

  if (mapped) {
    return mapped;
  }

  return {
    fullName: firebaseUser?.email || "مستخدم النظام",
    role: "admin"
  };
}

export async function syncUserProfile(firebaseUser) {
  if (!firebaseUser?.uid) return null;

  const ref = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const defaults = getDefaultUserProfile(firebaseUser);

    const payload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullName: defaults.fullName,
      role: defaults.role,
      branchId: "main",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(ref, payload);

    return {
      id: firebaseUser.uid,
      ...payload
    };
  }

  return {
    id: snap.id,
    ...snap.data()
  };
}

export async function getUserProfileByUid(uid) {
  if (!uid) return null;

  const ref = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}