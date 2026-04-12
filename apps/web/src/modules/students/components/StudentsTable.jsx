export default function StudentsTable({ students }) {
  return (
    <section className="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-slate-50">
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الاسم</th>
              <th className="px-5 py-4 font-bold">الهاتف</th>
              <th className="px-5 py-4 font-bold">النوع</th>
              <th className="px-5 py-4 font-bold">ولي الأمر</th>
              <th className="px-5 py-4 font-bold">المستوى</th>
              <th className="px-5 py-4 font-bold">الحلقة</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={student.id}
                className={index !== students.length - 1 ? "border-b border-slate-100" : ""}
              >
                <td className="px-5 py-4 text-sm font-bold text-slate-900">
                  {student.fullName || "—"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.phone || "—"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.gender === "female" ? "أنثى" : "ذكر"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.guardianName || "—"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.levelName || "—"}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.className || "—"}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    {student.status === "active" ? "نشط" : student.status || "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}