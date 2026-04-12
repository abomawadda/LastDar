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

function AdminDashboard() {
  const stats = [
    { title: "إجمالي الطلاب", value: "128", note: "نشطون حاليًا", icon: Users },
    { title: "الحلقات", value: "12", note: "صباحية ومسائية", icon: BookOpen },
    { title: "الحضور اليوم", value: "91%", note: "آخر تحديث اليوم", icon: ClipboardCheck },
    { title: "الرسوم المستحقة", value: "14", note: "تحتاج متابعة", icon: Wallet }
  ];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-amber-300/10 blur-2xl" />

        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
            <Sparkles size={16} />
            <span>لوحة المدير</span>
          </div>

          <h2 className="m-0 text-2xl font-extrabold leading-relaxed sm:text-4xl">
            لوحة التحكم الإدارية
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
            متابعة شاملة للطلاب، أولياء الأمور، الحلقات، الحضور، التسميع، والمالية.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-slate-500">{item.title}</p>
                  <h3 className="mt-3 text-4xl font-extrabold text-slate-900">{item.value}</h3>
                  <p className="mt-2 text-sm text-slate-500">{item.note}</p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <Icon size={22} />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <BookUser size={16} />
          <span>لوحة المحفظ</span>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">مرحبًا بك يا محفظ</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
          من هنا ستتابع حلقاتك، الحضور اليومي، التسميع، والطلاب المتأخرين.
        </p>
      </section>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h3 className="text-xl font-extrabold text-slate-900">مهامك اليوم</h3>
        <p className="mt-3 text-sm leading-8 text-slate-600">
          سيتم هنا لاحقًا عرض الحلقات المسندة إليك، جلسات الحضور، والتسميع اليومي.
        </p>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <UserSquare2 size={16} />
          <span>لوحة ولي الأمر</span>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">متابعة الأبناء</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
          من هنا سيتم متابعة الحضور، التقدم، الرسوم، والتقارير الخاصة بالأبناء.
        </p>
      </section>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h3 className="text-xl font-extrabold text-slate-900">ملف الأبناء</h3>
        <p className="mt-3 text-sm leading-8 text-slate-600">
          سيتم عرض الأبناء المرتبطين بهذا الحساب بمجرد اكتمال الربط التلقائي.
        </p>
      </div>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="space-y-5">
      <section className="rounded-[30px] bg-gradient-to-l from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-[0_18px_40px_rgba(5,150,105,0.18)] sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <GraduationCap size={16} />
          <span>لوحة الطالب</span>
        </div>

        <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">مرحبًا بك</h2>
        <p className="mt-3 max-w-3xl text-sm leading-8 text-emerald-50 sm:text-base">
          من هنا ستتابع مستوى تقدمك، حضورك، تسميعك، وخطتك التعليمية.
        </p>
      </section>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        <h3 className="text-xl font-extrabold text-slate-900">ملف الطالب</h3>
        <p className="mt-3 text-sm leading-8 text-slate-600">
          سيتم هنا عرض بياناتك التعليمية والتقارير الخاصة بك.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  if (role === "teacher") return <TeacherDashboard />;
  if (role === "parent") return <ParentDashboard />;
  if (role === "student") return <StudentDashboard />;

  return <AdminDashboard />;
}