import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Bell, Moon, Sun, BookOpen, UserPlus, FileText, Megaphone, Clock } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { supabase } from "../../services/supabase";
import { ROUTES } from "../../constants/routes";

const QUICK_ACTIONS = [
  { key: "student", label: "Add Student", icon: UserPlus, to: ROUTES.students },
  { key: "course", label: "New Course", icon: BookOpen, to: ROUTES.courses },
  { key: "assignment", label: "New Assignment", icon: FileText },
  { key: "announcement", label: "Announcement", icon: Megaphone },
];

export default function Topbar() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [note, setNote] = useState("");
  const [notifications, setNotifications] = useState([]);

  const quickAddRef = useRef(null);
  const notifRef = useRef(null);

  // Menus ke bahar click karne par band
  useEffect(() => {
    const onClick = (e) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) setQuickAddOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Notifications: sirf database se (table na ho to khali)
  useEffect(() => {
    let alive = true;

    async function load() {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, message, created_at, read")
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && alive) setNotifications(data ?? []);
    }
    load();

    const channel = supabase
      .channel("notifications-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("read", false);
  };

  const runAction = (action) => {
    setQuickAddOpen(false);
    if (action.to) {
      navigate(action.to, { state: { openAdd: true } });
      return;
    }
    setNote(`${action.label} abhi baaki hai.`);
    setTimeout(() => setNote(""), 2500);
  };

  const iconBtn =
    "relative flex size-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/90 text-stone-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:scale-95 dark:border-white/10 dark:bg-[#1a1d26] dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white";

  return (
    <header className="flex w-full items-center justify-between gap-3 py-1">
      <label className="group flex h-9 w-full max-w-[200px] items-center gap-2 rounded-xl border border-stone-200/80 bg-white/80 px-3 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-stone-300 focus-within:w-full focus-within:max-w-[260px] focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 sm:max-w-[230px] dark:border-white/10 dark:bg-[#1a1d26]">
        <Search size={15} className="shrink-0 text-stone-400 group-focus-within:text-brand" />
        <input
          placeholder="Search..."
          className="w-full bg-transparent text-xs font-medium text-ink outline-none placeholder:text-stone-400 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      </label>

      <div className="flex items-center gap-2">
        {/* Quick Add */}
        <div className="relative" ref={quickAddRef}>
          <button
            type="button"
            onClick={() => setQuickAddOpen((o) => !o)}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-brand px-3 text-xs font-bold text-white shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <Plus size={15} strokeWidth={2.5} className={`transition-transform duration-200 ${quickAddOpen ? "rotate-45" : ""}`} />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#151720]/95">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Quick Actions
              </div>
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => runAction(a)}
                    className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-100 hover:text-brand dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-brand"
                  >
                    <Icon size={15} className="text-stone-400 group-hover:text-brand" />
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button type="button" onClick={() => setNotifOpen((o) => !o)} className={iconBtn} aria-label="Notifications">
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand ring-2 ring-white dark:ring-[#1a1d26]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#151720]/95">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 dark:border-white/10">
                <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                  Notifications {unreadCount > 0 && <span className="text-brand">({unreadCount} new)</span>}
                </h4>
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllRead} className="text-[11px] font-semibold text-brand hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 divide-y divide-stone-100 overflow-y-auto dark:divide-white/[0.06]">
                {notifications.length === 0 ? (
                  <p className="py-8 text-center text-xs text-stone-500 dark:text-stone-400">Abhi koi notification nahi hai.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 p-3 ${!n.read ? "bg-orange-50/50 dark:bg-brand/[0.04]" : ""}`}>
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${!n.read ? "bg-brand" : "bg-transparent"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-stone-900 dark:text-white">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-stone-500 dark:text-stone-400">{n.message}</p>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-stone-400">
                          <Clock size={11} />
                          {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme */}
        <button type="button" onClick={toggle} className={iconBtn} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
        </button>
      </div>

      {note && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-xs text-white shadow-lg">
          {note}
        </div>
      )}
    </header>
  );
}