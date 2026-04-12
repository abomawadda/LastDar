import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { useGuardians } from "../hooks/useGuardians";
import GuardianStats from "../components/GuardianStats";
import GuardiansToolbar from "../components/GuardiansToolbar";
import GuardiansTable from "../components/GuardiansTable";
import GuardiansMobileCards from "../components/GuardiansMobileCards";

export default function GuardiansListPage() {
  const {
    filteredGuardians,
    search,
    setSearch,
    loading,
    error,
    stats
  } = useGuardians();

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Users size={16} />
              <span>إدارة أولياء الأمور</span>
            </div>

            <h1 className="m-0 text-2xl font-extrabold sm:text-4xl">
              لوحة أولياء الأمور
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
              إدارة ملفات أولياء الأمور وربطهم لاحقًا بالأبناء تلقائيًا عبر رقم الموبايل.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/guardians/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 transition hover:bg-amber-300"
            >
              <UserPlus size={16} />
              <span>إضافة ولي أمر</span>
            </Link>
          </div>
        </div>
      </section>

      <GuardianStats stats={stats} />
      <GuardiansToolbar search={search} onSearchChange={setSearch} />

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-bold text-slate-500">جاري تحميل البيانات...</p>
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
          <p className="m-0 text-sm font-bold text-red-700">{error}</p>
        </div>
      ) : filteredGuardians.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
          <h3 className="m-0 text-xl font-extrabold text-slate-900">لا توجد نتائج</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            لم يتم العثور على أولياء أمور مطابقين للبحث الحالي.
          </p>
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