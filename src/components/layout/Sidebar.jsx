import { NavLink } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { NAV } from "../../constants/nav";
import { useAuth } from "../../store/AuthContext";

function initials(name = "") {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return letters || "?";
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="anim-fade-up sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col rounded-3xl border border-stone-200/80 bg-white/80 p-3.5 shadow-xl backdrop-blur-xl transition-all duration-300 lg:flex dark:border-white/10 dark:bg-[#13151b]/80">

      {/* Brand Logo & App Name */}
      <div className="flex items-center gap-2.5 px-2 py-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/30 transition-transform duration-300 hover:rotate-6 hover:scale-110">
          <GraduationCap size={20} strokeWidth={2.2} />
        </span>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-ink dark:text-white">
            UniManage
          </span>
          <span className="text-[10px] font-medium text-stone-400 dark:text-stone-500">
            Campus Workspace
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="mt-3 flex-1 space-y-4 overflow-y-auto pr-1">
        {NAV.map((group, gi) => (
          <div key={group.section} className="space-y-1">
            <p
              className="anim-fade-up px-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500"
              style={{ animationDelay: `${gi * 80}ms` }}
            >
              {group.section}
            </p>

            {group.items.map(({ label, to, icon: Icon }, ii) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `anim-fade-up group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-200 outline-none ${
                    isActive
                      ? "bg-ink text-white shadow-md shadow-black/10 dark:bg-white/15 dark:text-white"
                      : "text-stone-600 hover:translate-x-1 hover:bg-stone-100/80 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }`
                }
                style={{ animationDelay: `${gi * 80 + ii * 50 + 120}ms` }}
              >
                {({ isActive }) => (
                  <>
                    {/* Active item ke bayen taraf ki accent line */}
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand transition-all duration-300 ${
                        isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                      }`}
                    />

                    <Icon
                      size={16}
                      className={`shrink-0 transition-all duration-200 group-hover:scale-125 group-hover:-rotate-6 ${
                        isActive ? "text-brand" : "text-stone-400"
                      }`}
                    />
                    <span className="truncate">{label}</span>

                    {isActive && (
                      <span className="ml-auto size-1.5 animate-pulse rounded-full bg-brand" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User Card (Bottom) */}
      <div className="mt-auto flex items-center gap-2.5 rounded-2xl border border-stone-200/70 bg-stone-100/80 p-2.5 backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05]">
        <div className="relative shrink-0">
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand to-orange-600 text-[11px] font-bold text-white shadow-inner ring-2 ring-white transition-transform duration-300 hover:scale-110 dark:ring-white/10">
            {initials(user?.name)}
          </div>
          {/* Online status (pulse) */}
          <span className="absolute bottom-0 right-0 size-2 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#13151b]" />
        </div>

        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-xs font-bold text-ink dark:text-white">
            {user?.name || "Student"}
          </p>
          <p className="truncate text-[10px] font-medium capitalize text-stone-400">
            {user?.role || "Member"}
          </p>
        </div>

        <button
          onClick={logout}
          aria-label="Log out"
          title="Sign out"
          className="flex size-7 items-center justify-center rounded-lg text-stone-400 transition-all duration-200 hover:rotate-12 hover:bg-red-50 hover:text-red-600 active:scale-90 dark:hover:bg-red-500/15 dark:hover:text-red-400"
        >
          <LogOut size={14} strokeWidth={2.2} />
        </button>
      </div>
    </aside>
  );
}