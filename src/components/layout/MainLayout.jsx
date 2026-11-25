import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatWidget from "../../features/chat/components/ChatWidget";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="app-shell relative min-h-screen w-full overflow-x-hidden bg-stone-100 transition-colors duration-300 dark:bg-[#0c0d11]">
      {/* Ambient Lighting Orbs for Glassmorphic Depth */}
      <div className="pointer-events-none fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-orange-400/15 blur-[120px] dark:bg-orange-500/10" />
      <div className="pointer-events-none fixed top-1/2 -right-32 h-[450px] w-[450px] rounded-full bg-amber-400/10 blur-[130px] dark:bg-amber-500/[0.07]" />
      <div className="pointer-events-none fixed -bottom-40 left-10 h-[400px] w-[400px] rounded-full bg-stone-300/30 blur-[110px] dark:bg-indigo-600/[0.05]" />

      {/* Main Responsive Grid Canvas */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] gap-3 p-2.5 sm:gap-4 sm:p-4 md:p-5 lg:gap-5">
        <Sidebar />

        {/* Content Stream */}
        <main className="flex min-w-0 flex-1 flex-col space-y-3.5 sm:space-y-4">
          <Topbar />

          {/* Animated Page Transition Area */}
          <div key={location.pathname} className="flex-1 animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>

      <ChatWidget />
    </div>
  );
}