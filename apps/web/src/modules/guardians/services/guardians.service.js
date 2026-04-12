import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";

function normalizePhone(value) {
  if (!value) return "";

  let phone = String(value).trim();

  // تحويل الأرقام العربية إلى إنجليزية
  phone = phone.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

  // إزالة كل الرموز غير الرقمية
  phone = phone.replace(/\D/g, "");

  // إزالة 0020
  if (phone.startsWith("0020")) {
    phone = phone.slice(4);
  }

  // إزالة 20
  if (phone.startsWith("20")) {
    phone = phone.slice(2);
  }

  // استكمال الصفر في البداية إن لزم
  if (!phone.startsWith("01") && phone.length === 10) {
    phone = `0${phone}`;
  }

  return phone;
}

function normalizeGuardianPayload(data) {
  const normalizedPhone = normalizePhone(data.phone);
  const normalizedAlternatePhone = normalizePhone(data.alternatePhone);

  return {
    fullName: data.fullName?.trim() || "",
    phone: normalizedPhone,
    phoneNormalized: normalizedPhone,
    alternatePhone: normalizedAlternatePhone,
    relationType: data.relationType || "",
    email: data.email?.trim() || "",
    nationalId: data.nationalId?.trim() || "",
    address: data.address?.trim() || "",
    jobTitle: data.jobTitle?.trim() || "",
    preferredContactMethod: data.preferredContactMethod || "phone",
    status: "active",
    authUid: "",
    childrenIds: [],
    childrenCount: 0,
    notes: data.notes?.trim() || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

export async function createGuardian(data) {
  const payload = normalizeGuardianPayload(data);
  const ref = await addDoc(collection(db, COLLECTIONS.GUARDIANS), payload);

  return {
    id: ref.id,
    ...payload
  };
}

export async function getGuardians() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.GUARDIANS));

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
}

async function findGuardianByNormalizedPhone(normalizedPhone) {
  const q = query(
    collection(db, COLLECTIONS.GUARDIANS),
    where("phoneNormalized", "==", normalizedPhone)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const found = snapshot.docs[0];
  return {
    id: found.id,
    ...found.data()
  };
}

async function findGuardianByLegacyPhone(normalizedPhone) {
  const q = query(
    collection(db, COLLECTIONS.GUARDIANS),
    where("phone", "==", normalizedPhone)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const found = snapshot.docs[0];

  // ترقية السجل القديم تلقائيًا
  await updateDoc(doc(db, COLLECTIONS.GUARDIANS, found.id), {
    phone: normalizedPhone,
    phoneNormalized: normalizedPhone,
    updatedAt: serverTimestamp()
  });

  return {
    id: found.id,
    ...found.data(),
    phone: normalizedPhone,
    phoneNormalized: normalizedPhone
  };
}

export async function findGuardianByPhone(phone) {
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) return null;

  // 1) البحث الحديث
  const modernMatch = await findGuardianByNormalizedPhone(normalizedPhone);
  if (modernMatch) return modernMatch;

  // 2) fallback للسجلات القديمة
  const legacyMatch = await findGuardianByLegacyPhone(normalizedPhone);
  if (legacyMatch) return legacyMatch;

  return null;
}

export async function findOrCreateGuardianByPhone(data) {
  const existing = await findGuardianByPhone(data.phone);

  if (existing) {
    return {
      guardian: existing,
      created: false
    };
  }

  const createdGuardian = await createGuardian(data);

  return {
    guardian: createdGuardian,
    created: true
  };
}

export async function linkStudentToGuardian({ guardianId, studentId }) {
  const guardianRef = doc(db, COLLECTIONS.GUARDIANS, guardianId);
  const guardians = await getGuardians();
  const guardian = guardians.find((item) => item.id === guardianId);

  if (!guardian) {
    throw new Error("Guardian not found");
  }

  const currentChildrenIds = Array.isArray(guardian.childrenIds)
    ? guardian.childrenIds
    : [];

  const nextChildrenIds = currentChildrenIds.includes(studentId)
    ? currentChildrenIds
    : [...currentChildrenIds, studentId];

  await updateDoc(guardianRef, {
    childrenIds: nextChildrenIds,
    childrenCount: nextChildrenIds.length,
    updatedAt: serverTimestamp()
  });

  return {
    guardianId,
    studentId,
    childrenIds: nextChildrenIds
  };
}