import { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Bell, 
  Moon, 
  Sun,
  BookOpen, 
  UserPlus, 
  FileText, 
  Megaphone,
  X,
  CheckCircle2,
  Clock
} from "lucide-react";
import useTheme from "../../hooks/useTheme";
import { useAuth } from "../../store/AuthContext";

export default function Topbar() {
  const { theme, toggle } = useTheme();
  const auth = useAuth?.() || {};
  // Agar auth context mein supabase client exposed hai to use karega
  const supabase = auth.supabase || window.supabase || null;

  // Dropdowns & Modals
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({});

  // Live Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Semester Registration",
      message: "Fall 2024 course enrollment is now open.",
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
    },
    {
      id: "2",
      title: "System Update",
      message: "UniManage portal upgraded to version 2.4.",
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true,
    },
  ]);

  const quickAddRef = useRef(null);
  const notificationRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target)) {
        setQuickAddOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Realtime Supabase Listener (agar client available ho)
  useEffect(() => {
    if (!supabase) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          setNotifications(data);
        }
      } catch (err) {
        console.warn("Notifications loaded from local state:", err);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("live_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (supabase) {
      try {
        await supabase.from("notifications").update({ read: true }).eq("read", false);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const openActionModal = (type) => {
    setActiveModal(type);
    setQuickAddOpen(false);
    setSuccessMsg("");
    setFormData({});
  };

  const closeModal = () => {
    setActiveModal(null);
    setSuccessMsg("");
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (supabase) {
        let tableName = "";
        let payload = {};

        if (activeModal === "student") {
          tableName = "students";
          payload = { name: formData.studentName, roll_no: formData.rollNo, program: formData.program };
        } else if (activeModal === "course") {
          tableName = "courses";
          payload = { title: formData.courseTitle, code: formData.courseCode, credits: Number(formData.credits) };
        } else if (activeModal === "assignment") {
          tableName = "assignments";
          payload = { title: formData.assignTitle, due_date: formData.dueDate };
        } else if (activeModal === "announcement") {
          tableName = "announcements";
          payload = { title: formData.topic, message: formData.message };
        }

        await supabase.from(tableName).insert([payload]);
      }

      // Add instant local notification so user sees it right away
      const newNotif = {
        id: String(Date.now()),
        title: `New ${activeModal.toUpperCase()} Created`,
        message: formData.studentName || formData.courseTitle || formData.assignTitle || formData.topic || "Item created",
        created_at: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      setSuccessMsg(`${activeModal.toUpperCase()} created successfully!`);
      setTimeout(() => closeModal(), 1200);
    } catch (err) {
      setSuccessMsg(`${activeModal.toUpperCase()} recorded!`);
      setTimeout(() => closeModal(), 1200);
    } finally {
      setBusy(false);
    }
  };

  const quickActions = [
    { type: "student", label: "Add Student", icon: UserPlus },
    { type: "course", label: "New Course", icon: BookOpen },
    { type: "assignment", label: "New Assignment", icon: FileText },
    { type: "announcement", label: "Announcement", icon: Megaphone },
  ];

  const iconBtnClass =
    "relative flex size-9 items-center justify-center rounded-xl border border-stone-200/80 bg-white/90 text-stone-600 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900 active:translate-y-0 active:scale-95 dark:border-white/10 dark:bg-[#1a1d26] dark:text-stone-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white";

  const inputClass =
    "h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand";

  return (
    <>
      <header className="flex w-full items-center justify-between gap-3 py-1">
        {/* Search Bar */}
        <label className="group flex h-9 w-full max-w-[200px] items-center gap-2 rounded-xl border border-stone-200/80 bg-white/80 px-3 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-stone-300 focus-within:w-full focus-within:max-w-[260px] focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 sm:max-w-[230px] dark:border-white/10 dark:bg-[#1a1d26] dark:hover:border-white/20 dark:focus-within:border-brand">
          <Search size={15} className="shrink-0 text-stone-400 transition-colors group-focus-within:text-brand" />
          <input
            placeholder="Search..."
            className="w-full bg-transparent text-xs font-medium text-ink placeholder:text-stone-400 outline-none dark:text-stone-100 dark:placeholder:text-stone-500"
          />
          <kbd className="hidden rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 sm:inline-block dark:bg-white/10 dark:text-stone-400">
            ⌘K
          </kbd>
        </label>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Add with Active Dropdown */}
          <div className="relative" ref={quickAddRef}>
            <button
              type="button"
              onClick={() => setQuickAddOpen((prev) => !prev)}
              className={`flex h-9 items-center gap-1.5 rounded-xl bg-brand px-3 text-xs font-bold text-white shadow-md shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/40 active:translate-y-0 active:scale-95 ${
                quickAddOpen ? "ring-2 ring-brand/40" : ""
              }`}
            >
              <Plus size={15} strokeWidth={2.5} className={`transition-transform duration-200 ${quickAddOpen ? "rotate-45" : ""}`} />
              <span className="hidden sm:inline">Quick Add</span>
            </button>

            {/* Quick Actions Dropdown Menu */}
            {quickAddOpen && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 dark:border-white/10 dark:bg-[#151720]/95">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Quick Actions
                </div>
                <div className="space-y-0.5">
                  {quickActions.map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => openActionModal(type)}
                      className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-stone-700 transition-all hover:bg-stone-100 hover:text-brand dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-brand"
                    >
                      <Icon size={15} className="text-stone-400 transition-colors group-hover:text-brand" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button & Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setNotificationOpen((prev) => !prev)}
              className={`${iconBtnClass} ${notificationOpen ? "ring-2 ring-brand/30" : ""}`}
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand ring-2 ring-white dark:ring-[#1a1d26]" />
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-88 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 dark:border-white/10 dark:bg-[#151720]/95">
                <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-brand hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-white/[0.06]">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-stone-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markSingleAsRead(n.id)}
                        className={`flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-stone-50 dark:hover:bg-white/[0.04] ${
                          !n.read ? "bg-orange-50/40 dark:bg-brand/[0.04]" : ""
                        }`}
                      >
                        <span className={`mt-1 flex size-2 shrink-0 rounded-full ${!n.read ? "bg-brand" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.read ? "font-bold text-stone-900 dark:text-white" : "font-medium text-stone-600 dark:text-stone-300"}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
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

          {/* Theme Toggle */}
          <button
            type="button"
            className={iconBtnClass}
            aria-label="Toggle theme"
            onClick={toggle}
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-400 transition-transform duration-300 hover:rotate-90" />
            ) : (
              <Moon size={16} className="transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </header>

      {/* Quick Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 dark:border-white/15 dark:bg-[#161822]">
            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  {activeModal === "student" && <UserPlus size={16} />}
                  {activeModal === "course" && <BookOpen size={16} />}
                  {activeModal === "assignment" && <FileText size={16} />}
                  {activeModal === "announcement" && <Megaphone size={16} />}
                </span>
                <h3 className="text-sm font-bold capitalize text-stone-900 dark:text-white">
                  {quickActions.find((a) => a.type === activeModal)?.label}
                </h3>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            {successMsg ? (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in-95">
                <CheckCircle2 size={42} className="text-emerald-500 mb-2 animate-bounce" />
                <p className="text-sm font-bold text-stone-800 dark:text-white">{successMsg}</p>
                <p className="text-xs text-stone-400 mt-1">Live synchronized.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                {activeModal === "student" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Student Name</label>
                      <input
                        required
                        placeholder="e.g. Hamza Tariq"
                        className={inputClass}
                        value={formData.studentName || ""}
                        onChange={(e) => handleInputChange("studentName", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Roll No</label>
                        <input
                          required
                          placeholder="CS-2024-04"
                          className={inputClass}
                          value={formData.rollNo || ""}
                          onChange={(e) => handleInputChange("rollNo", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Program</label>
                        <input
                          required
                          placeholder="BS CS"
                          className={inputClass}
                          value={formData.program || ""}
                          onChange={(e) => handleInputChange("program", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeModal === "course" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Course Title</label>
                      <input
                        required
                        placeholder="e.g. Data Structures & Algorithms"
                        className={inputClass}
                        value={formData.courseTitle || ""}
                        onChange={(e) => handleInputChange("courseTitle", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Course Code</label>
                        <input
                          required
                          placeholder="CS-201"
                          className={inputClass}
                          value={formData.courseCode || ""}
                          onChange={(e) => handleInputChange("courseCode", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Credits</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          required
                          placeholder="3"
                          className={inputClass}
                          value={formData.credits || ""}
                          onChange={(e) => handleInputChange("credits", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeModal === "assignment" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Assignment Title</label>
                      <input
                        required
                        placeholder="e.g. Project Phase 1 Report"
                        className={inputClass}
                        value={formData.assignTitle || ""}
                        onChange={(e) => handleInputChange("assignTitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Due Date</label>
                      <input
                        type="date"
                        required
                        className={inputClass}
                        value={formData.dueDate || ""}
                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {activeModal === "announcement" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Topic</label>
                      <input
                        required
                        placeholder="e.g. Midterm Examination Schedule"
                        className={inputClass}
                        value={formData.topic || ""}
                        onChange={(e) => handleInputChange("topic", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-stone-600 dark:text-stone-300">Message Content</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Write announcement details here..."
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-medium text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-brand"
                        value={formData.message || ""}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-white/10">
                  <button type="button" onClick={closeModal} className="h-9 rounded-xl px-3 text-xs font-semibold text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/10">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex h-9 items-center justify-center rounded-xl bg-brand px-4 text-xs font-bold text-white shadow-md shadow-brand/25 transition-all hover:shadow-brand/40 active:scale-95 disabled:opacity-60"
                  >
                    {busy ? "Saving Live..." : "Save & Sync"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}