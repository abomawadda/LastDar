import AppRouter from "./app/router";
import { AuthProvider } from "./app/providers/AuthProvider";
import { I18nProvider } from "./app/providers/I18nProvider";
import { QueryProvider } from "./app/providers/QueryProvider";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { ToastProvider } from "./app/providers/ToastProvider";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <QueryProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </QueryProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

