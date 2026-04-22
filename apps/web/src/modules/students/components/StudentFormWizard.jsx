import { useMemo, useState } from "react";
import {
  User,
  GraduationCap,
  HeartPulse,
  Phone,
  Users,
  ShieldAlert,
  FileText,
  ChevronLeft,
  ChevronRight,
  IdCard,
  School,
  MapPin
} from "lucide-react";
import { studentSchema } from "../schemas/student.schema";
import { parseEgyptianNationalId } from "../../../lib/utils/egyptNationalId";

const BRANCH_OPTIONS = [
  { value: "main", label: "الفرع الرئيسي" },
  { value: "branch_damietta", label: "فرع دمياط" }
];

const STATUS_OPTIONS = [
  { value: "active", label: "نشط" },
  { value: "trial", label: "تحت الاختبار" },
  { value: "frozen", label: "مجمّد" }
];

const JOIN_TYPE_OPTIONS = [
  { value: "regular", label: "عادي" },
  { value: "scholarship", label: "منحة" },
  { value: "discounted", label: "مخفّض" }
];

const GENDER_OPTIONS = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" }
];

const RELATION_OPTIONS = [
  { value: "father", label: "الأب" },
  { value: "mother", label: "الأم" },
  { value: "brother", label: "الأخ" },
  { value: "sister", label: "الأخت" },
  { value: "uncle", label: "العم" },
  { value: "other", label: "أخرى" }
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "مبتدئ" },
  { value: "intermediate", label: "متوسط" },
  { value: "advanced", label: "متقدم" }
];

const CLASS_OPTIONS = [
  { value: "halaqa_fajr_1", label: "حلقة الفجر 1" },
  { value: "halaqa_asr_1", label: "حلقة العصر 1" },
  { value: "halaqa_maghrib_1", label: "حلقة المغرب 1" }
];

const sections = [
  { key: "basic", title: "البيانات الأساسية", icon: User },
  { key: "education", title: "التعليم والحفظ", icon: GraduationCap },
  { key: "health", title: "البيانات الصحية", icon: HeartPulse },
  { key: "contact", title: "السكن والتواصل", icon: MapPin },
  { key: "guardian", title: "ولي الأمر", icon: Users },
  { key: "family", title: "بيانات الوالدين", icon: IdCard },
  { key: "emergency", title: "الطوارئ", icon: ShieldAlert },
  { key: "admin", title: "ملاحظات إدارية", icon: FileText }
];

const initialState = {
  studentCode: "",
  fullName: "",
  nationalId: "",
  birthDate: "",
  age: null,
  gender: "",
  governorate: "",

  phone: "",
  branchId: "main",
  status: "active",
  joinType: "regular",
  enrollmentDate: "",

  levelId: "",
  classId: "",
  memorizationAmount: "",
  academicNotes: "",

  chronicDiseaseDetails: "",
  allergyDetails: "",
  medications: "",
  specialNeeds: "",
  healthNotes: "",

  address: "",
  area: "",
  landmark: "",

  guardianName: "",
  guardianPhone: "",
  guardianRelation: "father",

  fatherName: "",
  fatherPhone: "",
  fatherNationalId: "",
  fatherJobTitle: "",

  motherName: "",
  motherPhone: "",
  motherJobTitle: "",

  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",

  adminNotes: ""
};

function SectionTab({ section, active, index, onClick }) {
  const Icon = section.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition sm:text-sm",
        active
          ? "border-[var(--border-gold)] bg-[var(--gold-surface)] text-[var(--gold-dark)]"
          : "border-[var(--border)] bg-[var(--bg-secondary)] text-slate-600 hover:bg-[var(--bg-input)]"
      ].join(" ")}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{section.title}</span>
      <span className="sm:hidden">{index + 1}</span>
    </button>
  );
}

