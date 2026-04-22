import { Link } from "react-router-dom";
import { Eye, PencilLine, PauseCircle, Repeat2 } from "lucide-react";

function StatusBadge({ status }) {
  return (
    <span className="theme-status-active rounded-full px-3 py-1 text-xs font-bold">
      {status === "active" ? "نشط" : status || "-"}
    </span>
  );
}

function ActionLink({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-2 py-1 text-xs font-bold text-slate-700 transition hover:border-[var(--border-gold)] hover:bg-[var(--gold-surface)] hover:text-[var(--gold-dark)]"
    >
      <Icon size={13} />
      <span>{label}</span>
    </Link>
  );
}

export default function StudentsTable({ students }) {
  return (
    <section className="theme-table-shell hidden xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الاسم</th>
              <th className="px-5 py-4 font-bold">الهاتف</th>
              <th className="px-5 py-4 font-bold">النوع</th>
              <th className="px-5 py-4 font-bold">ولي الأمر</th>
              <th className="px-5 py-4 font-bold">المستوى</th>
              <th className="px-5 py-4 font-bold">الحلقة</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
              <th className="px-5 py-4 font-bold">الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className={index !== students.length - 1 ? "border-b" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{student.fullName || "-"}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{student.phone || "-"}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{student.gender === "female" ? "أنثى" : "ذكر"}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{student.guardianName || "-"}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{student.levelName || "-"}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{student.className || "-"}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={student.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <ActionLink to={`/students/${student.id}`} label="تفاصيل" icon={Eye} />
                    <ActionLink to={`/students/${student.id}/edit`} label="تعديل" icon={PencilLine} />
                    <ActionLink to={`/students/${student.id}/freeze`} label="تجميد" icon={PauseCircle} />
                    <ActionLink to={`/students/${student.id}/transfer`} label="نقل" icon={Repeat2} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
