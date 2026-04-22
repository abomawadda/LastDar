import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useToast } from "../../../app/providers/ToastProvider";
import { hasPermission } from "../../../lib/utils/permissions";
import {
  createClass,
  deleteClass,
  fetchClasses,
  updateClass
} from "../services/classes.service";

function validateClassPayload(payload) {
  if (!payload.name?.trim()) return "اسم الحلقة مطلوب.";
  if (!payload.teacher?.trim()) return "اسم المحفظ مطلوب.";
  if (!payload.branch?.trim()) return "الفرع مطلوب.";
  if (!payload.room?.trim()) return "القاعة مطلوبة.";
  if (!payload.schedule?.trim()) return "الجدول مطلوب.";

  const capacity = Number(payload.capacity);
  if (!Number.isFinite(capacity) || capacity < 1 || capacity > 200) {
    return "السعة يجب أن تكون بين 1 و 200.";
  }

  return "";
}

export function useClasses() {
  const { role } = useAuth();
  const toast = useToast();

  const canRead = hasPermission(role, "classes.read") || hasPermission(role, "classes.write");
  const canWrite = hasPermission(role, "classes.write");

  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!canRead) {
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
      const message = "تعذر تحميل بيانات الحلقات.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [canRead, toast]);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const filteredClasses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return classes.filter((item) => {
      const periodMatches = periodFilter === "all" || item.period === periodFilter;
      if (!periodMatches) return false;
      if (!query) return true;

      return [item.name, item.teacher, item.branch, item.room]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [classes, search, periodFilter]);

  const stats = useMemo(() => {
    const capacityTotal = classes.reduce((sum, item) => sum + Number(item.capacity || 0), 0);
    const studentsTotal = classes.reduce((sum, item) => sum + Number(item.studentsCount || 0), 0);

    return {
      total: classes.length,
      active: classes.filter((item) => item.status === "active").length,
      occupancy: capacityTotal ? Math.round((studentsTotal / capacityTotal) * 100) : 0,
      seatsRemaining: Math.max(capacityTotal - studentsTotal, 0)
    };
  }, [classes]);

  async function addClass(payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية إضافة الحلقات.");
      return { ok: false };
    }

    const validationMessage = validateClassPayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await createClass(payload);
      await loadClasses();
      toast.success("تمت إضافة الحلقة بنجاح.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر إضافة الحلقة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function editClass(targetClass, payload) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية تعديل الحلقات.");
      return { ok: false };
    }

    const validationMessage = validateClassPayload(payload);
    if (validationMessage) {
      setError(validationMessage);
      toast.error(validationMessage);
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      await updateClass({
        classId: targetClass.id,
        source: targetClass.source,
        payload
      });
      await loadClasses();
      toast.success("تم تعديل الحلقة بنجاح.");
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر تعديل الحلقة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  async function removeClass(targetClass) {
    if (!canWrite) {
      toast.error("ليس لديك صلاحية حذف الحلقات.");
      return { ok: false };
    }

    setSaving(true);
    setError("");

    try {
      const result = await deleteClass({
        classId: targetClass.id,
        source: targetClass.source
      });

      if (result.reason === "virtual") {
        toast.info("هذه حلقة افتراضية مشتقة من بيانات الطلاب، لا يمكن حذفها مباشرة.");
      } else {
        toast.success("تم حذف الحلقة بنجاح.");
      }

      await loadClasses();
      return { ok: true };
    } catch (err) {
      console.error(err);
      const message = "تعذر حذف الحلقة.";
      setError(message);
      toast.error(message);
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  return {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    periodFilter,
    setPeriodFilter,
    filteredClasses,
    stats,
    addClass,
    editClass,
    removeClass,
    reload: loadClasses
  };
}
