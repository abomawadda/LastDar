import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import { hasPermission } from "../../../lib/utils/permissions";
import {
  createMemorizationRecord,
  deleteMemorizationRecord,
  fetchMemorizationRecords,
  updateMemorizationRecord
} from "../services/memorization.service";

function validateMemorizationPayload(payload) {
  if (!payload.studentName?.trim()) return "اسم الطالب مطلوب.";
  if (!payload.className?.trim()) return "اسم الحلقة مطلوب.";
  if (!payload.currentSurah?.trim()) return "اسم السورة مطلوب.";
  if (!payload.ayahRange?.trim()) return "نطاق الآيات مطلوب.";
  if (!payload.target?.trim()) return "المستهدف القادم مطلوب.";
  return "";
}

export function useMemorization() {
  const { role } = useAuth();
  const toast = useToast();

  const canRead = hasPermission(role, "memorization.read") || hasPermission(role, "memorization.write");
  const canWrite = hasPermission(role, "memorization.write");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!canRead) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchMemorizationRecords();
      setRecords(data);
    } catch (err) {
      console.error(err);
      const message = "تعذر تحميل بيانات التسميع.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [canRead, toast]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function addRecord(payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية إضافة سجلات التسميع.");
      return { ok: false };
    }

    const validationMessage = validateMemorizationPayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await createMemorizationRecord(payload);
      await loadRecords();
      toast.success("تمت إضافة سجل التسميع.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر إضافة سجل التسميع.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function editRecord(target, payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية تعديل سجلات التسميع.");
      return { ok: false };
    }

    const validationMessage = validateMemorizationPayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await updateMemorizationRecord(target, payload);
      await loadRecords();
      toast.success("تم تعديل سجل التسميع.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر تعديل سجل التسميع.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function removeRecord(target) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية حذف سجلات التسميع.");
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      const result = await deleteMemorizationRecord(target);
      await loadRecords();
      if (result.reason === "virtual") {
        toast.info("هذا سجل افتراضي مشتق من بيانات الطلاب، لا يمكن حذفه مباشرة.");
      } else {
        toast.success("تم حذف سجل التسميع.");
      }
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر حذف سجل التسميع.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  const classOptions = useMemo(() => {
    const unique = Array.from(new Set(records.map((item) => item.className)));
    return ["all", ...unique];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((item) => {
      const classMatches = classFilter === "all" || item.className === classFilter;
      if (!classMatches) return false;
      if (!query) return true;

      return [item.studentName, item.className, item.currentSurah, item.target]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [records, search, classFilter]);

  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      excellent: filteredRecords.filter((item) => item.evaluation === "excellent").length,
      good: filteredRecords.filter((item) => item.evaluation === "good").length,
      needsWork: filteredRecords.filter((item) => item.evaluation === "needs_work").length
    };
  }, [filteredRecords]);

  return {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    classFilter,
    setClassFilter,
    classOptions,
    filteredRecords,
    stats,
    addRecord,
    editRecord,
    removeRecord,
    reload: loadRecords
  };
}