function Field({ label, icon: Icon, error, required = false, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">
        <span className="inline-flex items-center gap-2">
          {Icon ? <Icon size={14} className="text-[var(--gold-dark)]" /> : null}
          <span>{label}</span>
          {required ? <span className="text-red-500">*</span> : null}
        </span>
      </label>

      <div className={["app-input px-3 py-2.5", error ? "border-red-300" : ""].join(" ")}>{children}</div>
      {error ? <p className="mt-1.5 text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}

function Input(props) {
  return <input {...props} className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />;
}

function Select({ options, ...props }) {
  return (
    <select {...props} className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none">
      <option value="">اختر...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full resize-none border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
    />
  );
}

export default function StudentFormWizard({ onSubmit, loading = false }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [nationalIdInfo, setNationalIdInfo] = useState(null);

  const currentSection = useMemo(() => sections[activeSection], [activeSection]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleNationalIdChange(value) {
    updateField("nationalId", value);

    if (!value || value.length !== 14) {
      setNationalIdInfo(null);
      return;
    }

    const parsed = parseEgyptianNationalId(value);
    setNationalIdInfo(parsed);

    if (parsed.isValid) {
      setForm((prev) => ({
        ...prev,
        nationalId: value,
        birthDate: parsed.birthDate,
        age: parsed.age,
        gender: parsed.gender,
        governorate: parsed.governorate
      }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = studentSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path?.[0];
        if (fieldName && !fieldErrors[fieldName]) fieldErrors[fieldName] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit?.(result.data, {
      reset: () => {
        setForm(initialState);
        setErrors({});
        setNationalIdInfo(null);
        setActiveSection(0);
      }
    });
  }

  function nextSection() {
    setActiveSection((prev) => Math.min(prev + 1, sections.length - 1));
  }

  function prevSection() {
    setActiveSection((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="space-y-4">
      <section className="theme-surface rounded-2xl p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {sections.map((section, index) => (
            <SectionTab
              key={section.key}
              section={section}
              active={index === activeSection}
              index={index}
              onClick={() => setActiveSection(index)}
            />
          ))}
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="theme-surface rounded-3xl p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="theme-icon-box rounded-xl p-2.5">
              <currentSection.icon size={18} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{currentSection.title}</h3>
              <p className="text-xs text-slate-500">الخطوة {activeSection + 1} من {sections.length}</p>
            </div>
          </div>

          {currentSection.key === "basic" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="كود الطالب" icon={School}><Input value={form.studentCode} onChange={(e) => updateField("studentCode", e.target.value)} placeholder="اختياري" /></Field>
              <Field label="الاسم الكامل" icon={User} error={errors.fullName} required><Input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="الاسم الكامل" /></Field>
              <Field label="الرقم القومي" icon={IdCard} error={errors.nationalId}><Input value={form.nationalId} onChange={(e) => handleNationalIdChange(e.target.value)} placeholder="14 رقم" maxLength={14} /></Field>
              <Field label="رقم الهاتف" icon={Phone} error={errors.phone}><Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="تاريخ الميلاد" error={errors.birthDate}><Input value={form.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} type="date" disabled={!!nationalIdInfo?.isValid} /></Field>
              <Field label="العمر" error={errors.age}><Input value={form.age ?? ""} onChange={(e) => updateField("age", e.target.value ? Number(e.target.value) : null)} type="number" disabled={!!nationalIdInfo?.isValid} placeholder="العمر" /></Field>
              <Field label="النوع" error={errors.gender}><Select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} options={GENDER_OPTIONS} disabled={!!nationalIdInfo?.isValid} /></Field>
              <Field label="المحافظة" error={errors.governorate}><Input value={form.governorate} onChange={(e) => updateField("governorate", e.target.value)} disabled={!!nationalIdInfo?.isValid} placeholder="المحافظة" /></Field>
              <Field label="الفرع" error={errors.branchId}><Select value={form.branchId} onChange={(e) => updateField("branchId", e.target.value)} options={BRANCH_OPTIONS} /></Field>
              <Field label="الحالة" error={errors.status}><Select value={form.status} onChange={(e) => updateField("status", e.target.value)} options={STATUS_OPTIONS} /></Field>
              <Field label="نوع الالتحاق" error={errors.joinType}><Select value={form.joinType} onChange={(e) => updateField("joinType", e.target.value)} options={JOIN_TYPE_OPTIONS} /></Field>
              <Field label="تاريخ الالتحاق"><Input value={form.enrollmentDate} onChange={(e) => updateField("enrollmentDate", e.target.value)} type="date" /></Field>

              {nationalIdInfo && !nationalIdInfo.isValid ? (
                <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">{nationalIdInfo.message}</div>
              ) : null}
            </div>
          ) : null}

          {currentSection.key === "education" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="المستوى" error={errors.levelId}><Select value={form.levelId} onChange={(e) => updateField("levelId", e.target.value)} options={LEVEL_OPTIONS} /></Field>
              <Field label="الحلقة" error={errors.classId}><Select value={form.classId} onChange={(e) => updateField("classId", e.target.value)} options={CLASS_OPTIONS} /></Field>
              <Field label="مقدار الحفظ الحالي"><Input value={form.memorizationAmount} onChange={(e) => updateField("memorizationAmount", e.target.value)} placeholder="مثال: 3 أجزاء" /></Field>
              <div className="md:col-span-2">
                <Field label="ملاحظات تعليمية"><Textarea value={form.academicNotes} onChange={(e) => updateField("academicNotes", e.target.value)} rows={4} placeholder="ملاحظات تعليمية" /></Field>
              </div>
            </div>
          ) : null}

          {currentSection.key === "health" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="أمراض مزمنة"><Textarea value={form.chronicDiseaseDetails} onChange={(e) => updateField("chronicDiseaseDetails", e.target.value)} rows={3} placeholder="إن وجد" /></Field>
              <Field label="حساسية"><Textarea value={form.allergyDetails} onChange={(e) => updateField("allergyDetails", e.target.value)} rows={3} placeholder="إن وجد" /></Field>
              <Field label="أدوية مستمرة"><Textarea value={form.medications} onChange={(e) => updateField("medications", e.target.value)} rows={3} placeholder="الأدوية الحالية" /></Field>
              <Field label="احتياجات خاصة"><Textarea value={form.specialNeeds} onChange={(e) => updateField("specialNeeds", e.target.value)} rows={3} placeholder="إن وجد" /></Field>
              <div className="md:col-span-2">
                <Field label="ملاحظات صحية"><Textarea value={form.healthNotes} onChange={(e) => updateField("healthNotes", e.target.value)} rows={4} placeholder="ملاحظات إضافية" /></Field>
              </div>
            </div>
          ) : null}

          {currentSection.key === "contact" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="العنوان"><Input value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="العنوان بالتفصيل" /></Field>
              <Field label="المنطقة"><Input value={form.area} onChange={(e) => updateField("area", e.target.value)} placeholder="المنطقة" /></Field>
              <div className="md:col-span-2">
                <Field label="علامة دالة"><Input value={form.landmark} onChange={(e) => updateField("landmark", e.target.value)} placeholder="أقرب معلم" /></Field>
              </div>
            </div>
          ) : null}

          {currentSection.key === "guardian" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="اسم ولي الأمر" icon={Users} error={errors.guardianName}><Input value={form.guardianName} onChange={(e) => updateField("guardianName", e.target.value)} placeholder="الاسم الكامل" /></Field>
              <Field label="رقم هاتف ولي الأمر" icon={Phone} error={errors.guardianPhone}><Input value={form.guardianPhone} onChange={(e) => updateField("guardianPhone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="صلة القرابة" error={errors.guardianRelation}><Select value={form.guardianRelation} onChange={(e) => updateField("guardianRelation", e.target.value)} options={RELATION_OPTIONS} /></Field>
            </div>
          ) : null}

          {currentSection.key === "family" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="اسم الأب" error={errors.fatherName}><Input value={form.fatherName} onChange={(e) => updateField("fatherName", e.target.value)} placeholder="اسم الأب" /></Field>
              <Field label="هاتف الأب" error={errors.fatherPhone}><Input value={form.fatherPhone} onChange={(e) => updateField("fatherPhone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="الرقم القومي للأب" error={errors.fatherNationalId}><Input value={form.fatherNationalId} onChange={(e) => updateField("fatherNationalId", e.target.value)} placeholder="14 رقم" maxLength={14} /></Field>
              <Field label="وظيفة الأب"><Input value={form.fatherJobTitle} onChange={(e) => updateField("fatherJobTitle", e.target.value)} placeholder="المهنة" /></Field>
              <Field label="اسم الأم" error={errors.motherName}><Input value={form.motherName} onChange={(e) => updateField("motherName", e.target.value)} placeholder="اسم الأم" /></Field>
              <Field label="هاتف الأم" error={errors.motherPhone}><Input value={form.motherPhone} onChange={(e) => updateField("motherPhone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="وظيفة الأم"><Input value={form.motherJobTitle} onChange={(e) => updateField("motherJobTitle", e.target.value)} placeholder="المهنة" /></Field>
            </div>
          ) : null}

          {currentSection.key === "emergency" ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="اسم جهة الطوارئ" error={errors.emergencyContactName}><Input value={form.emergencyContactName} onChange={(e) => updateField("emergencyContactName", e.target.value)} placeholder="اسم الشخص" /></Field>
              <Field label="هاتف الطوارئ" error={errors.emergencyContactPhone}><Input value={form.emergencyContactPhone} onChange={(e) => updateField("emergencyContactPhone", e.target.value)} placeholder="01xxxxxxxxx" /></Field>
              <Field label="صلة القرابة" error={errors.emergencyContactRelation}><Input value={form.emergencyContactRelation} onChange={(e) => updateField("emergencyContactRelation", e.target.value)} placeholder="مثال: عم / خال" /></Field>
            </div>
          ) : null}

          {currentSection.key === "admin" ? (
            <div className="grid grid-cols-1 gap-3">
              <Field label="ملاحظات إدارية" error={errors.adminNotes}><Textarea value={form.adminNotes} onChange={(e) => updateField("adminNotes", e.target.value)} rows={5} placeholder="ملاحظات خاصة لإدارة النظام" /></Field>
            </div>
          ) : null}
        </section>

        <section className="theme-surface rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={prevSection}
              disabled={activeSection === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50"
            >
              <ChevronRight size={15} />
              <span>السابق</span>
            </button>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setForm(initialState);
                  setErrors({});
                  setNationalIdInfo(null);
                  setActiveSection(0);
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                إعادة تعيين
              </button>

              {activeSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white"
                >
                  <span>التالي</span>
                  <ChevronLeft size={15} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(139,109,47,0.26)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "جاري الحفظ..." : "حفظ الطالب"}
                </button>
              )}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
