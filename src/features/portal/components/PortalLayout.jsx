import { NavLink, Outlet } from "react-router-dom";
import { GraduationCap, LayoutDashboard, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "../../../store/AuthContext";
import { ROUTES } from "../../../constants/routes";

const ITEMS = [
  { label: "Overview", to: ROUTES.portal, icon: LayoutDashboard, end: true },
  { label: "My Courses", to: ROUTES.portalCourses, icon: BookOpen },
];

function initials(name = "") {
  const letters = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return letters || "?";
}

export default function PortalLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-ink text-white shadow-md shadow-black/10 dark:bg-white/15"
        : "text-stone-600 hover:translate-x-1 hover:bg-stone-100/80 dark:text-stone-400 dark:hover:bg-white/[0.06]"
    }`;

  return (
    <div className="login-shell min-h-screen p-3 sm:p-5">
      <div className="mx-auto flex max-w-6xl gap-4">
        {/* Desktop sidebar */}
        <aside className="anim-fade-up sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col rounded-3xl border border-stone-200/80 bg-white/80 p-3.5 shadow-xl backdrop-blur-xl md:flex dark:border-white/10 dark:bg-[#13151b]/80">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30">
              <GraduationCap size={20} strokeWidth={2.2} />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-ink dark:text-white">UniManage</span>
              <span className="text-[10px] font-medium text-stone-400">Campus Workspace</span>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {ITEMS.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand transition-all duration-300 ${
                        isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                      }`}
                    />
                    <Icon size={16} className={isActive ? "text-brand" : "text-stone-400"} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-2.5 rounded-2xl border border-stone-200/70 bg-stone-100/80 p-2.5 dark:border-white/10 dark:bg-white/[0.05]">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-orange-600 text-[11px] font-bold text-white">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-bold text-ink dark:text-white">{user?.name}</p>
              <p className="truncate text-[10px] capitalize text-stone-400">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Log out"
              title="Sign out"
              className="flex size-7 items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400"
            >
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 space-y-4">
          {/* Mobile header */}
          <div className="flex items-center justify-between gap-2 md:hidden">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
                <GraduationCap size={16} />
              </span>
              <span className="font-extrabold text-ink dark:text-white">UniManage</span>
            </div>
            <button onClick={logout} aria-label="Log out" className="rounded-full p-2 text-stone-500 hover:bg-white">
              <LogOut size={16} />
            </button>
          </div>
          <nav className="flex gap-2 md:hidden">
            {ITEMS.map(({ label, to, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isActive ? "bg-ink text-white" : "bg-white/80 text-stone-600 dark:bg-white/[0.06] dark:text-stone-300"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <Outlet />
        </main>
      </div>
    </div>
  );
}