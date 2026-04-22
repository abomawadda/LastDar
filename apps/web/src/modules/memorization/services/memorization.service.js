import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";

function normalizeEvaluation(value) {
  if (value === "excellent" || value === "good" || value === "needs_work") return value;
  return "good";
}

function normalizeMemorizationDoc(docId, raw, studentsById) {
  const student = studentsById.get(raw.studentId);

  return {
    id: docId,
    studentId: raw.studentId || student?.id || "",
    studentName: raw.studentName || student?.fullName || "غير محدد",
    className: raw.className || student?.education?.classId || "غير محدد",
    level: raw.level || student?.education?.levelId || "beginner",
    currentSurah: raw.currentSurah || "غير محدد",
    ayahRange: raw.ayahRange || "-",
    evaluation: normalizeEvaluation(raw.evaluation),
    revisionState: raw.revisionState || "متوسط",
    target: raw.target || student?.education?.memorizationAmount || "غير محدد",
    source: "db"
  };
}

function synthesizeFromStudents(students) {
  return students.map((student) => ({
    id: `virtual_${student.id}`,
    studentId: student.id,
    studentName: student.fullName || "غير محدد",
    className: student.education?.classId || "غير محدد",
    level: student.education?.levelId || "beginner",
    currentSurah: "غير محدد",
    ayahRange: "-",
    evaluation: "good",
    revisionState: "متوسط",
    target: student.education?.memorizationAmount || "غير محدد",
    source: "virtual"
  }));
}

function normalizePayload(payload) {
  return {
    studentId: payload.studentId || "",
    studentName: payload.studentName?.trim() || "غير محدد",
    className: payload.className?.trim() || "غير محدد",
    level: payload.level || "beginner",
    currentSurah: payload.currentSurah?.trim() || "",
    ayahRange: payload.ayahRange?.trim() || "",
    evaluation: normalizeEvaluation(payload.evaluation),
    revisionState: payload.revisionState?.trim() || "",
    target: payload.target?.trim() || "",
    updatedAt: serverTimestamp()
  };
}

export async function fetchMemorizationRecords() {
  const [studentsSnapshot, memorizationSnapshot] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.STUDENTS)),
    getDocs(collection(db, COLLECTIONS.MEMORIZATION))
  ]);

  const students = studentsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  const studentsById = new Map(students.map((item) => [item.id, item]));

  const records = memorizationSnapshot.docs.map((docItem) =>
    normalizeMemorizationDoc(docItem.id, docItem.data(), studentsById)
  );

  if (records.length > 0) {
    return records;
  }

  return synthesizeFromStudents(students);
}

export async function createMemorizationRecord(payload) {
  const normalized = {
    ...normalizePayload(payload),
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.MEMORIZATION), normalized);

  return {
    id: ref.id,
    ...normalized,
    source: "db"
  };
}

export async function updateMemorizationRecord(record, payload) {
  if (record.source !== "db") {
    return createMemorizationRecord({
      ...record,
      ...payload,
      studentId: record.studentId
    });
  }

  const normalized = normalizePayload(payload);
  await updateDoc(doc(db, COLLECTIONS.MEMORIZATION, record.id), normalized);

  return {
    id: record.id,
    ...normalized,
    source: "db"
  };
}

export async function deleteMemorizationRecord(record) {
  if (record.source !== "db") {
    return { deleted: false, reason: "virtual" };
  }

  await deleteDoc(doc(db, COLLECTIONS.MEMORIZATION, record.id));
  return { deleted: true };
}
