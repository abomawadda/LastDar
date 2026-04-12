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
        setSuccessMessage("ولي الأمر موجود مسبقًا، وتم استخدام السجل الحالي بدون تكرار.");
      }

      setTimeout(() => {
        navigate("/guardians");
      }, 700);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ بيانات ولي الأمر.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <UserPlus size={14} />
              <span>إضافة ولي أمر</span>
            </div>

            <h1 className="m-0 text-2xl font-extrabold text-slate-900">
              إنشاء ملف ولي أمر
            </h1>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              أدخل بيانات ولي الأمر الأساسية، وسيتم منع التكرار تلقائيًا اعتمادًا على رقم الموبايل.
            </p>
          </div>

          <button
            onClick={() => navigate("/guardians")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowRight size={16} />
            <span>العودة إلى قائمة أولياء الأمور</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <GuardianForm onSubmit={handleCreateGuardian} loading={loading} />
      </div>
    </div>
  );
}