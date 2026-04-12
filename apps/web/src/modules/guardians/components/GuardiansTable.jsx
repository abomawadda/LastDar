const RELATION_LABELS = {
  father: "الأب",
  mother: "الأم",
  brother: "الأخ",
  sister: "الأخت",
  uncle: "العم",
  aunt: "العمة / الخالة",
  other: "أخرى"
};

export default function GuardiansTable({ guardians }) {
  return (
    <section className="hidden overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead className="bg-slate-50">
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الاسم</th>
              <th className="px-5 py-4 font-bold">الهاتف</th>
              <th className="px-5 py-4 font-bold">هاتف بديل</th>
              <th className="px-5 py-4 font-bold">صلة القرابة</th>
              <th className="px-5 py-4 font-bold">المهنة</th>
              <th className="px-5 py-4 font-bold">الأبناء</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
            </tr>
          </thead>

          <tbody>
            {guardians.map((guardian, index) => (
              <tr
                key={guardian.id}
                className={index !== guardians.length - 1 ? "border-b border-slate-100" : ""}
              >
                <td className="px-5 py-4 text-sm font-bold text-slate-900">
                  {guardian.fullName || "—"}
                </td>

                <td className="px-5 py-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                📱 {guardian.phone || "—"}
                </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {guardian.alternatePhone || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {RELATION_LABELS[guardian.relationType] || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {guardian.jobTitle || "—"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {guardian.childrenCount || 0}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-bold",
                      guardian.status === "active"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    ].join(" ")}
                  >
                    {guardian.status === "active" ? "نشط" : guardian.status || "—"}
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