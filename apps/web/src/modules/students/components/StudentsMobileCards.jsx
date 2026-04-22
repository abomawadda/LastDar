import { Link } from "react-router-dom";
import { Eye, PencilLine, PauseCircle, Repeat2 } from "lucide-react";

function ActionButton({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-[var(--border-gold)] hover:bg-[var(--gold-surface)] hover:text-[var(--gold-dark)]"
    >
      <Icon size={13} />
      <span>{label}</span>
    </Link>
  );
}

function StudentCard({ student }) {
  return (
    <article className="theme-surface mobile-card-reveal overflow-hidden rounded-3xl">
      <div className="bg-gradient-to-l from-[var(--gold-dark)] to-[var(--gold)] p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold">{student.fullName || "-"}</h3>
            <p className="mt-1 text-xs text-white/80">{student.gender === "female" ? "أنثى" : "ذكر"}</p>
          </div>

          <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold">
            {student.status === "active" ? "نشط" : student.status || "-"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
          <div className="theme-muted-block px-3 py-2"><span className="font-bold">الهاتف: </span>{student.phone || "-"}</div>
          <div className="theme-muted-block px-3 py-2"><span className="font-bold">ولي الأمر: </span>{student.guardianName || "-"}</div>
          <div className="theme-muted-block px-3 py-2"><span className="font-bold">المستوى: </span>{student.levelName || "-"}</div>
          <div className="theme-muted-block px-3 py-2"><span className="font-bold">الحلقة: </span>{student.className || "-"}</div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <ActionButton to={`/students/${student.id}`} label="تفاصيل" icon={Eye} />
          <ActionButton to={`/students/${student.id}/edit`} label="تعديل" icon={PencilLine} />
          <ActionButton to={`/students/${student.id}/freeze`} label="تجميد" icon={PauseCircle} />
          <ActionButton to={`/students/${student.id}/transfer`} label="نقل" icon={Repeat2} />
        </div>
      </div>
    </article>
  );
}

export default function StudentsMobileCards({ students }) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:hidden">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </section>
  );
}
