import { Link } from "react-router-dom";
import { UserPlus, Users } from "lucide-react";
import { useStudents } from "../hooks/useStudents";

export default function StudentsListPage() {
  const {
    filteredStudents,
    search,
    setSearch,
    loading,
    error,
    stats
  } = useStudents();

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <Users size={16} />
              <span>إدارة الطلاب</span>
            </div>

            <h1 className="m-0 text-2xl font-extrabold sm:text-4xl">
              لوحة الطلاب
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
              إدارة ملفات الطلاب، متابعة البيانات الأساسية، واستعراض القائمة بشكل
              احترافي متوافق مع الأجهزة اللوحية والموبايل.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/students/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-emerald-950 transition hover:bg-amber-300"
            >
              <UserPlus size={16} />
              <span>إضافة طالب جديد</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-semibold text-slate-500">إجمالي الطلاب</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{stats.total}</h3>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-semibold text-slate-500">الطلاب الذكور</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{stats.male}</h3>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-semibold text-slate-500">الطالبات</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{stats.female}</h3>
        </article>

        <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-semibold text-slate-500">الطلاب النشطون</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{stats.active}</h3>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="m-0 text-xl font-extrabold text-slate-900">قائمة الطلاب</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              يمكنك البحث بالاسم أو الهاتف أو ولي الأمر أو المستوى أو الحلقة.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن طالب..."
              className="w-full min-w-[220px] border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <p className="m-0 text-sm font-bold text-slate-500">جاري تحميل الطلاب...</p>
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
          <p className="m-0 text-sm font-bold text-red-700">{error}</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.03)]">
          <h3 className="m-0 text-xl font-extrabold text-slate-900">لا توجد نتائج</h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            لم يتم العثور على طلاب مطابقين للبحث الحالي.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredStudents.map((student) => (
            <article
              key={student.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="m-0 text-lg font-extrabold text-slate-900">
                    {student.fullName || "-"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {student.gender === "female" ? "أنثى" : "ذكر"}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  {student.status === "active" ? "نشط" : student.status || "—"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-bold text-slate-700">الهاتف: </span>
                  <span>{student.phone || "—"}</span>
                </div>

                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-bold text-slate-700">ولي الأمر: </span>
                  <span>{student.guardianName || "—"}</span>
                </div>

                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-bold text-slate-700">المستوى: </span>
                  <span>{student.levelName || "—"}</span>
                </div>

                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <span className="font-bold text-slate-700">الحلقة: </span>
                  <span>{student.className || "—"}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}