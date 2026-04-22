import { BookOpenCheck, Flame, TimerReset, BookMarked } from "lucide-react";

function ProgressItem({ label, value, percent, icon: Icon }) {
  return (
    <article className="theme-muted-block rounded-2xl p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <Icon size={14} className="text-[var(--gold-dark)]" />
          <span>{label}</span>
        </div>
        <span className="text-xs font-bold text-[var(--gold-dark)]">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-white">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)]"
          style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
        />
      </div>
    </article>
  );
}

export default function StudentProgressPanel({ student }) {
  const memorizationText = student.education?.memorizationAmount || "غير محدد";
  const level = student.education?.levelId || "beginner";

  const levelPercent = level === "advanced" ? 85 : level === "intermediate" ? 55 : 25;

  return (
    <section className="theme-surface rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">التقدم التعليمي</h3>
        <span className="theme-status-active rounded-full px-3 py-1 text-xs font-bold">محدث الآن</span>
      </div>

      <div className="space-y-2.5">
        <ProgressItem label="مستوى الطالب" value={student.education?.levelId || "-"} percent={levelPercent} icon={BookOpenCheck} />
        <ProgressItem label="مقدار الحفظ" value={memorizationText} percent={Math.min(levelPercent + 10, 100)} icon={Flame} />
        <ProgressItem label="الالتزام الأسبوعي" value="4 / 5 أيام" percent={80} icon={TimerReset} />
        <ProgressItem label="المراجعة" value="جيدة" percent={72} icon={BookMarked} />
      </div>

      {student.education?.academicNotes ? (
        <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-input)] p-3 text-xs leading-7 text-slate-600">
          {student.education.academicNotes}
        </div>
      ) : null}
    </section>
  );
}
