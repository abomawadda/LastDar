import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  MoonStar,
  ShieldCheck,
  Landmark,
  BookOpenText,
  UserCog,
  GraduationCap,
  Users,
  BookUser
} from "lucide-react";
import { auth } from "../../../lib/firebase/auth";

const DEMO_ACCOUNTS = [
  {
    label: "مدير النظام",
    email: "admin@dar.te",
    password: "12345678",
    icon: UserCog
  },
  {
    label: "محفظ",
    email: "teacher@dar.te",
    password: "12345678",
    icon: BookUser
  },
  {
    label: "ولي أمر",
    email: "parent@dar.te",
    password: "12345678",
    icon: Users
  },
  {
    label: "طالب",
    email: "student@dar.te",
    password: "12345678",
    icon: GraduationCap
  }
];

function FeatureItem({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/8 p-4">
      <div className="rounded-2xl bg-white/10 p-3 text-amber-200">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="m-0 text-sm font-bold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-6 text-emerald-50/85">{desc}</p>
      </div>
    </div>
  );
}

function DemoAccountButton({ account, onSelect }) {
  const Icon = account.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(account)}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right transition hover:border-emerald-300 hover:bg-emerald-50"
    >
      <div>
        <p className="m-0 text-sm font-bold text-slate-900">{account.label}</p>
        <p className="mt-1 text-xs text-slate-500">{account.email}</p>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700">
        <Icon size={18} />
      </div>
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch {
      setError("فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemoAccount(account) {
    setForm({
      email: account.email,
      password: account.password
    });
    setError("");
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="islamic-pattern relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,77,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_20%)]" />

          <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
                <MoonStar size={16} className="text-amber-300" />
                <span>Executive Islamic Theme</span>
              </div>

              <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
                Quran ERP
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-3 text-sm font-semibold tracking-wide text-amber-200">
                نظام مؤسسي متكامل
              </p>

              <h1 className="m-0 text-4xl font-extrabold leading-[1.7] text-white xl:text-5xl">
                إدارة احترافية لدار
                <br />
                تحفيظ القرآن الكريم
              </h1>

              <p className="mt-5 text-base leading-8 text-emerald-50/90">
                منصة تشغيل حديثة لإدارة الطلاب، أولياء الأمور، المحفظين، الحلقات،
                الحضور، التسميع، والرسوم بواجهة عربية احترافية.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <FeatureItem
                icon={BookOpenText}
                title="إدارة تعليمية"
                desc="متابعة الحفظ والمراجعة والتقدم اليومي للطلاب."
              />
              <FeatureItem
                icon={Landmark}
                title="هوية إسلامية"
                desc="ألوان هادئة وطابع بصري مناسب لبيئة دار التحفيظ."
              />
              <FeatureItem
                icon={ShieldCheck}
                title="دخول آمن"
                desc="تسجيل دخول موحد مع إمكان بناء الصلاحيات لاحقًا."
              />
              <FeatureItem
                icon={MoonStar}
                title="توافق كامل"
                desc="مصمم ليعمل بشكل ممتاز على التابلت والموبايل."
              />
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-0 islamic-grid opacity-70" />

          <div className="glass-surface elevated-shadow relative z-10 w-full max-w-[560px] rounded-[32px] border border-[var(--border)] p-6 sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-emerald-700 to-emerald-800 text-white shadow-lg">
                <MoonStar size={28} />
              </div>

              <h2 className="m-0 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                تسجيل الدخول
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                أدخل بيانات الدخول أو اختر حسابًا تجريبيًا جاهزًا
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-sm font-extrabold text-slate-800">
                حسابات التجربة
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <DemoAccountButton
                    key={account.email}
                    account={account}
                    onSelect={fillDemoAccount}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  البريد الإلكتروني
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <Mail size={18} className="text-emerald-700" />
                  <input
                    type="email"
                    placeholder="admin@dar.te"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  كلمة المرور
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
                  <LockKeyhole size={18} className="text-emerald-700" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-500 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-l from-emerald-700 to-emerald-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(5,150,105,0.22)] transition hover:from-emerald-800 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "جاري تسجيل الدخول..." : "دخول إلى النظام"}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs leading-6 text-amber-800">
              هذه الحسابات للتجربة فقط. لاحقًا سننقل تسجيل الدخول إلى رقم الموبايل و OTP.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}