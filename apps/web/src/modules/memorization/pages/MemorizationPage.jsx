import { useEffect, useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldAlert
} from "lucide-react";
import { useMemorization } from "../hooks/useMemorization";

const EVALUATION_LABELS = {
  excellent: "ممتاز",
  good: "جيد",
  needs_work: "يحتاج دعم"
};

const EVALUATION_OPTIONS = ["excellent", "good", "needs_work"];
const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"];

const EMPTY_FORM = {
  studentId: "",
  studentName: "",
  className: "",
  level: "beginner",
  currentSurah: "",
  ayahRange: "",
  evaluation: "good",
  revisionState: "",
  target: ""
};

function evaluationClass(value) {
  if (value === "excellent") return "theme-status-active";
  if (value === "good") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-red-50 text-red-700 border border-red-200";
}

function levelLabel(value) {
  if (value === "advanced") return "متقدم";
  if (value === "intermediate") return "متوسط";
  return "مبتدئ";
}

function StatCard({ label, value, note }) {
  return (
    <article className="theme-stat-card rounded-2xl p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{value}</h3>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </article>
  );
}

function Actions({ item, saving, onEdit, onDelete, canWrite }) {
  if (!canWrite) {
    return <span className="text-xs font-bold text-slate-400">عرض فقط</span>;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <button type="button" onClick={() => onEdit(item)} className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-[var(--gold-surface)]">
        <Pencil size={13} />
        <span>تعديل</span>
      </button>
      <button type="button" disabled={saving} onClick={() => onDelete(item)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 disabled:opacity-60">
        <Trash2 size={13} />
        <span>حذف</span>
      </button>
    </div>
  );
}

function MemorizationTable({ rows, saving, onEdit, onDelete, canWrite }) {
  return (
    <section className="theme-table-shell hidden xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الطالب</th>
              <th className="px-5 py-4 font-bold">الحلقة</th>
              <th className="px-5 py-4 font-bold">المستوى</th>
              <th className="px-5 py-4 font-bold">السورة</th>
              <th className="px-5 py-4 font-bold">نطاق الآيات</th>
              <th className="px-5 py-4 font-bold">التقييم</th>
              <th className="px-5 py-4 font-bold">حالة المراجعة</th>
              <th className="px-5 py-4 font-bold">المستهدف القادم</th>
              <th className="px-5 py-4 font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id} className={index !== rows.length - 1 ? "border-b" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{item.studentName}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.className}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{levelLabel(item.level)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.currentSurah}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.ayahRange}</td>
                <td className="px-5 py-4">
                  <span className={["rounded-full px-3 py-1 text-xs font-bold", evaluationClass(item.evaluation)].join(" ")}>
                    {EVALUATION_LABELS[item.evaluation]}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.revisionState}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.target}</td>
                <td className="px-5 py-4"><Actions item={item} saving={saving} onEdit={onEdit} onDelete={onDelete} canWrite={canWrite} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MemorizationMobile({ rows, saving, onEdit, onDelete, canWrite }) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:hidden">
      {rows.map((item) => (
        <article key={item.id} className="theme-surface mobile-card-reveal rounded-3xl p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{item.studentName}</h3>
              <p className="text-xs text-slate-500">{item.className} - {levelLabel(item.level)}</p>
            </div>
            <span className={["rounded-full px-3 py-1 text-xs font-bold", evaluationClass(item.evaluation)].join(" ")}>
              {EVALUATION_LABELS[item.evaluation]}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">السورة: </span>{item.currentSurah}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">الآيات: </span>{item.ayahRange}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">المراجعة: </span>{item.revisionState}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">المستهدف: </span>{item.target}</div>
          </div>

          <div className="mt-3">
            <Actions item={item} saving={saving} onEdit={onEdit} onDelete={onDelete} canWrite={canWrite} />
          </div>
        </article>
      ))}
    </section>
  );
}

