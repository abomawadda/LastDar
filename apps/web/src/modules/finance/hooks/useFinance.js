import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import { hasPermission } from "../../../lib/utils/permissions";
import {
  createInvoice,
  createPayment,
  deleteInvoice,
  deletePayment,
  fetchFinanceOverview,
  updateInvoice
} from "../services/finance.service";

function validateInvoicePayload(payload) {
  if (!payload.studentName?.trim()) return "اسم الطالب مطلوب في الفاتورة.";
  if (!payload.month?.trim()) return "الفترة مطلوبة.";

  const dueAmount = Number(payload.dueAmount);
  const paidAmount = Number(payload.paidAmount);

  if (!Number.isFinite(dueAmount) || dueAmount < 0) return "قيمة المستحق غير صحيحة.";
  if (!Number.isFinite(paidAmount) || paidAmount < 0) return "قيمة المدفوع غير صحيحة.";
  if (paidAmount > dueAmount && dueAmount > 0) return "المدفوع لا يجب أن يتجاوز المستحق.";

  return "";
}

function validatePaymentPayload(payload) {
  if (!payload.studentName?.trim()) return "اسم الطالب مطلوب في التحصيل.";
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "قيمة التحصيل يجب أن تكون أكبر من صفر.";
  if (!payload.method?.trim()) return "طريقة الدفع مطلوبة.";
  return "";
}

export function useFinance() {
  const { role } = useAuth();
  const toast = useToast();

  const canRead = hasPermission(role, "finance.read") || hasPermission(role, "finance.write");
  const canWrite = hasPermission(role, "finance.write");

  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadFinance = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!canRead) {
      setInvoices([]);
      setPayments([]);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchFinanceOverview();
      setInvoices(data.invoices);
      setPayments(data.payments);
    } catch (err) {
      console.error(err);
      const message = "تعذر تحميل البيانات المالية.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [canRead, toast]);

  useEffect(() => {
    loadFinance();
  }, [loadFinance]);

  async function addInvoice(payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية إضافة الفواتير.");
      return { ok: false };
    }

    const validationMessage = validateInvoicePayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await createInvoice(payload);
      await loadFinance();
      toast.success("تمت إضافة الفاتورة.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر إضافة الفاتورة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function editInvoice(target, payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية تعديل الفواتير.");
      return { ok: false };
    }

    const validationMessage = validateInvoicePayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await updateInvoice(target, payload);
      await loadFinance();
      toast.success("تم تعديل الفاتورة.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر تعديل الفاتورة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function removeInvoice(target) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية حذف الفواتير.");
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      const result = await deleteInvoice(target);
      await loadFinance();
      if (result.reason === "virtual") {
        toast.info("الفاتورة الافتراضية لا تُحذف مباشرة، عدّل بيانات الطالب أو أنشئ فاتورة فعلية.");
      } else {
        toast.success("تم حذف الفاتورة.");
      }
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر حذف الفاتورة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function addPayment(payload, linkedInvoice) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية إضافة التحصيلات.");
      return { ok: false };
    }

    const validationMessage = validatePaymentPayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await createPayment({ payload, linkedInvoice });
      await loadFinance();
      toast.success("تمت إضافة التحصيل.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر إضافة عملية التحصيل.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function removePayment(payment) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية حذف التحصيلات.");
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await deletePayment(payment);
      await loadFinance();
      toast.success("تم حذف التحصيل.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر حذف عملية التحصيل.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invoices.filter((item) => {
      const statusMatches = statusFilter === "all" || item.status === statusFilter;
      if (!statusMatches) return false;
      if (!query) return true;

      return [item.studentName, item.guardianName, item.month]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [invoices, search, statusFilter]);

  const stats = useMemo(() => {
    const totalDue = invoices.reduce((sum, item) => sum + item.dueAmount, 0);
    const totalPaid = invoices.reduce((sum, item) => sum + item.paidAmount, 0);

    return {
      totalDue,
      totalPaid,
      outstanding: Math.max(totalDue - totalPaid, 0),
      unpaidCount: invoices.filter((item) => item.status === "unpaid").length
    };
  }, [invoices]);

  return {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredInvoices,
    payments,
    stats,
    addInvoice,
    editInvoice,
    removeInvoice,
    addPayment,
    removePayment,
    reload: loadFinance
  };
}
