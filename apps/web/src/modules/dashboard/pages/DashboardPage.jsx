import {
  Users,
  BookOpen,
  ClipboardCheck,
  Wallet,
  Sparkles,
  GraduationCap,
  BookUser,
  UserSquare2
} from "lucide-react";
import { useAuth } from "../../../app/providers/AuthProvider";

function Hero({ icon: Icon, badge, title, description }) {
  return (
    <section className="theme-hero relative overflow-hidden rounded-3xl p-6 text-white sm:p-8">
      <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        <div className="theme-chip mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
          <Icon size={15} />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl font-extrabold sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-white/85 sm:text-base">{description}</p>
      </div>
    </section>
  );
}

function StatCard({ title, value, note, icon: Icon }) {
  return (
    <article className="theme-stat-card rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-500 sm:text-sm">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{note}</p>
        </div>

        <div className="theme-icon-box rounded-xl p-2.5">
          <Icon size={18} />
        </div>
      </div>
    </article>
  );
}

function AdminDashboard() {
  const stats = [
    { title: "إجمالي الطلاب", value: "128", note: "نشطون حاليًا", icon: Users },
    { title: "الحلقات", value: "12", note: "صباحية ومسائية", icon: BookOpen },
    { title: "حضور اليوم", value: "91%", note: "آخر تحديث اليوم", icon: ClipboardCheck },
    { title: "رسوم مستحقة", value: "14", note: "تحتاج متابعة", icon: Wallet }
  ];

  return (
    <div className="space-y-4">
      <Hero
        icon={Sparkles}
        badge="لوحة المدير"
        title="لوحة التحكم الإدارية"
        description="متابعة شاملة للطلاب وأولياء الأمور والحلقات والحضور والتسميع والمالية في مكان واحد."
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </section>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="space-y-4">
      <Hero
        icon={BookUser}
        badge="لوحة المحفّظ"
        title="متابعة الحلقات اليومية"
        description="تابع الحضور والتسميع وخطة الحفظ اليومية لطلابك بشكل سريع وسلس."
      />

      <section className="theme-surface rounded-3xl p-5">
        <h3 className="text-lg font-extrabold text-slate-900">مهام اليوم</h3>
        <p className="mt-2 text-sm leading-8 text-slate-600">سيتم هنا عرض الحلقات المسندة إليك وجلسات التسميع والطلاب المتأخرين.</p>
      </section>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-4">
      <Hero
        icon={UserSquare2}
        badge="لوحة ولي الأمر"
        title="متابعة الأبناء"
        description="متابعة الحضور والتقدم والرسوم الخاصة بالأبناء بواجهة واضحة وسهلة."
      />

      <section className="theme-surface rounded-3xl p-5">
        <h3 className="text-lg font-extrabold text-slate-900">ملف الأبناء</h3>
        <p className="mt-2 text-sm leading-8 text-slate-600">ستظهر هنا بيانات الأبناء المرتبطين بحسابك بعد اكتمال الربط.</p>
      </section>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="space-y-4">
      <Hero
        icon={GraduationCap}
        badge="لوحة الطالب"
        title="رحلة الحفظ"
        description="متابعة إنجازك اليومي في الحفظ والمراجعة والحضور بخطوات واضحة."
      />

      <section className="theme-surface rounded-3xl p-5">
        <h3 className="text-lg font-extrabold text-slate-900">ملف الطالب</h3>
        <p className="mt-2 text-sm leading-8 text-slate-600">ستظهر هنا تقاريرك التعليمية وتوصيات المتابعة.</p>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const { role, authLoading } = useAuth();

  if (authLoading) {
    return <div className="theme-surface rounded-3xl p-5 text-sm text-slate-500">جاري تحميل لوحة التحكم...</div>;
  }

  if (role === "teacher") return <TeacherDashboard />;
  if (role === "parent") return <ParentDashboard />;
  if (role === "student") return <StudentDashboard />;

  return <AdminDashboard />;
}
