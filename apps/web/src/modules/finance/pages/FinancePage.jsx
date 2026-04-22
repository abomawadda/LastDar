import { useEffect, useState } from "react";
import {
  Wallet,
  Search,
  Filter,
  AlertCircle,
  CircleDollarSign,
  Receipt,
  Plus,
  Pencil,
  Trash2,
  X,
  ShieldAlert
} from "lucide-react";
import { formatCurrency } from "../../../lib/utils/formatCurrency";
import { formatDate } from "../../../lib/utils/formatDate";
import { useFinance } from "../hooks/useFinance";

const STATUS_OPTIONS = [
  { value: "all", label: "كل الحالات" },
  { value: "paid", label: "مسدد" },
  { value: "partial", label: "جزئي" },
  { value: "unpaid", label: "غير مسدد" }
];

const INVOICE_STATUS_OPTIONS = ["paid", "partial", "unpaid"];

const STATUS_LABELS = {
  paid: "مسدد",
  partial: "جزئي",
  unpaid: "غير مسدد"
};

const EMPTY_INVOICE_FORM = {
  studentId: "",
  studentName: "",
  guardianName: "",
  month: "",
  dueAmount: 0,
  paidAmount: 0,
  dueDate: "",
  status: "unpaid"
};

const EMPTY_PAYMENT_FORM = {
  studentName: "",
  amount: 0,
  method: "نقدي",
  invoiceId: ""
};

function statusClass(status) {
  if (status === "paid") return "theme-status-active";
  if (status === "partial") return "bg-amber-50 text-amber-700 border border-amber-200";
  return "bg-red-50 text-red-700 border border-red-200";
}

function StatCard({ label, value, note, icon: Icon }) {
  return (
    <article className="theme-stat-card rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <div className="theme-icon-box rounded-xl p-2.5"><Icon size={18} /></div>
      </div>
    </article>
  );
}

function InvoiceActions({ item, saving, onEdit, onDelete, canWrite }) {
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

function InvoicesTable({ rows, saving, onEdit, onDelete, canWrite }) {
  return (
    <section className="theme-table-shell hidden xl:block">
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr className="text-sm text-slate-600">
              <th className="px-5 py-4 font-bold">الطالب</th>
              <th className="px-5 py-4 font-bold">ولي الأمر</th>
              <th className="px-5 py-4 font-bold">الفترة</th>
              <th className="px-5 py-4 font-bold">المستحق</th>
              <th className="px-5 py-4 font-bold">المدفوع</th>
              <th className="px-5 py-4 font-bold">المتبقي</th>
              <th className="px-5 py-4 font-bold">الحالة</th>
              <th className="px-5 py-4 font-bold">إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id} className={index !== rows.length - 1 ? "border-b" : ""}>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">{item.studentName}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.guardianName}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{item.month}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatCurrency(item.dueAmount)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{formatCurrency(item.paidAmount)}</td>
                <td className="px-5 py-4 text-sm font-bold text-slate-700">{formatCurrency(item.dueAmount - item.paidAmount)}</td>
                <td className="px-5 py-4">
                  <span className={["rounded-full px-3 py-1 text-xs font-bold", statusClass(item.status)].join(" ")}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-5 py-4"><InvoiceActions item={item} saving={saving} onEdit={onEdit} onDelete={onDelete} canWrite={canWrite} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InvoicesMobile({ rows, saving, onEdit, onDelete, canWrite }) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:hidden">
      {rows.map((item) => (
        <article key={item.id} className="theme-surface mobile-card-reveal rounded-3xl p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{item.studentName}</h3>
              <p className="text-xs text-slate-500">{item.guardianName}</p>
            </div>
            <span className={["rounded-full px-3 py-1 text-xs font-bold", statusClass(item.status)].join(" ")}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">الفترة: </span>{item.month}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">المستحق: </span>{formatCurrency(item.dueAmount)}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">المدفوع: </span>{formatCurrency(item.paidAmount)}</div>
            <div className="theme-muted-block px-3 py-2"><span className="font-bold">المتبقي: </span>{formatCurrency(item.dueAmount - item.paidAmount)}</div>
          </div>

          <div className="mt-3">
            <InvoiceActions item={item} saving={saving} onEdit={onEdit} onDelete={onDelete} canWrite={canWrite} />
          </div>
        </article>
      ))}
    </section>
  );
}

