import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  ClipboardCheck,
  ScrollText,
  Wallet,
  LogOut,
  Menu,
  X,
  MoonStar,
  Sparkles,
  BookUser,
  GraduationCap
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

function buildNavItems(role) {
  const adminItems = [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/students", label: "الطلاب", icon: Users },
    { to: "/guardians", label: "أولياء الأمور", icon: UserSquare2 },
    { to: "/classes", label: "الحلقات", icon: BookOpen },
    { to: "/attendance", label: "الحضور", icon: ClipboardCheck },
    { to: "/memorization", label: "التسميع", icon: ScrollText },
    { to: "/finance", label: "المالية", icon: Wallet }
  ];

  const teacherItems = [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/classes", label: "حلقاتي", icon: BookOpen },
    { to: "/attendance", label: "الحضور", icon: ClipboardCheck },
    { to: "/memorization", label: "التسميع", icon: ScrollText }
  ];

  const parentItems = [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/students", label: "الأبناء", icon: Users },
    { to: "/finance", label: "الرسوم", icon: Wallet }
  ];

  const studentItems = [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard },
    { to: "/memorization", label: "التسميع", icon: ScrollText }
  ];

  if (role === "teacher") return teacherItems;
  if (role === "parent") return parentItems;
  if (role === "student") return studentItems;
  return adminItems;
}

function roleLabel(role) {
  switch (role) {
    case "admin":
      return "مدير النظام";
    case "teacher":
      return "محفظ";
    case "parent":
      return "ولي أمر";
    case "student":
      return "طالب";
    default:
      return "مستخدم";
  }
}

function roleIcon(role) {
  switch (role) {
    case "teacher":
      return BookUser;
    case "parent":
      return UserSquare2;
    case "student":
      return GraduationCap;
    default:
      return MoonStar;
  }
}

function NavItem({ to, label, icon: Icon, onClick, compact = false }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-2xl font-semibold transition-all",
          compact ? "px-3 py-2 text-[13px]" : "px-4 py-3 text-sm",
          isActive
            ? "bg-emerald-700 text-white shadow-sm"
            : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
        ].join(" ")
      }
    >
      <span>{label}</span>
      <Icon size={compact ? 15 : 18} />
    </NavLink>
  );
}

function SidebarContent({
  onItemClick,
  userProfile,
  firebaseUser,
  logout,
  compact = false,
  navItems
}) {
  const RoleIcon = roleIcon(userProfile?.role);

  return (
    <div className="flex min-h-full flex-col">
      <div
        className={[
          "bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white shadow-sm",
          compact ? "mb-3 rounded-[20px] p-3" : "mb-4 rounded-[26px] p-3.5"
        ].join(" ")}
      >
        <div className={["flex items-center justify-between", compact ? "mb-2.5" : "mb-3"].join(" ")}>
          <span
            className={[
              "rounded-full bg-amber-400/90 font-bold text-emerald-950",
              compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1 text-xs"
            ].join(" ")}
          >
            {roleLabel(userProfile?.role)}
          </span>

          <div
            className={[
              "rounded-2xl bg-white/15 text-amber-100",
              compact ? "p-1.5" : "p-2"
            ].join(" ")}
          >
            <RoleIcon size={compact ? 15 : 18} />
          </div>
        </div>

        <h2
          className={[
            "m-0 font-extrabold leading-7",
            compact ? "text-[13px]" : "text-base"
          ].join(" ")}
        >
          دار المناجاة لتحفيظ القرآن الكريم
        </h2>

        <p
          className={[
            "text-emerald-50/90",
            compact ? "mt-1 text-[11px] leading-5" : "mt-1 text-xs leading-6"
          ].join(" ")}
        >
          {userProfile?.fullName || "مستخدم النظام"}
        </p>

        <div
          className={[
            "rounded-2xl bg-white/10",
            compact ? "mt-2.5 px-2.5 py-2" : "mt-3 px-3 py-2"
          ].join(" ")}
        >
          <p
            className={[
              "m-0 text-emerald-50/80",
              compact ? "text-[10px]" : "text-[11px]"
            ].join(" ")}
          >
            المستخدم الحالي
          </p>

          <p
            className={[
              "m-0 truncate font-bold",
              compact ? "text-[12px]" : "text-sm"
            ].join(" ")}
          >
            {userProfile?.email || firebaseUser?.email || "مستخدم"}
          </p>

          <p
            className={[
              "m-0 text-emerald-50/80",
              compact ? "mt-1 text-[10px]" : "mt-1 text-[11px]"
            ].join(" ")}
          >
            الدور: {roleLabel(userProfile?.role)}
          </p>
        </div>
      </div>

      <div
        className={[
          "px-1 font-semibold text-slate-500",
          compact ? "mb-2 text-[10px]" : "mb-3 text-xs"
        ].join(" ")}
      >
        التنقل الرئيسي
      </div>

      <nav className={compact ? "space-y-1" : "space-y-2"}>
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            onClick={onItemClick}
            compact={compact}
          />
        ))}
      </nav>

      <div className={compact ? "mt-auto pt-3" : "mt-auto pt-4"}>
        <button
          onClick={logout}
          className={[
            "flex w-full items-center justify-between rounded-2xl bg-red-500 font-bold text-white transition hover:bg-red-600",
            compact ? "px-3 py-2.5 text-[12px]" : "px-4 py-3 text-sm"
          ].join(" ")}
        >
          <span>تسجيل الخروج</span>
          <LogOut size={compact ? 15 : 18} />
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { firebaseUser, userProfile, logout, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(() => buildNavItems(role), [role]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="m-0 text-xl font-extrabold text-slate-900 sm:text-2xl">
                دار تحفيظ القرآن الكريم
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                هوية عربية حديثة بطابع إسلامي هادئ ومتوافق مع الأجهزة اللوحية
              </p>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-right sm:block">
            <p className="m-0 text-xs text-amber-700">النسخة الحالية</p>
            <p className="m-0 flex items-center gap-2 text-sm font-bold text-amber-900">
              <Sparkles size={14} />
              <span>{roleLabel(role)}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:px-8">
        <aside className="hidden self-start rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] lg:block">
          <SidebarContent
            userProfile={userProfile}
            firebaseUser={firebaseUser}
            logout={logout}
            navItems={navItems}
          />
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[68%] max-w-[220px] overflow-y-auto bg-white p-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-base font-extrabold text-slate-900">القائمة</h3>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <SidebarContent
              userProfile={userProfile}
              firebaseUser={firebaseUser}
              logout={logout}
              onItemClick={() => setSidebarOpen(false)}
              compact
              navItems={navItems}
            />
          </div>
        </div>
      )}
    </div>
  );
}