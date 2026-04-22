import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  MoonStar,
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
    label: "محفّظ",
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

function DemoAccountButton({ account, onSelect }) {
  const Icon = account.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(account)}
      className="theme-surface flex items-center justify-between rounded-xl px-3 py-2.5 text-right transition hover:bg-[var(--gold-surface)]"
    >
      <div>
        <p className="text-sm font-bold text-slate-900">{account.label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{account.email}</p>
      </div>

      <div className="theme-icon-box rounded-lg p-2">
        <Icon size={16} />
      </div>
    </button>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
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
    setForm({ email: account.email, password: account.password });
    setError("");
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-6 sm:px-6">
      <div className="mx-auto grid w-full max-w-[1100px] gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="theme-hero islamic-pattern hidden rounded-3xl p-8 text-white lg:flex lg:min-h-[620px] lg:flex-col lg:justify-between">
          <div className="theme-chip inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm">
            <MoonStar size={15} />
            <span>واجهة قرآنية احترافية</span>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold leading-[1.9]">
              دار المناجاة
              <br />
              لتحفيظ القرآن الكريم
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/85">
              منصة موحّدة لإدارة الطلاب والحلقات والحضور والتسميع والمالية بتجربة عصرية مرنة وسريعة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="theme-chip rounded-2xl p-3">إدارة الطلاب</div>
            <div className="theme-chip rounded-2xl p-3">متابعة الحفظ</div>
            <div className="theme-chip rounded-2xl p-3">حضور ذكي</div>
            <div className="theme-chip rounded-2xl p-3">تقارير مالية</div>
          </div>
        </section>

        <section className="relative">
          <div className="glass-surface elevated-shadow relative rounded-3xl border border-[var(--border)] p-5 sm:p-7">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold-light)] to-[var(--gold-dark)] text-white shadow-lg">
                <MoonStar size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">تسجيل الدخول</h2>
              <p className="mt-2 text-sm text-slate-500">أدخل بياناتك أو اختر حسابًا تجريبيًا جاهزًا</p>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {DEMO_ACCOUNTS.map((account) => (
                <DemoAccountButton key={account.email} account={account} onSelect={fillDemoAccount} />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
                <div className="app-input flex items-center gap-2.5 px-3 py-2.5">
                  <Mail size={16} className="text-[var(--gold-dark)]" />
                  <input
                    type="email"
                    placeholder="admin@dar.te"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">كلمة المرور</label>
                <div className="app-input flex items-center gap-2.5 px-3 py-2.5">
                  <LockKeyhole size={16} className="text-[var(--gold-dark)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-500 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">{error}</div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-l from-[var(--gold-light)] to-[var(--gold-dark)] px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(139,109,47,0.26)] transition hover:from-[#c79c46] hover:to-[#5d471a] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "جاري تسجيل الدخول..." : "دخول إلى النظام"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
