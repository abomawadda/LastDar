import { Search, Filter } from "lucide-react";

export default function GuardiansToolbar({ search, onSearchChange }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="m-0 text-xl font-extrabold text-slate-900">
            قائمة أولياء الأمور
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            يمكنك البحث بالاسم أو الهاتف أو البريد أو صلة القرابة.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
            <Search size={18} className="text-emerald-700" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن ولي أمر..."
              className="w-full min-w-[220px] border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Filter size={16} />
            <span>فلترة</span>
          </button>
        </div>
      </div>
    </section>
  );
}