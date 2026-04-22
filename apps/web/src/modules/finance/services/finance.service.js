import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../../../lib/firebase/firestore";
import { COLLECTIONS } from "../../../constants/collections";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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

function computeInvoiceStatus(dueAmount, paidAmount) {
  if (paidAmount >= dueAmount) return "paid";
  if (paidAmount > 0) return "partial";
  return "unpaid";
}

function normalizeInvoice(docId, raw) {
  const dueAmount = toNumber(raw.dueAmount ?? raw.amount, 0);
  const paidAmount = toNumber(raw.paidAmount, 0);

  return {
    id: docId,
    studentId: raw.studentId || "",
    studentName: raw.studentName || "غير محدد",
    guardianName: raw.guardianName || "غير محدد",
    month: raw.month || "غير محدد",
    dueAmount,
    paidAmount,
    status: raw.status || computeInvoiceStatus(dueAmount, paidAmount),
    dueDate: toIsoDate(raw.dueDate),
    source: "db"
  };
}

function normalizePayment(docId, raw) {
  return {
    id: docId,
    studentName: raw.studentName || "غير محدد",
    amount: toNumber(raw.amount, 0),
    method: raw.method || raw.paymentMethod || "غير محدد",
    createdAt: toIsoDate(raw.createdAt),
    invoiceId: raw.invoiceId || ""
  };
}

function synthesizeInvoicesFromStudents(students) {
  const month = new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    year: "numeric"
  }).format(new Date());

  return students.map((student) => {
    const dueAmount = student.joinType === "scholarship" ? 0 : 450;

    return {
      id: `virtual_${student.id}`,
      studentId: student.id,
      studentName: student.fullName || "غير محدد",
      guardianName: student.guardian?.guardianName || student.guardianName || "غير محدد",
      month,
      dueAmount,
      paidAmount: 0,
      status: computeInvoiceStatus(dueAmount, 0),
      dueDate: "",
      source: "virtual"
    };
  });
}

function normalizeInvoicePayload(payload) {
  const dueAmount = toNumber(payload.dueAmount, 0);
  const paidAmount = toNumber(payload.paidAmount, 0);

  return {
    studentId: payload.studentId || "",
    studentName: payload.studentName?.trim() || "غير محدد",
    guardianName: payload.guardianName?.trim() || "غير محدد",
    month: payload.month?.trim() || "",
    dueAmount,
    paidAmount,
    status: payload.status || computeInvoiceStatus(dueAmount, paidAmount),
    dueDate: payload.dueDate || "",
    updatedAt: serverTimestamp()
  };
}

async function persistVirtualInvoice(invoice) {
  const payload = {
    ...normalizeInvoicePayload(invoice),
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.INVOICES), payload);
  return { id: ref.id, ...payload, source: "db" };
}

async function applyPaymentToInvoice(invoiceId, amountDelta) {
  const invoiceRef = doc(db, COLLECTIONS.INVOICES, invoiceId);
  const invoiceSnapshot = await getDoc(invoiceRef);
  if (!invoiceSnapshot.exists()) return;

  const invoice = normalizeInvoice(invoiceSnapshot.id, invoiceSnapshot.data());
  const nextPaid = Math.max(0, invoice.paidAmount + amountDelta);

  await updateDoc(invoiceRef, {
    paidAmount: nextPaid,
    status: computeInvoiceStatus(invoice.dueAmount, nextPaid),
    updatedAt: serverTimestamp()
  });
}

export async function fetchFinanceOverview() {
  const [invoicesSnapshot, paymentsSnapshot, studentsSnapshot] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.INVOICES)),
    getDocs(collection(db, COLLECTIONS.PAYMENTS)),
    getDocs(collection(db, COLLECTIONS.STUDENTS))
  ]);

  const invoices = invoicesSnapshot.docs.map((docItem) => normalizeInvoice(docItem.id, docItem.data()));
  const payments = paymentsSnapshot.docs
    .map((docItem) => normalizePayment(docItem.id, docItem.data()))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  if (invoices.length > 0) {
    return {
      invoices,
      payments
    };
  }

  const students = studentsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));

  return {
    invoices: synthesizeInvoicesFromStudents(students),
    payments
  };
}

export async function createInvoice(payload) {
  const normalized = {
    ...normalizeInvoicePayload(payload),
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.INVOICES), normalized);
  return { id: ref.id, ...normalized, source: "db" };
}

export async function updateInvoice(invoice, payload) {
  if (invoice.source !== "db") {
    return createInvoice({ ...invoice, ...payload });
  }

  const normalized = normalizeInvoicePayload(payload);
  await updateDoc(doc(db, COLLECTIONS.INVOICES, invoice.id), normalized);
  return { id: invoice.id, ...normalized, source: "db" };
}

export async function deleteInvoice(invoice) {
  if (invoice.source !== "db") {
    return { deleted: false, reason: "virtual" };
  }

  await deleteDoc(doc(db, COLLECTIONS.INVOICES, invoice.id));
  return { deleted: true };
}

export async function createPayment({ payload, linkedInvoice }) {
  let invoiceId = payload.invoiceId || "";

  if (linkedInvoice) {
    if (linkedInvoice.source === "db") {
      invoiceId = linkedInvoice.id;
    } else {
      const persisted = await persistVirtualInvoice(linkedInvoice);
      invoiceId = persisted.id;
    }
  }

  const normalized = {
    studentName: payload.studentName?.trim() || linkedInvoice?.studentName || "غير محدد",
    amount: toNumber(payload.amount, 0),
    method: payload.method?.trim() || "غير محدد",
    invoiceId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTIONS.PAYMENTS), normalized);

  if (invoiceId && normalized.amount > 0) {
    await applyPaymentToInvoice(invoiceId, normalized.amount);
  }

  return { id: ref.id, ...normalized };
}

export async function deletePayment(payment) {
  await deleteDoc(doc(db, COLLECTIONS.PAYMENTS, payment.id));

  if (payment.invoiceId && payment.amount > 0) {
    await applyPaymentToInvoice(payment.invoiceId, -toNumber(payment.amount, 0));
  }

  return { deleted: true };
}
