import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoutes";

const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));
const LoginPage = lazy(() => import("../../modules/auth/pages/LoginPage"));
const DashboardPage = lazy(() => import("../../modules/dashboard/pages/DashboardPage"));

const StudentsListPage = lazy(() => import("../../modules/students/pages/StudentsListPage"));
const StudentCreatePage = lazy(() => import("../../modules/students/pages/StudentCreatePage"));
const StudentDetailsPage = lazy(() => import("../../modules/students/pages/StudentDetailsPage"));
const StudentEditPage = lazy(() => import("../../modules/students/pages/StudentEditPage"));
const StudentFreezePage = lazy(() => import("../../modules/students/pages/StudentFreezePage"));
const StudentTransferPage = lazy(() => import("../../modules/students/pages/StudentTransferPage"));

const GuardiansListPage = lazy(() => import("../../modules/guardians/pages/GuardiansListPage"));
const GuardianCreatePage = lazy(() => import("../../modules/guardians/pages/GuardianCreatePage"));

const ClassesPage = lazy(() => import("../../modules/classes/pages/ClassesPage"));
const AttendancePage = lazy(() => import("../../modules/attendance/pages/AttendancePage"));
const MemorizationPage = lazy(() => import("../../modules/memorization/pages/MemorizationPage"));
const FinancePage = lazy(() => import("../../modules/finance/pages/FinancePage"));

function RouteLoader() {
  return (
    <div className="theme-surface flex min-h-[220px] items-center justify-center rounded-3xl p-6 text-sm font-bold text-slate-600">
      جاري تحميل الصفحة...
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
          <Route path="students/:studentId" element={<StudentDetailsPage />} />
          <Route path="students/:studentId/edit" element={<StudentEditPage />} />
          <Route path="students/:studentId/freeze" element={<StudentFreezePage />} />
          <Route path="students/:studentId/transfer" element={<StudentTransferPage />} />

          <Route path="guardians" element={<GuardiansListPage />} />
          <Route path="guardians/create" element={<GuardianCreatePage />} />

          <Route path="classes" element={<ClassesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="memorization" element={<MemorizationPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
