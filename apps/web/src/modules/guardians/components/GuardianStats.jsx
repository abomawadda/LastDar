import { Users, Link2, PhoneCall, ShieldCheck } from "lucide-react";

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <article className="theme-stat-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>

        <div className="theme-icon-box rounded-xl p-2.5">
          <Icon size={18} />
        </div>
      </div>
    </article>
  );
}

export default function GuardianStats({ stats }) {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard title="إجمالي أولياء الأمور" value={stats.total} note="كل السجلات" icon={Users} />
      <StatCard title="النشطون" value={stats.active} note="حسابات فعالة" icon={ShieldCheck} />
      <StatCard title="مرتبطون بأبناء" value={stats.withChildren} note="تم الربط" icon={Link2} />
      <StatCard title="تواصل هاتفي" value={stats.phonePreferred} note="طريقة مفضلة" icon={PhoneCall} />
    </section>
  );
}
