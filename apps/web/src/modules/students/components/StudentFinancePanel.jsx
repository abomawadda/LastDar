import { Wallet, CalendarClock, CircleDollarSign, BadgeCheck } from "lucide-react";

function FinanceItem({ label, value, icon: Icon, tone = "normal" }) {
  const toneClass =
    tone === "ok"
      ? "text-emerald-700"
      : tone === "warn"
        ? "text-amber-700"
        : "text-slate-700";

  return (
    <div className="theme-muted-block flex items-center justify-between gap-2 px-3 py-2.5">
      <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon size={14} className="text-[var(--gold-dark)]" />
        <span>{label}</span>
      </div>
      <span className={`text-sm font-extrabold ${toneClass}`}>{value}</span>
    </div>
  );
}

export default function StudentFinancePanel({ student }) {
  const monthlyFee = student.joinType === "scholarship" ? "0 ج.م" : "450 ج.م";
  const dueAmount = student.joinType === "regular" ? "150 ج.م" : "0 ج.م";

  return (
    <section className="theme-surface rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-slate-900">الملف المالي</h3>
        <div className="theme-icon-box rounded-lg p-2">
          <Wallet size={15} />
        </div>
      </div>

      <div className="space-y-2.5">
        <FinanceItem label="نوع الاشتراك" value={student.joinType || "regular"} icon={CircleDollarSign} />
        <FinanceItem label="الرسوم الشهرية" value={monthlyFee} icon={Wallet} />
        <FinanceItem label="المستحقات الحالية" value={dueAmount} icon={CalendarClock} tone={dueAmount === "0 ج.م" ? "ok" : "warn"} />
        <FinanceItem label="آخر حالة سداد" value={dueAmount === "0 ج.م" ? "مسدد" : "جزئي"} icon={BadgeCheck} tone={dueAmount === "0 ج.م" ? "ok" : "warn"} />
      </div>

      <p className="mt-3 text-xs leading-7 text-slate-500">
        هذه القيم واجهة تجريبية لحين ربط شاشة الطالب المباشرة بوحدة المالية التفصيلية.
      </p>
    </section>
  );
}
