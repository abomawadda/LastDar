const RELATION_LABELS = {
  father: "الأب",
  mother: "الأم",
  brother: "الأخ",
  sister: "الأخت",
  uncle: "العم",
  aunt: "العمة / الخالة",
  other: "أخرى"
};

function GuardianCard({ guardian }) {
  return (
    <article className="theme-surface mobile-card-reveal overflow-hidden rounded-3xl">
      <div className="bg-gradient-to-l from-[var(--gold-dark)] to-[var(--gold)] p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold">{guardian.fullName || "-"}</h3>
            <p className="mt-1 text-xs text-white/80">{RELATION_LABELS[guardian.relationType] || "-"}</p>
          </div>

          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-bold",
              guardian.status === "active" ? "bg-white/15 text-white" : "bg-slate-800/40 text-white"
            ].join(" ")}
          >
            {guardian.status === "active" ? "نشط" : guardian.status || "-"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
          <div className="theme-muted-block px-3 py-2">
            <span className="font-bold text-slate-700">الهاتف: </span>
            <span>{guardian.phone || "-"}</span>
          </div>

          <div className="theme-muted-block px-3 py-2">
            <span className="font-bold text-slate-700">هاتف بديل: </span>
            <span>{guardian.alternatePhone || "-"}</span>
          </div>

          <div className="theme-muted-block px-3 py-2">
            <span className="font-bold text-slate-700">المهنة: </span>
            <span>{guardian.jobTitle || "-"}</span>
          </div>

          <div className="theme-muted-block px-3 py-2">
            <span className="font-bold text-slate-700">عدد الأبناء: </span>
            <span>{guardian.childrenCount || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function GuardiansMobileCards({ guardians }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:hidden">
      {guardians.map((guardian) => (
        <GuardianCard key={guardian.id} guardian={guardian} />
      ))}
    </section>
  );
}
