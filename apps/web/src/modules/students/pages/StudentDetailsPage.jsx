import { Link, useParams } from "react-router-dom";
import { ArrowRight, PencilLine, PauseCircle, Repeat2 } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import StudentProfileCard from "../components/StudentProfileCard";
import StudentProgressPanel from "../components/StudentProgressPanel";
import StudentFinancePanel from "../components/StudentFinancePanel";

function FallbackSkeleton() {
  return <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل بيانات الطالب...</div>;
}

export default function StudentDetailsPage() {
  const { studentId } = useParams();
  const { students, loading, error } = useStudents();

  const student = students.find((item) => item.id === studentId);

  if (loading) return <FallbackSkeleton />;

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-4xl">تفاصيل الطالب</h1>
            <p className="mt-2 text-sm text-white/85 sm:text-base">عرض الملف الكامل للطالب ومتابعة التقدم والمالية والإجراءات.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Link to="/students" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold hover:bg-white/20 sm:text-sm">
              <ArrowRight size={14} />
              <span>الرجوع</span>
            </Link>
            <Link to={`/students/${student.id}/edit`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-3 py-2 text-xs font-bold text-[var(--gold-dark)] sm:text-sm">
              <PencilLine size={14} />
              <span>تعديل</span>
            </Link>
            <Link to={`/students/${student.id}/freeze`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold hover:bg-white/20 sm:text-sm">
              <PauseCircle size={14} />
              <span>تجميد</span>
            </Link>
            <Link to={`/students/${student.id}/transfer`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold hover:bg-white/20 sm:text-sm">
              <Repeat2 size={14} />
              <span>نقل</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <StudentProfileCard student={student} />

        <div className="space-y-4">
          <StudentProgressPanel student={student} />
          <StudentFinancePanel student={student} />
        </div>
      </section>
    </div>
  );
}
