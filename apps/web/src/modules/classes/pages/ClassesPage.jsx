import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Clock3,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldAlert
} from "lucide-react";
import { formatDate } from "../../../lib/utils/formatDate";
import { useClasses } from "../hooks/useClasses";

const PERIOD_OPTIONS = [
  { value: "all", label: "كل الفترات" },
  { value: "morning", label: "صباحية" },
  { value: "afternoon", label: "عصرية" },
  { value: "evening", label: "مسائية" }
];

const STATUS_OPTIONS = [
  { value: "active", label: "نشطة" },
  { value: "paused", label: "متوقفة" }
];

const EMPTY_FORM = {
  name: "",
  teacher: "",
  branch: "",
  room: "",
  period: "afternoon",
  schedule: "",
  capacity: 20,
  status: "active",
  nextSessionAt: ""
};

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
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

function ClassStatus({ status }) {
  const isActive = status === "active";

  return (
    <span className={["rounded-full px-3 py-1 text-xs font-bold", isActive ? "theme-status-active" : "theme-status-muted"].join(" ")}>
      {isActive ? "نشطة" : "متوقفة"}
    </span>
  );
}

function Actions({ item, onEdit, onDelete, saving, canWrite }) {
  if (!canWrite) {
    return <span className="text-xs font-bold text-slate-400">عرض فقط</span>;
  }

  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-[var(--gold-surface)]"
      >
        <Pencil size={13} />
        <span>تعديل</span>
      </button>
      <button
        type="button"
        disabled={saving}
        onClick={() => onDelete(item)}
        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 disabled:opacity-60"
      >
        <Trash2 size={13} />
        <span>حذف</span>
      </button>
    </div>
  );
}

function ClassesTable({ rows, onEdit, onDelete, saving, canWrite }) {
  return (
    <section className="theme-table-shell hidden xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الحلقة</th>
              <th className="px-5 py-4 font-bold">المحفظ</th>
              <th className="px-5 py-4 font-bold">الفرع / القاعة</th>
              <th className="px-5 py-4 font-bold">الجدول</th>
              <th className="px-5 py-4 font-bold">الإشغال</th>
              <th className="px-5 py-4 font-bold">الجلسة القادمة</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
              <th className="px-5 py-4 font-bold">إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id} className={index !== rows.length - 1 ? "border-b" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{item.name}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.teacher}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.branch} - {item.room}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.schedule}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.studentsCount}/{item.capacity}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatDate(item.nextSessionAt)}</td>
                <td className="px-5 py-4"><ClassStatus status={item.status} /></td>
                <td className="px-5 py-4"><Actions item={item} onEdit={onEdit} onDelete={onDelete} saving={saving} canWrite={canWrite} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ClassesMobile({ rows, onEdit, onDelete, saving, canWrite }) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:hidden">
      {rows.map((item) => (
        <article key={item.id} className="theme-surface mobile-card-reveal overflow-hidden rounded-3xl">
          <div className="bg-gradient-to-l from-[var(--gold-dark)] to-[var(--gold)] p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold">{item.name}</h3>
                <p className="mt-1 text-xs text-white/80">{item.teacher}</p>
              </div>

              <ClassStatus status={item.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 p-4 text-sm text-slate-600">
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">الفرع: </span>{item.branch}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">القاعة: </span>{item.room}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">الإشغال: </span>{item.studentsCount}/{item.capacity}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">الجدول: </span>{item.schedule}</div>
          </div>

          <div className="border-t border-[var(--border)] p-3">
            <Actions item={item} onEdit={onEdit} onDelete={onDelete} saving={saving} canWrite={canWrite} />
          </div>
        </article>
      ))}
    </section>
  );
}