function PaymentItem({ payment, saving, onDelete, canWrite }) {
  return (
    <div className="theme-muted-block flex items-center justify-between gap-2 px-3 py-2.5">
      <div>
        <p className="text-sm font-bold text-slate-800">{payment.studentName}</p>
        <p className="text-xs text-slate-500">{payment.method} - {formatDate(payment.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-extrabold text-[var(--gold-dark)]">{formatCurrency(payment.amount)}</p>
        {canWrite ? (
          <button type="button" disabled={saving} onClick={() => onDelete(payment)} className="rounded-lg border border-red-200 bg-red-50 p-1 text-red-700 disabled:opacity-60">
            <Trash2 size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function InvoiceFormModal({ open, saving, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_INVOICE_FORM);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_INVOICE_FORM, ...initialData });
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="theme-surface relative z-10 w-full max-w-2xl rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">{initialData ? "تعديل فاتورة" : "إضافة فاتورة"}</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-slate-600"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الطالب</span>
            <input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">ولي الأمر</span>
            <input value={form.guardianName} onChange={(e) => setForm((p) => ({ ...p, guardianName: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الفترة</span>
            <input value={form.month} onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))} placeholder="مثال: أبريل 2026" className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">تاريخ الاستحقاق</span>
            <input type="date" value={String(form.dueDate || "").slice(0, 10)} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المستحق</span>
            <input type="number" value={form.dueAmount} onChange={(e) => setForm((p) => ({ ...p, dueAmount: Number(e.target.value || 0) }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المدفوع</span>
            <input type="number" value={form.paidAmount} onChange={(e) => setForm((p) => ({ ...p, paidAmount: Number(e.target.value || 0) }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input md:col-span-2 px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">الحالة</span>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none">
              {INVOICE_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{STATUS_LABELS[option]}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700">إلغاء</button>
          <button
            type="button"
            disabled={saving || !form.studentName.trim() || !form.month.trim()}
            onClick={async () => {
              const result = await onSubmit(form);
              if (result.ok) setForm(EMPTY_INVOICE_FORM);
            }}
            className="rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "حفظ الفاتورة"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentFormModal({ open, saving, invoices, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_PAYMENT_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_PAYMENT_FORM);
  }, [open]);

  function linkedInvoice() {
    return invoices.find((item) => item.id === form.invoiceId) || null;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="theme-surface relative z-10 w-full max-w-xl rounded-3xl p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">إضافة تحصيل</h3>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] p-1.5 text-slate-600"><X size={16} /></button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اختيار فاتورة (اختياري)</span>
            <select
              value={form.invoiceId}
              onChange={(e) => {
                const invoiceId = e.target.value;
                const target = invoices.find((item) => item.id === invoiceId);
                setForm((p) => ({
                  ...p,
                  invoiceId,
                  studentName: target?.studentName || p.studentName
                }));
              }}
              className="w-full border-0 bg-transparent text-sm outline-none"
            >
              <option value="">بدون ربط</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>{invoice.studentName} - {invoice.month}</option>
              ))}
            </select>
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">اسم الطالب</span>
            <input value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">المبلغ</span>
            <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value || 0) }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>

          <label className="app-input px-3 py-2.5">
            <span className="mb-1 block text-xs font-bold text-slate-500">طريقة الدفع</span>
            <input value={form.method} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))} className="w-full border-0 bg-transparent text-sm outline-none" />
          </label>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700">إلغاء</button>
          <button
            type="button"
            disabled={saving || !form.studentName.trim() || form.amount <= 0}
            onClick={async () => {
              const result = await onSubmit(form, linkedInvoice());
              if (result.ok) setForm(EMPTY_PAYMENT_FORM);
            }}
            className="rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : "إضافة التحصيل"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const {
    loading,
    saving,
    error,
    canRead,
    canWrite,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    filteredInvoices,
    payments,
    stats,
    addInvoice,
    editInvoice,
    removeInvoice,
    addPayment,
    removePayment
  } = useFinance();

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  function openCreateInvoice() {
    setEditingInvoice(null);
    setInvoiceModalOpen(true);
  }

  function openEditInvoice(invoice) {
    setEditingInvoice(invoice);
    setInvoiceModalOpen(true);
  }

  async function handleDeleteInvoice(invoice) {
    const ok = window.confirm(`هل تريد حذف فاتورة ${invoice.studentName}؟`);
    if (!ok) return;
    await removeInvoice(invoice);
  }

  async function handleDeletePayment(payment) {
    const ok = window.confirm(`هل تريد حذف تحصيل ${payment.studentName}؟`);
    if (!ok) return;
    await removePayment(payment);
  }

  if (!canRead) {
    return (
      <section className="theme-surface rounded-3xl p-6 text-center">
        <ShieldAlert className="mx-auto text-red-500" size={22} />
        <h2 className="mt-3 text-lg font-extrabold text-slate-900">لا تملك صلاحية الوصول</h2>
        <p className="mt-1 text-sm text-slate-500">يرجى التواصل مع مدير النظام لتفعيل صلاحية المالية.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-4xl">شاشة المالية</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              متابعة الفواتير والمدفوعات والمبالغ المتبقية لحظيًا بواجهة مرنة وواضحة.
            </p>
          </div>

          {canWrite ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={openCreateInvoice} className="inline-flex items-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2 text-xs font-extrabold text-[var(--gold-dark)] sm:text-sm">
                <Plus size={14} />
                <span>إضافة فاتورة</span>
              </button>
              <button type="button" onClick={() => setPaymentModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-extrabold text-white sm:text-sm">
                <Plus size={14} />
                <span>إضافة تحصيل</span>
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="إجمالي المستحق" value={formatCurrency(stats.totalDue)} note="كل الفواتير" icon={Receipt} />
        <StatCard label="إجمالي المحصل" value={formatCurrency(stats.totalPaid)} note="المبالغ المدفوعة" icon={CircleDollarSign} />
        <StatCard label="الرصيد المتبقي" value={formatCurrency(stats.outstanding)} note="قابل للتحصيل" icon={Wallet} />
        <StatCard label="فواتير غير مسددة" value={stats.unpaidCount} note="تحتاج متابعة" icon={AlertCircle} />
      </section>

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">بحث وفلترة</h2>
            <p className="mt-1 text-sm text-slate-500">ابحث باسم الطالب أو ولي الأمر.</p>
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
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="min-w-[140px] border-0 bg-transparent text-sm text-slate-900 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
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
        <div className="theme-surface rounded-3xl p-6 text-center text-sm font-bold text-slate-500">جاري تحميل البيانات المالية...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="theme-surface rounded-3xl border-dashed p-8 text-center">
          <h3 className="text-lg font-extrabold text-slate-900">لا توجد فواتير</h3>
          <p className="mt-1 text-sm text-slate-500">لا توجد نتائج مطابقة للبحث الحالي.</p>
        </div>
      ) : (
        <>
          <InvoicesTable rows={filteredInvoices} saving={saving} onEdit={openEditInvoice} onDelete={handleDeleteInvoice} canWrite={canWrite} />
          <InvoicesMobile rows={filteredInvoices} saving={saving} onEdit={openEditInvoice} onDelete={handleDeleteInvoice} canWrite={canWrite} />
        </>
      )}

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <h3 className="text-base font-extrabold text-slate-900">آخر التحصيلات</h3>

        <div className="mt-3 space-y-2">
          {payments.map((item) => (
            <PaymentItem key={item.id} payment={item} saving={saving} onDelete={handleDeletePayment} canWrite={canWrite} />
          ))}
        </div>
      </section>

      <InvoiceFormModal
        open={invoiceModalOpen}
        saving={saving}
        initialData={editingInvoice}
        onClose={() => setInvoiceModalOpen(false)}
        onSubmit={async (form) => {
          const result = editingInvoice ? await editInvoice(editingInvoice, form) : await addInvoice(form);
          if (result.ok) {
            setInvoiceModalOpen(false);
            setEditingInvoice(null);
          }
          return result;
        }}
      />

      <PaymentFormModal
        open={paymentModalOpen}
        saving={saving}
        invoices={filteredInvoices}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={async (form, linkedInvoice) => {
          const result = await addPayment(form, linkedInvoice);
          if (result.ok) {
            setPaymentModalOpen(false);
          }
          return result;
        }}
      />
    </div>
  );
}
