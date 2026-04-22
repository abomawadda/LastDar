import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import { hasPermission } from "../../../lib/utils/permissions";
import {
  createAttendanceRecord,
  deleteAttendanceRecord,
  fetchAttendanceRecords,
  updateAttendanceStatus
} from "../services/attendance.service";

const today = new Date().toISOString().slice(0, 10);

function validateAttendancePayload(payload) {
  if (!payload.studentName?.trim()) return "اسم الطالب مطلوب.";
  if (!payload.className?.trim()) return "اسم الحلقة مطلوب.";
  return "";
}

export function useAttendance() {
  const { role } = useAuth();
  const toast = useToast();

  const canRead = hasPermission(role, "attendance.read") || hasPermission(role, "attendance.write");
  const canWrite = hasPermission(role, "attendance.write");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDate, setSelectedDate] = useState(today);

  const loadAttendance = useCallback(async (targetDate = selectedDate) => {
    setLoading(true);
    setError("");

    if (!canRead) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchAttendanceRecords({ date: targetDate });
      setRecords(data);
    } catch (err) {
      console.error(err);
      const message = "تعذر تحميل سجل الحضور.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [canRead, selectedDate, toast]);

  useEffect(() => {
    loadAttendance(selectedDate);
  }, [loadAttendance, selectedDate]);

  async function updateStatus(id, status) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية تعديل الحضور.");
      return;
    }

    const target = records.find((item) => item.id === id);
    if (!target) return;

    const previous = records;
    setRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    try {
      await updateAttendanceStatus({
        date: selectedDate,
        record: target,
        status
      });
      toast.success("تم تحديث حالة الحضور.");
    } catch (err) {
      console.error(err);
      setRecords(previous);
      const message = "تعذر حفظ حالة الحضور. حاول مرة أخرى.";
      setError(message);
      toast.error(message);
    }
  }

  async function addRecord(payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية إضافة سجلات حضور.");
      return { ok: false };
    }

    const validationMessage = validateAttendancePayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await createAttendanceRecord({ date: selectedDate, payload });
      await loadAttendance(selectedDate);
      toast.success("تمت إضافة سجل الحضور.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر إضافة سجل حضور.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function removeRecord(record) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية حذف السجلات.");
      return { ok: false };
    }

    if (record.source !== "db") {
      toast.info("لا يمكن حذف سجل افتراضي.");
      return { ok: true };
    }

    setSaving(true);
    setError("");

    try {
      await deleteAttendanceRecord(record);
      await loadAttendance(selectedDate);
      toast.success(record.studentId ? "تمت إعادة ضبط السجل." : "تم حذف السجل.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر حذف السجل.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  const classes = useMemo(() => {
    const map = new Map();

    records.forEach((item) => {
      if (!map.has(item.classId)) {
        map.set(item.classId, { id: item.classId, label: item.className });
      }
    });

    return [{ id: "all", label: "كل الحلقات" }, ...Array.from(map.values())];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((item) => {
      const classMatches = selectedClass === "all" || item.classId === selectedClass;
      if (!classMatches) return false;

      if (!query) return true;
      return [item.studentName, item.className]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [records, search, selectedClass]);

  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      present: filteredRecords.filter((item) => item.status === "present").length,
      late: filteredRecords.filter((item) => item.status === "late").length,
      absent: filteredRecords.filter((item) => item.status === "absent").length,
      excused: filteredRecords.filter((item) => item.status === "excused").length
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
    selectedClass,
    setSelectedClass,
    selectedDate,
    setSelectedDate,
    classes,
    filteredRecords,
    stats,
    updateStatus,
    addRecord,
    removeRecord,
    reload: loadAttendance
  };
}
