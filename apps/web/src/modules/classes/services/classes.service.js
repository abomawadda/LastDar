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

function toIsoDate(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.toDate) {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeClassDoc(docId, raw, countsById, countsByName) {
  const id = docId;
  const name = raw.name || raw.className || raw.title || id;
  const autoCount = countsById.get(id) ?? countsByName.get(name) ?? 0;

  return {
    id,
    name,
    teacher: raw.teacher || raw.teacherName || "غير محدد",
    branch: raw.branch || raw.branchName || "غير محدد",
    room: raw.room || raw.roomName || "غير محدد",
    period: raw.period || raw.shift || "afternoon",
    schedule: raw.schedule || raw.scheduleText || "غير محدد",
    studentsCount: toNumber(raw.studentsCount, autoCount),
    capacity: toNumber(raw.capacity ?? raw.maxStudents, 20),
    status: raw.status || "active",
    nextSessionAt: toIsoDate(raw.nextSessionAt),
    source: "db"
  };
}

function synthesizeClassesFromStudents(students, countsById) {
  return Array.from(countsById.entries()).map(([classId, studentsCount]) => {
    const first = students.find((item) => item.education?.classId === classId);

    return {
      id: `virtual_${classId}`,
      classId,
      name: classId,
      teacher: "غير محدد",
      branch: first?.branchId || "غير محدد",
      room: "غير محدد",
      period: "afternoon",
      schedule: "غير محدد",
      studentsCount,
      capacity: 20,
      status: "active",
      nextSessionAt: "",
      source: "virtual"
    };
  });
}

function normalizeClassPayload(payload) {
  return {
    name: payload.name?.trim() || "",
    teacher: payload.teacher?.trim() || "",
    branch: payload.branch?.trim() || "",
    room: payload.room?.trim() || "",
    period: payload.period || "afternoon",
    schedule: payload.schedule?.trim() || "",
    capacity: toNumber(payload.capacity, 20),
    status: payload.status || "active",
    nextSessionAt: payload.nextSessionAt || "",
    updatedAt: serverTimestamp()
  };
}

export async function fetchClasses() {
  const [classesSnapshot, studentsSnapshot] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.CLASSES)),
    getDocs(collection(db, COLLECTIONS.STUDENTS))
  ]);

  const students = studentsSnapshot.docs.map((item) => item.data());
  const countsById = new Map();
  const countsByName = new Map();

  students.forEach((student) => {
    const classId = student.education?.classId;
    if (!classId) return;

    countsById.set(classId, (countsById.get(classId) || 0) + 1);
    countsByName.set(classId, (countsByName.get(classId) || 0) + 1);
  });

  const classes = classesSnapshot.docs.map((docItem) =>
    normalizeClassDoc(docItem.id, docItem.data(), countsById, countsByName)
  );

  if (classes.length > 0) {
    return classes;
  }

  return synthesizeClassesFromStudents(students, countsById);
}

export async function createClass(payload) {
  const normalized = {
    ...normalizeClassPayload(payload),
    studentsCount: 0,
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.CLASSES), normalized);

  return {
    id: ref.id,
    ...normalized,
    source: "db"
  };
}

export async function updateClass({ classId, payload, source = "db" }) {
  if (source !== "db") {
    return createClass(payload);
  }

  const normalized = normalizeClassPayload(payload);
  await updateDoc(doc(db, COLLECTIONS.CLASSES, classId), normalized);

  return {
    id: classId,
    ...normalized,
    source: "db"
  };
}

export async function deleteClass({ classId, source = "db" }) {
  if (source !== "db") {
    return { deleted: false, reason: "virtual" };
  }

  await deleteDoc(doc(db, COLLECTIONS.CLASSES, classId));
  return { deleted: true };
}
