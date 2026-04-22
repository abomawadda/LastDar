import { Outlet } from "react-router-dom";

export default function ParentLayout() {
  return (
    <section className="min-h-screen">
      <Outlet />
    </section>
  );
}

