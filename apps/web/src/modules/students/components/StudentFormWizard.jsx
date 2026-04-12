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
  IdCard
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
  { value: "frozen", label: "موقوف" }
];

const JOIN_TYPE_OPTIONS = [
  { value: "regular", label: "عادي" },
  { value: "scholarship", label: "منحة" },
  { value: "discounted", label: "مخفض" }
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
  { key: "education", title: "البيانات التعليمية", icon: GraduationCap },
  { key: "health", title: "البيانات الصحية", icon: HeartPulse },
  { key: "communication", title: "بيانات التواصل", icon: Phone },
  { key: "guardian", title: "بيانات ولي الأمر", icon: Users },
  { key: "parents", title: "بيانات الوالدين", icon: IdCard },
  { key: "emergency", title: "الطوارئ", icon: ShieldAlert },
  { key: "admin", title: "بيانات إدارية", icon: FileText }
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

function SectionTab({ title, icon: Icon, active, onClick, index }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-bold transition",
        active
          ? "border-emerald-600 bg-emerald-600 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      ].join(" ")}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{title}</span>
      <span className="sm:hidden">{index + 1}</span>
    </button>
  );
}

function Field({ label, error, children, required = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required ? <span className="mr-1 text-red-500">*</span> : null}
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

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
    />
  );
}

