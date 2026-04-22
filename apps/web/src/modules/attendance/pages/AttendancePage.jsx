import { useState } from "react";
import {
  ClipboardCheck,
  Search,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleEllipsis,
  Plus,
  Trash2,
  X,
  ShieldAlert
} from "lucide-react";
import { useAttendance } from "../hooks/useAttendance";

const STATUS_LABELS = {
  present: "حاضر",
  late: "متأخر",
  absent: "غائب",
  excused: "بعذر"
};

const STATUS_OPTIONS = ["present", "late", "absent", "excused"];

const EMPTY_FORM = {
  studentName: "",
  className: "",
  classId: "",
  status: "present"
};

function statusClass(status) {
  if (status === "present") return "theme-status-active";
  if (status === "late") return "bg-amber-50 text-amber-700 border border-amber-200";
  if (status === "absent") return "bg-red-50 text-red-700 border border-red-200";
  return "theme-status-muted";
}

function StatCard({ label, value, note, icon: Icon }) {
  return (
    <article className="theme-stat-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <div className="theme-icon-box rounded-xl p-2.5"><Icon size={18} /></div>
      </div>
    </article>
  );
}

function StatusPicker({ value, onChange, canWrite }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status}
          type="button"
          disabled={!canWrite}
          onClick={() => onChange(status)}
          className={[
            "rounded-lg border px-2.5 py-1 text-xs font-bold transition",
            value === status
              ? "border-[var(--border-gold)] bg-[var(--gold-surface)] text-[var(--gold-dark)]"
              : "border-[var(--border)] bg-[var(--bg-secondary)] text-slate-600 hover:bg-[var(--bg-input)]",
            !canWrite ? "cursor-not-allowed opacity-45" : ""
          ].join(" ")}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}

function DeleteButton({ record, saving, onDelete, canWrite }) {
  const canDelete = canWrite && record.source === "db";

  return (
    <button
      type="button"
      disabled={!canDelete || saving}
      onClick={() => onDelete(record)}
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 disabled:opacity-40"
    >
      <Trash2 size={12} />
      <span>{record.studentId ? "إعادة ضبط" : "حذف"}</span>
    </button>
  );
}

function AttendanceTable({ records, saving, onStatusChange, onDelete, canWrite }) {
  return (
    <section className="theme-table-shell hidden xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الطالب</th>
              <th className="px-5 py-4 font-bold">الحلقة</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
              <th className="px-5 py-4 font-bold">تحديث سريع</th>
              <th className="px-5 py-4 font-bold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item, index) => (
              <tr key={item.id} className={index !== records.length - 1 ? "border-b" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{item.studentName}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.className}</td>
                <td className="px-5 py-4">
                  <span className={["rounded-full px-3 py-1 text-xs font-bold", statusClass(item.status)].join(" ")}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-5 py-4"><StatusPicker value={item.status} onChange={(status) => onStatusChange(item.id, status)} canWrite={canWrite} /></td>
                <td className="px-5 py-4"><DeleteButton record={item} saving={saving} onDelete={onDelete} canWrite={canWrite} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttendanceMobile({ records, saving, onStatusChange, onDelete, canWrite }) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:hidden">
      {records.map((item) => (
        <article key={item.id} className="theme-surface mobile-card-reveal rounded-3xl p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{item.studentName}</h3>
              <p className="text-xs text-slate-500">{item.className}</p>
            </div>
            <span className={["rounded-full px-3 py-1 text-xs font-bold", statusClass(item.status)].join(" ")}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>

          <StatusPicker value={item.status} onChange={(status) => onStatusChange(item.id, status)} canWrite={canWrite} />

          <div className="mt-3">
            <DeleteButton record={item} saving={saving} onDelete={onDelete} canWrite={canWrite} />
          </div>
        </article>
      ))}
    </section>
  );
}

function AttendanceCreateModal({ open, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="theme-surface relative z-10 w-full max-w-xl rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">إضافة سجل حضور يدوي</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اسم الطالب</span>
            <input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اسم الحلقة</span>
            <input value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">كود الحلقة (اختياري)</span>
            <input value={form.classId} onChange={(e) => setForm((p) => ({ ...p, classId: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الحالة</span>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{STATUS_LABELS[option]}</option>
              ))}
            </select>
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
            {saving ? "جاري الحفظ..." : "إضافة السجل"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    selectedClass,
    setSelectedClass,
    selectedDate,
    setSelectedDate,
    classes,
    filteredRecords,
    stats,
    updateStatus,
    addRecord,
    removeRecord
  } = useAttendance();

  const [modalOpen, setModalOpen] = useState(false);

  async function handleDelete(record) {
    const ok = window.confirm(record.studentId ? "سيتم إعادة السجل للوضع الافتراضي (غائب). متابعة؟" : "حذف السجل اليدوي؟");
    if (!ok) return;
    await removeRecord(record);
  }

  if (!canRead) {
    return (
      <section className="theme-surface rounded-3xl p-6 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={22} />
        <h2 className="mt-3 text-lg font-extrabold text-slate-900">لا تملك صلاحية الوصول</h2>
        <p className="mt-1 text-sm text-slate-500">يرجى التواصل مع مدير النظام لتفعيل صلاحية الحضور.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-4xl">شاشة الحضور</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              تسجيل حضور الطلاب يوميًا وتحديث الحالة مباشرةً من نفس الشاشة على الجوال أو سطح المكتب.
            </p>
          </div>

          {canWrite ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2 text-xs font-extrabold text-[var(--gold-dark)] sm:text-sm"
            >
              <Plus size={14} />
              <span>سجل يدوي</span>
            </button>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard label="إجمالي المسجلين" value={stats.total} note="حسب التصفية" icon={ClipboardCheck} />
        <StatCard label="حاضر" value={stats.present} note="التزام ممتاز" icon={CheckCircle2} />
        <StatCard label="متأخر" value={stats.late} note="يحتاج متابعة" icon={Clock3} />
        <StatCard label="غائب" value={stats.absent} note="تنبيه مطلوب" icon={XCircle} />
        <StatCard label="بعذر" value={stats.excused} note="مقيد" icon={CircleEllipsis} />
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
          <label className="app-input flex items-center gap-2 px-3 py-2.5">
            <Search size={16} className="text-[var(--gold-dark)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث باسم الطالب"
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="app-input flex items-center gap-2 px-3 py-2.5">
            <ClipboardCheck size={16} className="text-[var(--gold-dark)]" />
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            >
              {classes.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>

          <label className="app-input flex items-center gap-2 px-3 py-2.5">
            <CalendarDays size={16} className="text-[var(--gold-dark)]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
            />
          </label>
        </div>
      </section>

      {error ? (
        <div className="theme-surface rounded-3xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] p-5 text-center text-sm font-bold text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل سجل الحضور...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">لا توجد سجلات</h3>
          <p className="mt-1 text-sm text-slate-500">غيّر الفلاتر أو التاريخ لعرض بيانات الحضور.</p>
        </div>
      ) : (
        <>
          <AttendanceTable records={filteredRecords} saving={saving} onStatusChange={updateStatus} onDelete={handleDelete} canWrite={canWrite} />
          <AttendanceMobile records={filteredRecords} saving={saving} onStatusChange={updateStatus} onDelete={handleDelete} canWrite={canWrite} />
        </>
      )}

      <AttendanceCreateModal
        open={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={async (form) => {
          const result = await addRecord(form);
          if (result.ok) {
            setModalOpen(false);
          }
          return result;
        }}
      />
    </div>
  );
}
