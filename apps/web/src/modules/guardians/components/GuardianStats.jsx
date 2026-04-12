import { Users, Link2, PhoneCall, ShieldCheck } from "lucide-react";

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Icon size={20} />
        </div>
      </div>
    </article>
  );
}

export default function GuardianStats({ stats }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      <StatCard title="إجمالي أولياء الأمور" value={stats.total} note="إجمالي السجلات" icon={Users} />
      <StatCard title="النشطون" value={stats.active} note="حسابات فعالة" icon={ShieldCheck} />
      <StatCard title="مرتبطون بأبناء" value={stats.withChildren} note="لديهم أبناء بالنظام" icon={Link2} />
      <StatCard title="تواصل هاتفي" value={stats.phonePreferred} note="طريقة التواصل المفضلة" icon={PhoneCall} />
    </section>
  );
}