import { useState } from "react";
import {
  User,
  Phone,
  Users,
  GraduationCap,
  BookOpen,
  FileText
} from "lucide-react";
import { studentSchema } from "../schemas/student.schema";

const initialState = {
  fullName: "",
  phone: "",
  gender: "male",
  guardianName: "",
  levelName: "",
  className: "",
  notes: ""
};

function FieldShell({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        <span className="inline-flex items-center gap-2">
          <Icon size={16} className="text-emerald-700" />
          <span>{label}</span>
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

      {error ? (
        <p className="mt-2 text-xs font-bold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

export default function StudentForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = studentSchema.safeParse(form);

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
    onSubmit?.(result.data, { reset: () => setForm(initialState) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldShell label="اسم الطالب" icon={User} error={errors.fullName}>
          <input
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="مثال: محمد عبد الرحمن"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            required
          />
        </FieldShell>

        <FieldShell label="رقم الهاتف" icon={Phone} error={errors.phone}>
          <input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="01xxxxxxxxx"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="النوع" icon={Users} error={errors.gender}>
          <select
            value={form.gender}
            onChange={(e) => updateField("gender", e.target.value)}
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
          >
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </FieldShell>

        <FieldShell label="ولي الأمر" icon={Users} error={errors.guardianName}>
          <input
            value={form.guardianName}
            onChange={(e) => updateField("guardianName", e.target.value)}
            placeholder="اسم ولي الأمر"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="المستوى" icon={GraduationCap} error={errors.levelName}>
          <input
            value={form.levelName}
            onChange={(e) => updateField("levelName", e.target.value)}
            placeholder="مثال: مبتدئ / متوسط"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>

        <FieldShell label="الحلقة" icon={BookOpen} error={errors.className}>
          <input
            value={form.className}
            onChange={(e) => updateField("className", e.target.value)}
            placeholder="مثال: حلقة العصر 1"
            className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </FieldShell>
      </div>

      <FieldShell label="ملاحظات" icon={FileText} error={errors.notes}>
        <textarea
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="أي ملاحظات إضافية عن الطالب"
          rows={4}
          className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </FieldShell>

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
          {loading ? "جاري الحفظ..." : "حفظ الطالب"}
        </button>
      </div>
    </form>
  );
}