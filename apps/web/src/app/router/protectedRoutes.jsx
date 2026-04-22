import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { firebaseUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="theme-surface mx-auto mt-8 max-w-xl rounded-3xl p-6 text-center text-sm font-bold text-slate-600">
        جاري التحقق من بيانات الدخول...
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
