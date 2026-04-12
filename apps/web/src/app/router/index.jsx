import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../../modules/auth/pages/LoginPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import StudentsListPage from "../../modules/students/pages/StudentsListPage";
import StudentCreatePage from "../../modules/students/pages/StudentCreatePage";
import GuardiansListPage from "../../modules/guardians/pages/GuardiansListPage";
import GuardianCreatePage from "../../modules/guardians/pages/GuardianCreatePage";

function Placeholder({ title }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-8 text-slate-600">
        الصفحة قيد الإنشاء، وسيتم تحويلها إلى شاشة تشغيل احترافية متوافقة مع
        الأجهزة اللوحية والموبايل وواجهة عربية حديثة.
      </p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsListPage />} />
        <Route path="students/create" element={<StudentCreatePage />} />
        <Route path="classes" element={<Placeholder title="الحلقات" />} />
        <Route path="attendance" element={<Placeholder title="الحضور" />} />
        <Route path="memorization" element={<Placeholder title="التسميع" />} />
        <Route path="finance" element={<Placeholder title="المالية" />} />
        <Route path="guardians" element={<GuardiansListPage />} />
<Route path="guardians/create" element={<GuardianCreatePage />} />
      </Route>
    </Routes>
  );
}