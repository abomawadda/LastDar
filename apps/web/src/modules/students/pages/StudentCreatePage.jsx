import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";
import { createStudent } from "../services/students.service";
import StudentFormWizard from "../components/StudentFormWizard";

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateStudent(form, helpers) {
    setLoading(true);
    setError("");

    try {
      await createStudent(form);
      helpers?.reset?.();
      navigate("/students");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ بيانات الطالب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="theme-hero rounded-3xl p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="theme-chip mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <UserPlus size={15} />
              <span>تسجيل طالب جديد</span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-4xl">إنشاء ملف طالب</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              أدخل البيانات الأساسية والتعليمية والصحية وبيانات ولي الأمر عبر نموذج مرن متعدد الخطوات.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/students")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2.5 text-sm font-extrabold text-[var(--gold-dark)] transition hover:bg-[#f9f1dc]"
          >
            <ArrowRight size={16} />
            <span>العودة للقائمة</span>
          </button>
        </div>
      </section>

      {error ? (
        <div className="theme-surface rounded-2xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <StudentFormWizard onSubmit={handleCreateStudent} loading={loading} />
    </div>
  );
}
