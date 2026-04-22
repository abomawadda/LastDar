import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { useGuardians } from "../hooks/useGuardians";
import GuardianStats from "../components/GuardianStats";
import GuardiansToolbar from "../components/GuardiansToolbar";
import GuardiansTable from "../components/GuardiansTable";
import GuardiansMobileCards from "../components/GuardiansMobileCards";

export default function GuardiansListPage() {
  const { filteredGuardians, search, setSearch, loading, error, stats } = useGuardians();

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="theme-chip mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <Users size={15} />
              <span>إدارة أولياء الأمور</span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-4xl">قائمة أولياء الأمور</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              إدارة ملفات أولياء الأمور وربطهم بالأبناء ومتابعة بيانات التواصل والحالة.
            </p>
          </div>

          <Link
            to="/guardians/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2.5 text-sm font-extrabold text-[var(--gold-dark)] transition hover:bg-[#f9f1dc]"
          >
            <UserPlus size={16} />
            <span>إضافة ولي أمر</span>
          </Link>
        </div>
      </section>

      <GuardianStats stats={stats} />
      <GuardiansToolbar search={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل البيانات...</div>
      ) : error ? (
        <div className="theme-surface rounded-3xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-5 text-center text-sm font-bold text-red-700">
          {error}
        </div>
      ) : filteredGuardians.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">لا توجد نتائج</h3>
          <p className="mt-2 text-sm text-slate-500">لا يوجد أولياء أمور مطابقون لبحثك الحالي.</p>
        </div>
      ) : (
        <>
          <GuardiansTable guardians={filteredGuardians} />
          <GuardiansMobileCards guardians={filteredGuardians} />
        </>
      )}
    </div>
  );
}
