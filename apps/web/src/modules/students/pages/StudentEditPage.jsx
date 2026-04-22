import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Save } from "lucide-react";
import { useStudents } from "../hooks/useStudents";

export default function StudentEditPage() {
  const { studentId } = useParams();
  const { students, loading, error } = useStudents();

  const student = useMemo(() => students.find((item) => item.id === studentId), [students, studentId]);

  const [draft, setDraft] = useState({
    fullName: "",
    phone: "",
    guardianName: "",
    levelId: "",
    classId: ""
  });

  useEffect(() => {
    if (!student) return;

    setDraft({
      fullName: student.fullName || "",
      phone: student.phone || "",
      guardianName: student.guardian?.guardianName || student.guardianName || "",
      levelId: student.education?.levelId || student.levelName || "",
      classId: student.education?.classId || student.className || ""
    });
  }, [student]);

  if (loading) {
    return <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-red-700">{error}</div>;
  }

  if (!student) {
    return (
      <div className="theme-surface rounded-3xl p-6 text-center">
        <h2 className="text-lg font-extrabold text-slate-900">لم يتم العثور على الطالب</h2>
        <Link to="/students" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold text-slate-700">
          <ArrowRight size={14} />
          <span>العودة لقائمة الطلاب</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <h1 className="text-2xl font-extrabold sm:text-4xl">تعديل بيانات الطالب</h1>
        <p className="mt-2 text-sm text-white/85 sm:text-base">واجهة التعديل أصبحت بنفس نمط التطبيق المحمول السلس.</p>
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">بيانات أساسية</h2>
          <Link to={`/students/${student.id}`} className="text-xs font-bold text-[var(--gold-dark)]">عرض التفاصيل</Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الاسم الكامل</span>
            <input
              value={draft.fullName}
              onChange={(e) => setDraft((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">رقم الهاتف</span>
            <input
              value={draft.phone}
              onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">ولي الأمر</span>
            <input
              value={draft.guardianName}
              onChange={(e) => setDraft((prev) => ({ ...prev, guardianName: e.target.value }))}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المستوى / الحلقة</span>
            <input
              value={`${draft.levelId || "-"} / ${draft.classId || "-"}`}
              readOnly
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Link to={`/students/${student.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-center text-sm font-bold text-slate-700">
            إلغاء
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white"
          >
            <Save size={14} />
            <span>حفظ التعديل (قريبًا)</span>
          </button>
        </div>
      </section>
    </div>
  );
}
