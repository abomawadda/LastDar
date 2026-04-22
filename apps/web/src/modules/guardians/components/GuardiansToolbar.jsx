import { Search, Filter } from "lucide-react";

export default function GuardiansToolbar({ search, onSearchChange }) {
  return (
    <section className="theme-surface rounded-3xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">بحث وفرز</h2>
          <p className="mt-1 text-sm text-slate-500">ابحث بالاسم أو الهاتف أو البريد.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="app-input flex items-center gap-2 px-3 py-2.5">
            <Search size={16} className="text-[var(--gold-dark)]" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن ولي أمر..."
              className="w-full min-w-[220px] border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-gold)] bg-[var(--gold-surface)] px-4 py-2.5 text-sm font-bold text-[var(--gold-dark)]"
          >
            <Filter size={15} />
            <span>فلترة</span>
          </button>
        </div>
      </div>
    </section>
  );
}
