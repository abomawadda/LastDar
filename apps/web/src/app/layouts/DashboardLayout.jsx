import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
      return "محفّظ";
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

function SidebarNavItem({ item, compact = false, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "flex items-center justify-between rounded-xl border px-3 transition-all",
          compact ? "py-2 text-xs" : "py-2.5 text-sm",
          isActive
            ? "border-[var(--border-gold)] bg-[var(--gold-surface)] text-[var(--gold-dark)]"
            : "border-transparent text-slate-600 hover:border-[var(--border)] hover:bg-[var(--bg-input)]"
        ].join(" ")
      }
    >
      <span className="font-bold">{item.label}</span>
      <Icon size={compact ? 15 : 17} />
    </NavLink>
  );
}

function DesktopSidebar({ navItems, userProfile, firebaseUser, role, logout }) {
  const RoleIcon = roleIcon(role);

  return (
    <aside className="theme-surface sticky top-20 hidden h-[calc(100vh-112px)] overflow-y-auto rounded-3xl p-4 lg:block">
      <div className="theme-hero rounded-2xl p-4 text-white">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">{roleLabel(role)}</span>
          <div className="rounded-xl bg-white/15 p-2">
            <RoleIcon size={16} />
          </div>
        </div>

        <p className="text-sm font-extrabold leading-7">دار المناجاة لتحفيظ القرآن الكريم</p>
        <p className="mt-1 truncate text-xs text-white/85">{userProfile?.fullName || "مستخدم النظام"}</p>
        <p className="truncate text-[11px] text-white/75">{userProfile?.email || firebaseUser?.email || "-"}</p>
      </div>

      <p className="mb-2 mt-4 px-1 text-[11px] font-bold text-slate-500">التنقل</p>
      <div className="space-y-1.5">
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
      >
        <span>تسجيل الخروج</span>
        <LogOut size={16} />
      </button>
    </aside>
  );
}

function MobileDrawer({ open, onClose, navItems, role, logout }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
        aria-label="close"
      />

      <div className="absolute right-0 top-0 h-full w-[82%] max-w-[320px] bg-[var(--bg-secondary)] p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">القائمة</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] p-2 text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1.5">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} compact onClick={onClose} />
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-[var(--bg-input)] p-3 text-xs text-slate-600">الصلاحية الحالية: {roleLabel(role)}</div>

        <button
          type="button"
          onClick={logout}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700"
        >
          <span>تسجيل الخروج</span>
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

function MobileBottomNav({ navItems }) {
  const location = useLocation();
  const tabs = navItems.slice(0, 4);

  if (!tabs.length) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[rgba(255,255,255,0.94)] px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-[440px] grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.to || (tab.to !== "/" && location.pathname.startsWith(tab.to));

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={[
                "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-bold transition",
                active
                  ? "bg-[var(--gold-surface)] text-[var(--gold-dark)]"
                  : "text-slate-500 hover:bg-[var(--bg-input)]"
              ].join(" ")}
            >
              <Icon size={18} />
              <span className="mt-1 truncate">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default function DashboardLayout() {
  const { firebaseUser, userProfile, logout, role } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = useMemo(() => buildNavItems(role), [role]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(247,246,243,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-2 text-slate-700 lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div>
              <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">دار المناجاة</h1>
              <p className="text-[11px] text-slate-500 sm:text-xs">نظام إدارة تحفيظ القرآن الكريم</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-[var(--border-gold)] bg-[var(--gold-surface)] px-3 py-1 text-xs font-bold text-[var(--gold-dark)] sm:block">
              {roleLabel(role)}
            </div>

            <button
              type="button"
              onClick={logout}
              className="hidden items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 lg:flex"
            >
              <LogOut size={14} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-3 pb-24 pt-4 sm:px-4 lg:px-6 lg:pb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[285px_minmax(0,1fr)] lg:gap-6">
          <DesktopSidebar
            navItems={navItems}
            userProfile={userProfile}
            firebaseUser={firebaseUser}
            role={role}
            logout={logout}
          />

          <main className="mobile-card-reveal min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        navItems={navItems}
        role={role}
        logout={logout}
      />

      <MobileBottomNav navItems={navItems} />
    </div>
  );
}
