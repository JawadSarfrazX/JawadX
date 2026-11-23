import { NavLink } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { NAV } from "../../constants/nav";
import { useAuth } from "../../store/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col rounded-3xl bg-white/85 p-4 ring-1 ring-black/5 lg:flex">
      <div className="flex items-center gap-2 px-2 py-2 text-xl font-extrabold">
        <span className="grid size-9 place-items-center rounded-xl bg-brand text-white"><GraduationCap size={20} /></span>
        UniManage
      </div>
      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="mb-1 px-3 text-xs text-stone-400">{group.section}</p>
            {group.items.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand ${
                    isActive ? "bg-ink text-white" : "text-stone-600 hover:bg-stone-100"}`}>
                <Icon size={17} /> {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-3 rounded-2xl bg-stone-100 p-3">
        <img src={user?.avatar} alt="" className="size-9 rounded-full" />
        <div className="text-sm leading-tight"><p className="font-semibold">{user?.name}</p><p className="text-xs text-stone-500">{user?.role}</p></div>
        <button onClick={logout} aria-label="Log out" className="ml-auto rounded-full p-2 text-stone-500 hover:bg-white"><LogOut size={16} /></button>
      </div>
    </aside>
  );
}
