import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

function iconByType(type) {
  if (type === "success") return CheckCircle2;
  if (type === "error") return AlertTriangle;
  return Info;
}

function styleByType(type) {
  if (type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (type === "error") return "border-red-200 bg-red-50 text-red-800";
  return "border-slate-200 bg-white text-slate-700";
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback((message, type = "info", options = {}) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const duration = Number(options.duration || 3200);

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, [removeToast]);

  const value = useMemo(() => {
    return {
      pushToast,
      success: (message, options) => pushToast(message, "success", options),
      error: (message, options) => pushToast(message, "error", options),
      info: (message, options) => pushToast(message, "info", options),
      dismiss: removeToast
    };
  }, [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-3 top-3 z-[90] flex w-[min(92vw,360px)] flex-col gap-2 sm:right-5 sm:top-5">
        {toasts.map((toast) => {
          const Icon = iconByType(toast.type);

          return (
            <div
              key={toast.id}
              className={[
                "pointer-events-auto flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm shadow-[0_12px_28px_rgba(15,23,42,0.12)]",
                styleByType(toast.type)
              ].join(" ")}
            >
              <Icon size={16} className="mt-0.5 shrink-0" />
              <p className="flex-1 leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-md p-1 opacity-70 transition hover:opacity-100"
                aria-label="close"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
