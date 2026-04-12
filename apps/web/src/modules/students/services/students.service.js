import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";
import {
  findOrCreateGuardianByPhone,
  linkStudentToGuardian
} from "../../guardians/services/guardians.service";

function normalizeStudentPayload(data, guardian) {
  return {
    studentCode: data.studentCode?.trim() || "",

    fullName: data.fullName?.trim() || "",
    nationalId: data.nationalId?.trim() || "",
    birthDate: data.birthDate || "",
    age: typeof data.age === "number" ? data.age : null,
    gender: data.gender || "",
    governorate: data.governorate || "",

    phone: data.phone?.trim() || "",
    branchId: data.branchId || "main",
    status: data.status || "active",
    joinType: data.joinType || "regular",
    enrollmentDate: data.enrollmentDate || "",

    education: {
      levelId: data.levelId || "",
      classId: data.classId || "",
      memorizationAmount: data.memorizationAmount?.trim() || "",
      academicNotes: data.academicNotes?.trim() || ""
    },

    health: {
      chronicDiseaseDetails: data.chronicDiseaseDetails?.trim() || "",
      allergyDetails: data.allergyDetails?.trim() || "",
      medications: data.medications?.trim() || "",
      specialNeeds: data.specialNeeds?.trim() || "",
      healthNotes: data.healthNotes?.trim() || ""
    },

    communication: {
      address: data.address?.trim() || "",
      area: data.area?.trim() || "",
      landmark: data.landmark?.trim() || ""
    },

    guardian: {
      guardianId: guardian?.id || "",
      guardianName: guardian?.fullName || data.guardianName?.trim() || "",
      guardianPhone: guardian?.phone || data.guardianPhone?.trim() || "",
      relation: guardian?.relationType || data.guardianRelation || "father"
    },

    father: {
      fullName: data.fatherName?.trim() || "",
      phone: data.fatherPhone?.trim() || "",
      nationalId: data.fatherNationalId?.trim() || "",
      jobTitle: data.fatherJobTitle?.trim() || ""
    },

    mother: {
      fullName: data.motherName?.trim() || "",
      phone: data.motherPhone?.trim() || "",
      jobTitle: data.motherJobTitle?.trim() || ""
    },

    emergencyContact: {
      fullName: data.emergencyContactName?.trim() || "",
      phone: data.emergencyContactPhone?.trim() || "",
      relation: data.emergencyContactRelation?.trim() || ""
    },

    admin: {
      notes: data.adminNotes?.trim() || ""
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

export async function createStudent(data) {
  let guardian = null;

  if (data.guardianPhone?.trim()) {
    const guardianResult = await findOrCreateGuardianByPhone({
      fullName: data.guardianName?.trim() || "ولي أمر",
      phone: data.guardianPhone?.trim(),
      alternatePhone: "",
      relationType: data.guardianRelation || "father",
      email: "",
      nationalId: "",
      address: data.address?.trim() || "",
      jobTitle: "",
      preferredContactMethod: "phone",
      notes: ""
    });

    guardian = guardianResult.guardian;
  }

  const payload = normalizeStudentPayload(data, guardian);
  const studentRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), payload);

  if (guardian?.id) {
    await linkStudentToGuardian({
      guardianId: guardian.id,
      studentId: studentRef.id
    });

    await updateDoc(doc(db, COLLECTIONS.STUDENTS, studentRef.id), {
      "guardian.guardianId": guardian.id,
      updatedAt: serverTimestamp()
    });
  }

  return {
    id: studentRef.id,
    ...payload
  };
}

export async function getStudents() {
  const snapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));

  return snapshot.docs.map((docItem) => {
    const raw = docItem.data();

    return {
      id: docItem.id,
      fullName: raw.fullName || "",
      phone: raw.phone || "",
      gender: raw.gender || "",
      status: raw.status || "",
      guardianName: raw.guardian?.guardianName || "",
      levelName: raw.education?.levelId || "",
      className: raw.education?.classId || "",
      ...raw
    };
  });
}