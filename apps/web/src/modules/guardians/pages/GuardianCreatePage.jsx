import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";
import { findOrCreateGuardianByPhone } from "../services/guardians.service";
import GuardianForm from "../components/GuardianForm";

export default function GuardianCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleCreateGuardian(form, helpers) {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await findOrCreateGuardianByPhone(form);
      helpers?.reset?.();

      if (result.created) {
        setSuccessMessage("تم إنشاء ملف ولي الأمر بنجاح.");
      } else {
        setSuccessMessage("ولي الأمر موجود مسبقًا، وتم استخدام السجل الحالي دون تكرار.");
      }

      setTimeout(() => navigate("/guardians"), 700);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ بيانات ولي الأمر.");
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
              <span>إضافة ولي أمر</span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-4xl">إنشاء ملف ولي أمر</h1>
            <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">
              أدخل بيانات ولي الأمر الأساسية، وسيتم منع التكرار تلقائيًا بالاعتماد على رقم الهاتف.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/guardians")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gold-surface)] px-4 py-2.5 text-sm font-extrabold text-[var(--gold-dark)] transition hover:bg-[#f9f1dc]"
          >
            <ArrowRight size={16} />
            <span>العودة للقائمة</span>
          </button>
        </div>
      </section>

      {error ? (
        <div className="theme-surface rounded-2xl border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.06)] px-4 py-3 text-sm font-bold text-red-700">{error}</div>
      ) : null}

      {successMessage ? (
        <div className="theme-surface rounded-2xl border-[rgba(5,150,105,0.2)] bg-[rgba(5,150,105,0.08)] px-4 py-3 text-sm font-bold text-green-700">{successMessage}</div>
      ) : null}

      <section className="theme-surface rounded-3xl p-4 sm:p-5">
        <GuardianForm onSubmit={handleCreateGuardian} loading={loading} />
      </section>
    </div>
  );
}
