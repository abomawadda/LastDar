import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  IdCard,
  Briefcase,
  MapPin,
  MessageSquare,
  FileText
} from "lucide-react";
import { guardianSchema } from "../schemas/guardian.schema";

const RELATION_OPTIONS = [
  { value: "father", label: "الأب" },
  { value: "mother", label: "الأم" },
  { value: "brother", label: "الأخ" },
  { value: "sister", label: "الأخت" },
  { value: "uncle", label: "العم" },
  { value: "aunt", label: "العمة / الخالة" },
  { value: "other", label: "أخرى" }
];

const CONTACT_METHOD_OPTIONS = [
  { value: "phone", label: "اتصال هاتفي" },
  { value: "whatsapp", label: "واتساب" },
  { value: "sms", label: "رسالة نصية" }
];

const initialState = {
  fullName: "",
  phone: "",
  alternatePhone: "",
  relationType: "father",
  email: "",
  nationalId: "",
  address: "",
  jobTitle: "",
  preferredContactMethod: "phone",
  notes: ""
};

function FieldShell({ label, icon: Icon, error, children, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        <span className="inline-flex items-center gap-2">
          <Icon size={16} className="text-emerald-700" />
          <span>{label}</span>
          {required ? <span className="text-red-500">*</span> : null}
        </span>
      </label>

      <div
        className={[
          "rounded-2xl border bg-white px-4 py-3 focus-within:ring-4",
          error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
            : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-emerald-100"
        ].join(" ")}
      >
        {children}
      </div>

      {error ? <p className="mt-2 text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}

export default function GuardianForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = guardianSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};

      for (const issue of result.error.issues) {
        const fieldName = issue.path?.[0];
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit?.(result.data, {
      reset: () => setForm(initialState)
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldShell label="اسم ولي الأمر" icon={User} error={errors.fullName} required>
          <input
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="الاسم الكامل"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="رقم الموبايل الأساسي" icon={Phone} error={errors.phone} required>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="01xxxxxxxxx"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="رقم موبايل بديل" icon={Phone} error={errors.alternatePhone}>
          <input
            value={form.alternatePhone}
            onChange={(e) => updateField("alternatePhone", e.target.value)}
            placeholder="رقم بديل"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="صلة القرابة" icon={User} error={errors.relationType}>
          <select
            value={form.relationType}
            onChange={(e) => updateField("relationType", e.target.value)}
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
          >
            {RELATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell label="البريد الإلكتروني" icon={Mail} error={errors.email}>
          <input
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@email.com"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="الرقم القومي" icon={IdCard} error={errors.nationalId}>
          <input
            value={form.nationalId}
            onChange={(e) => updateField("nationalId", e.target.value)}
            placeholder="14 رقمًا"
            maxLength={14}
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="المهنة / الوظيفة" icon={Briefcase} error={errors.jobTitle}>
          <input
            value={form.jobTitle}
            onChange={(e) => updateField("jobTitle", e.target.value)}
            placeholder="المهنة"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell
          label="طريقة التواصل المفضلة"
          icon={MessageSquare}
          error={errors.preferredContactMethod}
        >
          <select
            value={form.preferredContactMethod}
            onChange={(e) => updateField("preferredContactMethod", e.target.value)}
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
          >
            {CONTACT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>

        <div className="md:col-span-2">
          <FieldShell label="العنوان" icon={MapPin} error={errors.address}>
            <input
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="العنوان"
              className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </FieldShell>
        </div>

        <div className="md:col-span-2">
          <FieldShell label="ملاحظات" icon={FileText} error={errors.notes}>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={4}
              placeholder="أي ملاحظات إضافية"
              className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </FieldShell>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setErrors({});
          }}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          إعادة تعيين
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-gradient-to-l from-emerald-700 to-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(5,150,105,0.18)] transition hover:from-emerald-800 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "جاري الحفظ..." : "حفظ ولي الأمر"}
        </button>
      </div>
    </form>
  );
}