import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";

function toDateString(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function normalizeAttendanceDoc(docId, raw) {
  return {
    id: docId,
    studentId: raw.studentId || "",
    studentName: raw.studentName || "غير محدد",
    className: raw.className || raw.classId || "غير محدد",
    classId: raw.classId || "",
    status: raw.status || "absent",
    date: toDateString(raw.date),
    source: "db"
  };
}

function buildRecordFromStudent(student, attendanceByStudentId, selectedDate) {
  const studentId = student.id;
  const attendance = attendanceByStudentId.get(studentId);

  return {
    id: attendance?.id || `${selectedDate}_${studentId}`,
    studentId,
    studentName: student.fullName || "غير محدد",
    className: student.education?.classId || "غير محدد",
    classId: student.education?.classId || "unknown",
    status: attendance?.status || "absent",
    date: selectedDate,
    source: attendance ? "db" : "virtual"
  };
}

export async function fetchAttendanceRecords({ date }) {
  const selectedDate = toDateString(date);

  const [studentsSnapshot, attendanceSnapshot] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.STUDENTS)),
    getDocs(query(collection(db, COLLECTIONS.ATTENDANCE), where("date", "==", selectedDate)))
  ]);

  const students = studentsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  const attendanceDocs = attendanceSnapshot.docs.map((docItem) => normalizeAttendanceDoc(docItem.id, docItem.data()));

  const attendanceByStudentId = new Map();
  attendanceDocs.forEach((item) => {
    if (item.studentId) {
      attendanceByStudentId.set(item.studentId, item);
    }
  });

  const recordsFromStudents = students.map((student) =>
    buildRecordFromStudent(student, attendanceByStudentId, selectedDate)
  );

  const orphanAttendanceRecords = attendanceDocs.filter(
    (item) => item.studentId && !students.some((student) => student.id === item.studentId)
  );

  const manualRecords = attendanceDocs.filter((item) => !item.studentId);

  const merged = [...recordsFromStudents, ...orphanAttendanceRecords, ...manualRecords];

  return merged.sort((a, b) => {
    if (a.className === b.className) {
      return a.studentName.localeCompare(b.studentName, "ar");
    }

    return a.className.localeCompare(b.className, "ar");
  });
}

export async function updateAttendanceStatus({ date, record, status }) {
  const selectedDate = toDateString(date);
  const studentKey = record.studentId || record.id || "unknown";
  const docId = `${selectedDate}_${studentKey}`;

  const payload = {
    date: selectedDate,
    studentId: record.studentId || "",
    studentName: record.studentName || "غير محدد",
    classId: record.classId || "unknown",
    className: record.className || "غير محدد",
    status,
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, COLLECTIONS.ATTENDANCE, docId), payload, { merge: true });

  return {
    id: docId,
    ...payload,
    source: "db"
  };
}

export async function createAttendanceRecord({ date, payload }) {
  const selectedDate = toDateString(date);

  const docPayload = {
    date: selectedDate,
    studentId: payload.studentId || "",
    studentName: payload.studentName?.trim() || "غير محدد",
    classId: payload.classId?.trim() || "manual",
    className: payload.className?.trim() || payload.classId?.trim() || "غير محدد",
    status: payload.status || "present",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.ATTENDANCE), docPayload);

  return {
    id: ref.id,
    ...docPayload,
    source: "db"
  };
}

export async function deleteAttendanceRecord(record) {
  if (!record?.id) return { deleted: false };

  await deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, record.id));
  return { deleted: true };
}
