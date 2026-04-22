import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, PauseCircle } from "lucide-react";
import { useStudents } from "../hooks/useStudents";

const REASONS = ["تعثر في الحضور", "ظروف صحية", "ظروف مالية", "طلب ولي الأمر", "أخرى"];

export default function StudentFreezePage() {
  const { studentId } = useParams();
  const { students, loading, error } = useStudents();
  const student = students.find((item) => item.id === studentId);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");

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
      <section className="rounded-3xl border border-amber-200 bg-gradient-to-l from-amber-50 to-white p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-amber-900 sm:text-4xl">تجميد ملف الطالب</h1>
        <p className="mt-2 text-sm text-amber-800">تسجيل قرار التجميد بشكل واضح مع السبب والمتابعة.</p>
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900">{student.fullName}</h2>
        <p className="mt-1 text-sm text-slate-500">اختر سبب التجميد وأضف ملاحظات المتابعة.</p>

        <div className="mt-4 space-y-3">
          <label className="app-input block px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">سبب التجميد</span>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            >
              {REASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="app-input block px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">ملاحظات</span>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none"
              placeholder="اكتب ملاحظات القرار..."
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <Link to={`/students/${student.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-center text-sm font-bold text-slate-700">
            إلغاء
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-extrabold text-white"
          >
            <PauseCircle size={14} />
            <span>تجميد الطالب (قريبًا)</span>
          </button>
        </div>
      </section>
    </div>
  );
}
