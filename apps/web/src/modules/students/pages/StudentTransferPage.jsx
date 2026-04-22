import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useStudents } from "../hooks/useStudents";

const BRANCH_OPTIONS = ["الفرع الرئيسي", "فرع دمياط"];
const CLASS_OPTIONS = ["حلقة الفجر 1", "حلقة العصر 1", "حلقة المغرب 1"];

export default function StudentTransferPage() {
  const { studentId } = useParams();
  const { students, loading, error } = useStudents();
  const student = students.find((item) => item.id === studentId);

  const [targetBranch, setTargetBranch] = useState(BRANCH_OPTIONS[0]);
  const [targetClass, setTargetClass] = useState(CLASS_OPTIONS[0]);
  const [reason, setReason] = useState("");

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
        <h1 className="text-2xl font-extrabold sm:text-4xl">نقل الطالب</h1>
        <p className="mt-2 text-sm text-white/85">نقل الطالب بين الفروع والحلقات مع توثيق سبب النقل.</p>
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900">{student.fullName}</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الفرع الجديد</span>
            <select
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            >
              {BRANCH_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الحلقة الجديدة</span>
            <select
              value={targetClass}
              onChange={(e) => setTargetClass(e.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="app-input md:col-span-2 px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">سبب النقل</span>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none"
              placeholder="اكتب سبب النقل..."
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
            <Repeat2 size={14} />
            <span>تنفيذ النقل (قريبًا)</span>
          </button>
        </div>
      </section>
    </div>
  );
}
