import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div className="app-shell min-h-screen bg-gradient-to-br from-orange-50 via-stone-100 to-stone-200 p-3 md:p-5">
      <div className="mx-auto flex max-w-[1400px] gap-4">
        <Sidebar />
        <main className="min-w-0 flex-1 space-y-4">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