function Select({ options, ...props }) {
  return (
    <select
      {...props}
      className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none"
    >
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

    if (!parsed.isValid) {
      setNationalIdInfo(parsed);
      return;
    }

    setNationalIdInfo(parsed);

    setForm((prev) => ({
      ...prev,
      nationalId: value,
      birthDate: parsed.birthDate,
      age: parsed.age,
      gender: parsed.gender,
      governorate: parsed.governorate
    }));
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
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {sections.map((section, index) => (
          <SectionTab
            key={section.key}
            title={section.title}
            icon={section.icon}
            active={index === activeSection}
            onClick={() => setActiveSection(index)}
            index={index}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <currentSection.icon size={20} />
            </div>
            <div>
              <h3 className="m-0 text-xl font-extrabold text-slate-900">
                {currentSection.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                القسم {activeSection + 1} من {sections.length}
              </p>
            </div>
          </div>

          {activeSection === 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="كود الطالب">
                <Input
                  value={form.studentCode}
                  onChange={(e) => updateField("studentCode", e.target.value)}
                  placeholder="سيتم توليده لاحقًا أو يُكتب يدويًا"
                />
              </Field>

              <Field label="الاسم الكامل" error={errors.fullName} required>
                <Input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="الاسم الرباعي"
                />
              </Field>

              <Field label="الرقم القومي" error={errors.nationalId}>
                <Input
                  value={form.nationalId}
                  onChange={(e) => handleNationalIdChange(e.target.value)}
                  placeholder="14 رقمًا"
                  maxLength={14}
                />
              </Field>

              <Field label="رقم الموبايل" error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </Field>

              <Field label="تاريخ الميلاد" error={errors.birthDate}>
                <Input
                  value={form.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  type="date"
                  disabled={!!(nationalIdInfo && nationalIdInfo.isValid)}
                />
              </Field>

              <Field label="السن" error={errors.age}>
                <Input
                  value={form.age ?? ""}
                  onChange={(e) =>
                    updateField("age", e.target.value ? Number(e.target.value) : null)
                  }
                  type="number"
                  disabled={!!(nationalIdInfo && nationalIdInfo.isValid)}
                  placeholder="السن"
                />
              </Field>

              <Field label="النوع" error={errors.gender}>
                <Select
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  options={GENDER_OPTIONS}
                  disabled={!!(nationalIdInfo && nationalIdInfo.isValid)}
                />
              </Field>

              <Field label="المحافظة" error={errors.governorate}>
                <Input
                  value={form.governorate}
                  onChange={(e) => updateField("governorate", e.target.value)}
                  disabled={!!(nationalIdInfo && nationalIdInfo.isValid)}
                  placeholder="المحافظة"
                />
              </Field>

              <Field label="الفرع" error={errors.branchId}>
                <Select
                  value={form.branchId}
                  onChange={(e) => updateField("branchId", e.target.value)}
                  options={BRANCH_OPTIONS}
                />
              </Field>

              <Field label="الحالة" error={errors.status}>
                <Select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  options={STATUS_OPTIONS}
                />
              </Field>

              <Field label="نوع الالتحاق" error={errors.joinType}>
                <Select
                  value={form.joinType}
                  onChange={(e) => updateField("joinType", e.target.value)}
                  options={JOIN_TYPE_OPTIONS}
                />
              </Field>

              <Field label="تاريخ الالتحاق">
                <Input
                  value={form.enrollmentDate}
                  onChange={(e) => updateField("enrollmentDate", e.target.value)}
                  type="date"
                />
              </Field>

              {nationalIdInfo && !nationalIdInfo.isValid ? (
                <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  {nationalIdInfo.message}
                </div>
              ) : null}

              {nationalIdInfo?.isValid ? (
                <div className="md:col-span-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                  تم استخراج البيانات تلقائيًا من الرقم القومي: تاريخ الميلاد، النوع،
                  المحافظة، والسن.
                </div>
              ) : null}
            </div>
          ) : null}

          {activeSection === 1 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="المستوى" error={errors.levelId}>
                <Select
                  value={form.levelId}
                  onChange={(e) => updateField("levelId", e.target.value)}
                  options={LEVEL_OPTIONS}
                />
              </Field>

              <Field label="الحلقة" error={errors.classId}>
                <Select
                  value={form.classId}
                  onChange={(e) => updateField("classId", e.target.value)}
                  options={CLASS_OPTIONS}
                />
              </Field>

              <Field label="مقدار الحفظ الحالي">
                <Input
                  value={form.memorizationAmount}
                  onChange={(e) => updateField("memorizationAmount", e.target.value)}
                  placeholder="مثال: جزء عم / 5 أجزاء"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="ملاحظات تعليمية">
                  <Textarea
                    value={form.academicNotes}
                    onChange={(e) => updateField("academicNotes", e.target.value)}
                    rows={4}
                    placeholder="أي ملاحظات تخص المستوى أو الأداء التعليمي"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {activeSection === 2 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="الأمراض المزمنة">
                <Textarea
                  value={form.chronicDiseaseDetails}
                  onChange={(e) => updateField("chronicDiseaseDetails", e.target.value)}
                  rows={3}
                  placeholder="اتركه فارغًا إذا لا يوجد"
                />
              </Field>

              <Field label="الحساسية">
                <Textarea
                  value={form.allergyDetails}
                  onChange={(e) => updateField("allergyDetails", e.target.value)}
                  rows={3}
                  placeholder="اتركه فارغًا إذا لا يوجد"
                />
              </Field>

              <Field label="الأدوية المستمرة">
                <Textarea
                  value={form.medications}
                  onChange={(e) => updateField("medications", e.target.value)}
                  rows={3}
                  placeholder="أي أدوية منتظمة"
                />
              </Field>

              <Field label="الاحتياجات الخاصة">
                <Textarea
                  value={form.specialNeeds}
                  onChange={(e) => updateField("specialNeeds", e.target.value)}
                  rows={3}
                  placeholder="إن وجدت"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="ملاحظات صحية للطوارئ">
                  <Textarea
                    value={form.healthNotes}
                    onChange={(e) => updateField("healthNotes", e.target.value)}
                    rows={4}
                    placeholder="أي تنبيهات صحية مهمة"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {activeSection === 3 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="العنوان">
                <Input
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="العنوان بالتفصيل"
                />
              </Field>

              <Field label="المنطقة">
                <Input
                  value={form.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  placeholder="المنطقة أو الحي"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="أقرب نقطة دالة">
                  <Input
                    value={form.landmark}
                    onChange={(e) => updateField("landmark", e.target.value)}
                    placeholder="مثال: بجوار المسجد الكبير"
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {activeSection === 4 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="اسم ولي الأمر" error={errors.guardianName}>
                <Input
                  value={form.guardianName}
                  onChange={(e) => updateField("guardianName", e.target.value)}
                  placeholder="الاسم الكامل"
                />
              </Field>

              <Field label="رقم موبايل ولي الأمر" error={errors.guardianPhone}>
                <Input
                  value={form.guardianPhone}
                  onChange={(e) => updateField("guardianPhone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </Field>

              <Field label="صلة القرابة" error={errors.guardianRelation}>
                <Select
                  value={form.guardianRelation}
                  onChange={(e) => updateField("guardianRelation", e.target.value)}
                  options={RELATION_OPTIONS}
                />
              </Field>

              <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                لاحقًا سيتم الربط التلقائي بولي الأمر عن طريق رقم الموبايل وإنشاء
                أو استدعاء ملف ولي الأمر آليًا.
              </div>
            </div>
          ) : null}

          {activeSection === 5 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="اسم الأب" error={errors.fatherName}>
                <Input
                  value={form.fatherName}
                  onChange={(e) => updateField("fatherName", e.target.value)}
                  placeholder="الاسم الكامل للأب"
                />
              </Field>

              <Field label="رقم موبايل الأب" error={errors.fatherPhone}>
                <Input
                  value={form.fatherPhone}
                  onChange={(e) => updateField("fatherPhone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </Field>

              <Field label="الرقم القومي للأب" error={errors.fatherNationalId}>
                <Input
                  value={form.fatherNationalId}
                  onChange={(e) => updateField("fatherNationalId", e.target.value)}
                  placeholder="14 رقمًا"
                />
              </Field>

              <Field label="وظيفة الأب">
                <Input
                  value={form.fatherJobTitle}
                  onChange={(e) => updateField("fatherJobTitle", e.target.value)}
                  placeholder="المهنة أو الوظيفة"
                />
              </Field>

              <Field label="اسم الأم" error={errors.motherName}>
                <Input
                  value={form.motherName}
                  onChange={(e) => updateField("motherName", e.target.value)}
                  placeholder="الاسم الكامل للأم"
                />
              </Field>

              <Field label="رقم موبايل الأم" error={errors.motherPhone}>
                <Input
                  value={form.motherPhone}
                  onChange={(e) => updateField("motherPhone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </Field>

              <Field label="وظيفة الأم">
                <Input
                  value={form.motherJobTitle}
                  onChange={(e) => updateField("motherJobTitle", e.target.value)}
                  placeholder="المهنة أو الوظيفة"
                />
              </Field>
            </div>
          ) : null}

          {activeSection === 6 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="اسم جهة الطوارئ" error={errors.emergencyContactName}>
                <Input
                  value={form.emergencyContactName}
                  onChange={(e) => updateField("emergencyContactName", e.target.value)}
                  placeholder="اسم الشخص البديل"
                />
              </Field>

              <Field label="رقم الهاتف" error={errors.emergencyContactPhone}>
                <Input
                  value={form.emergencyContactPhone}
                  onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                />
              </Field>

              <Field label="صلة القرابة" error={errors.emergencyContactRelation}>
                <Input
                  value={form.emergencyContactRelation}
                  onChange={(e) => updateField("emergencyContactRelation", e.target.value)}
                  placeholder="مثال: عم / خال / أخ"
                />
              </Field>
            </div>
          ) : null}

          {activeSection === 7 ? (
            <div className="grid grid-cols-1 gap-4">
              <Field label="ملاحظات إدارية" error={errors.adminNotes}>
                <Textarea
                  value={form.adminNotes}
                  onChange={(e) => updateField("adminNotes", e.target.value)}
                  rows={5}
                  placeholder="أي ملاحظات تخص الإدارة أو المنح أو الخصومات أو الحالات الخاصة"
                />
              </Field>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={prevSection}
            disabled={activeSection === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={16} />
            <span>السابق</span>
          </button>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setForm(initialState);
                setErrors({});
                setNationalIdInfo(null);
                setActiveSection(0);
              }}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              إعادة تعيين
            </button>

            {activeSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                <span>التالي</span>
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-gradient-to-l from-emerald-700 to-emerald-600 px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(5,150,105,0.18)] transition hover:from-emerald-800 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "جاري الحفظ..." : "حفظ الطالب"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}