function ClassFormModal({ open, initialData, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM);

  const derivedInitial = useMemo(() => ({
    ...EMPTY_FORM,
    ...initialData,
    nextSessionAt: toDateInputValue(initialData?.nextSessionAt)
  }), [initialData]);

  useEffect(() => {
    setForm(derivedInitial);
  }, [derivedInitial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="theme-surface relative z-10 w-full max-w-2xl rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">{initialData ? "تعديل الحلقة" : "إضافة حلقة"}</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اسم الحلقة</span>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المحفظ</span>
            <input value={form.teacher} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الفرع</span>
            <input value={form.branch} onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">القاعة</span>
            <input value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الفترة</span>
            <select value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {PERIOD_OPTIONS.filter((item) => item.value !== "all").map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الحالة</span>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="app-input md:col-span-2 px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الجدول</span>
            <input value={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">السعة</span>
            <input type="number" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value || 0) }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">تاريخ الجلسة القادمة</span>
            <input type="date" value={form.nextSessionAt} onChange={(e) => setForm((p) => ({ ...p, nextSessionAt: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700">
            إلغاء
          </button>
          <button
            type="button"
            disabled={saving || !form.name.trim()}
            onClick={() => onSubmit(form)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ الحلقة"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    periodFilter,
    setPeriodFilter,
    filteredClasses,
    stats,
    addClass,
    editClass,
    removeClass
  } = useClasses();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  function openCreateModal() {
    setEditingClass(null);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingClass(item);
    setModalOpen(true);
  }

  async function handleSave(form) {
    const result = editingClass ? await editClass(editingClass, form) : await addClass(form);

    if (result.ok) {
      setModalOpen(false);
      setEditingClass(null);
    }
  }

  async function handleDelete(item) {
    const ok = window.confirm(`هل تريد حذف الحلقة "${item.name}"؟`);
    if (!ok) return;
    await removeClass(item);
  }

  if (!canRead) {
    return (
      <section className="theme-surface rounded-3xl p-6 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={22} />
        <h2 className="mt-3 text-lg font-extrabold text-slate-900">لا تملك صلاحية الوصول</h2>
        <p className="mt-1 text-sm text-slate-500">يرجى التواصل مع مدير النظام لتفعيل صلاحية الحلقات.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="theme-chip mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <BookOpen size={15} />
              <span>إدارة الحلقات</span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-4xl">شاشة الحلقات</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              متابعة الحلقات والمحفظين والطاقة الاستيعابية والجدول القادم بنفس تجربة تطبيقات الموبايل.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="theme-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <Sparkles size={15} />
              <span>تجربة مرنة وسريعة</span>
            </div>
            {canWrite ? (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2 text-xs font-extrabold text-[var(--gold-dark)] sm:text-sm"
              >
                <Plus size={14} />
                <span>إضافة حلقة</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="إجمالي الحلقات" value={stats.total} note="كل الفروع" />
        <StatCard label="الحلقات النشطة" value={stats.active} note="جاهزة للعمل" />
        <StatCard label="نسبة الإشغال" value={`${stats.occupancy}%`} note="من إجمالي المقاعد" />
        <StatCard label="مقاعد متاحة" value={stats.seatsRemaining} note="قابلة للتسجيل" />
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">بحث وتصفية</h2>
            <p className="mt-1 text-sm text-slate-500">ابحث باسم الحلقة أو المحفظ أو الفرع.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="app-input flex items-center gap-2 px-3 py-2.5">
              <Search size={16} className="text-[var(--gold-dark)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث..."
                className="w-full min-w-[220px] border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="app-input flex items-center gap-2 px-3 py-2.5">
              <SlidersHorizontal size={15} className="text-[var(--gold-dark)]" />
              <select
                value={periodFilter}
                onChange={(event) => setPeriodFilter(event.target.value)}
                className="min-w-[140px] border-0 bg-transparent text-sm text-slate-900 outline-none"
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="theme-surface rounded-3xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-5 text-center text-sm font-bold text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل بيانات الحلقات...</div>
      ) : filteredClasses.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <Clock3 className="mx-auto text-slate-400" size={24} />
          <h3 className="mt-2 text-lg font-extrabold text-slate-900">لا توجد حلقات مطابقة</h3>
          <p className="mt-1 text-sm text-slate-500">غيّر معايير البحث أو الفلترة لإظهار النتائج.</p>
        </div>
      ) : (
        <>
          <ClassesTable rows={filteredClasses} onEdit={openEditModal} onDelete={handleDelete} saving={saving} canWrite={canWrite} />
          <ClassesMobile rows={filteredClasses} onEdit={openEditModal} onDelete={handleDelete} saving={saving} canWrite={canWrite} />
        </>
      )}

      <ClassFormModal
        open={modalOpen}
        initialData={editingClass}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
