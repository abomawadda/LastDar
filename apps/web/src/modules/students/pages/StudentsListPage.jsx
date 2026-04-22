import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { useStudents } from "../hooks/useStudents";
import StudentStats from "../components/StudentStats";
import StudentsToolbar from "../components/StudentsToolbar";
import StudentsTable from "../components/StudentsTable";
import StudentsMobileCards from "../components/StudentsMobileCards";

export default function StudentsListPage() {
  const { filteredStudents, search, setSearch, loading, error, stats } = useStudents();

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="theme-chip mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <Users size={15} />
              <span>إدارة الطلاب</span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-4xl">قائمة الطلاب</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              متابعة بيانات الطلاب والبحث السريع حسب الاسم أو الهاتف أو ولي الأمر أو الحلقة.
            </p>
          </div>

          <Link
            to="/students/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2.5 text-sm font-extrabold text-[var(--gold-dark)] transition hover:bg-[#f9f1dc]"
          >
            <UserPlus size={16} />
            <span>إضافة طالب جديد</span>
          </Link>
        </div>
      </section>

      <StudentStats stats={stats} />
      <StudentsToolbar search={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل الطلاب...</div>
      ) : error ? (
        <div className="theme-surface rounded-3xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-5 text-center text-sm font-bold text-red-700">
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">لا توجد نتائج</h3>
          <p className="mt-2 text-sm text-slate-500">لا يوجد طلاب مطابقون لبحثك الحالي.</p>
        </div>
      ) : (
        <>
          <StudentsTable students={filteredStudents} />
          <StudentsMobileCards students={filteredStudents} />
        </>
      )}
    </div>
  );
}
