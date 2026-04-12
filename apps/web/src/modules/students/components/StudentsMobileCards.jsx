function StudentCard({ student }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
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
  );
}

export default function StudentsMobileCards({ students }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:hidden">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </section>
  );
}