function MemorizationFormModal({ open, saving, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_FORM, ...initialData });
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="theme-surface relative z-10 w-full max-w-2xl rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">{initialData ? "تعديل سجل التسميع" : "إضافة سجل تسميع"}</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اسم الطالب</span>
            <input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الحلقة</span>
            <input value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المستوى</span>
            <select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>{levelLabel(option)}</option>
              ))}
            </select>
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">التقييم</span>
            <select value={form.evaluation} onChange={(e) => setForm((p) => ({ ...p, evaluation: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {EVALUATION_OPTIONS.map((option) => (
                <option key={option} value={option}>{EVALUATION_LABELS[option]}</option>
              ))}
            </select>
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">السورة</span>
            <input value={form.currentSurah} onChange={(e) => setForm((p) => ({ ...p, currentSurah: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">نطاق الآيات</span>
            <input value={form.ayahRange} onChange={(e) => setForm((p) => ({ ...p, ayahRange: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input md:col-span-2 px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">حالة المراجعة</span>
            <input value={form.revisionState} onChange={(e) => setForm((p) => ({ ...p, revisionState: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input md:col-span-2 px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المستهدف القادم</span>
            <input value={form.target} onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700">إلغاء</button>
          <button
            type="button"
            disabled={saving || !form.studentName.trim() || !form.className.trim()}
            onClick={async () => {
              const result = await onSubmit(form);
              if (result.ok) {
                setForm(EMPTY_FORM);
              }
            }}
            className="rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ السجل"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MemorizationPage() {
  const {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    classFilter,
    setClassFilter,
    classOptions,
    filteredRecords,
    stats,
    addRecord,
    editRecord,
    removeRecord
  } = useMemorization();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  function openCreateModal() {
    setEditingRecord(null);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingRecord(item);
    setModalOpen(true);
  }

  async function handleDelete(item) {
    const ok = window.confirm(`هل تريد حذف سجل ${item.studentName}؟`);
    if (!ok) return;
    await removeRecord(item);
  }

  if (!canRead) {
    return (
      <section className="theme-surface rounded-3xl p-6 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={22} />
        <h2 className="mt-3 text-lg font-extrabold text-slate-900">لا تملك صلاحية الوصول</h2>
        <p className="mt-1 text-sm text-slate-500">يرجى التواصل مع مدير النظام لتفعيل صلاحية التسميع.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-4xl">شاشة التسميع</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              متابعة التسميع اليومي، تقييم الجودة، وتحديد مستهدف الحفظ القادم لكل طالب.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="theme-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <Sparkles size={15} />
              <span>أداء لحظي</span>
            </div>
            {canWrite ? (
              <button type="button" onClick={openCreateModal} className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2 text-xs font-extrabold text-[var(--gold-dark)] sm:text-sm">
                <Plus size={14} />
                <span>إضافة سجل</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="إجمالي السجلات" value={stats.total} note="وفق الفلترة" />
        <StatCard label="ممتاز" value={stats.excellent} note="ثبات مرتفع" />
        <StatCard label="جيد" value={stats.good} note="أداء مستقر" />
        <StatCard label="يحتاج دعم" value={stats.needsWork} note="خطة علاجية" />
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">بحث وفلترة</h2>
            <p className="mt-1 text-sm text-slate-500">ابحث بالطالب أو السورة أو الحلقة.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="app-input flex items-center gap-2 px-3 py-2.5">
              <Search size={16} className="text-[var(--gold-dark)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث..."
                className="w-full min-w-[220px] border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="app-input flex items-center gap-2 px-3 py-2.5">
              <Filter size={16} className="text-[var(--gold-dark)]" />
              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
                className="min-w-[160px] border-0 bg-transparent text-sm text-slate-900 outline-none"
              >
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "كل الحلقات" : option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {error ? (
        <div className="theme-surface rounded-3xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-5 text-center text-sm font-bold text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل بيانات التسميع...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <ScrollText className="mx-auto text-slate-400" size={24} />
          <h3 className="mt-2 text-lg font-extrabold text-slate-900">لا توجد سجلات تسميع</h3>
          <p className="mt-1 text-sm text-slate-500">عدّل الفلترة لعرض بيانات مناسبة.</p>
        </div>
      ) : (
        <>
          <MemorizationTable rows={filteredRecords} saving={saving} onEdit={openEditModal} onDelete={handleDelete} canWrite={canWrite} />
          <MemorizationMobile rows={filteredRecords} saving={saving} onEdit={openEditModal} onDelete={handleDelete} canWrite={canWrite} />
        </>
      )}

      <MemorizationFormModal
        open={modalOpen}
        saving={saving}
        initialData={editingRecord}
        onClose={() => setModalOpen(false)}
        onSubmit={async (form) => {
          const result = editingRecord ? await editRecord(editingRecord, form) : await addRecord(form);
          if (result.ok) {
            setModalOpen(false);
            setEditingRecord(null);
          }
          return result;
        }}
      />
    </div>
  );
}
