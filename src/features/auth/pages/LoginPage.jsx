import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../store/AuthContext";
import { ROUTES } from "../../../constants/routes";
import { DEPARTMENTS } from "../../../constants/departments";

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({
    name: "",
    role: "student",
    dept: "",
    semester: "1",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom role dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // User set hote hi redirect
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? ROUTES.dashboard : ROUTES.portal, { replace: true });
    }
  }, [user, navigate]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        const needsConfirm = await signup(form);
        if (needsConfirm) setInfo("Account created successfully. Please confirm your email.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const isSignup = mode === "signup";

  const roles = [
    { value: "student", label: "Student", icon: "🎓" },
    { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  ];

  const currentRole = roles.find((r) => r.value === form.role) || roles[0];

  // Standard uniform field classes
  const fieldBaseClasses =
    "h-11 w-full rounded-xl bg-stone-100 dark:bg-[#1e2330] px-3.5 text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-white/10 outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:border-brand focus:ring-2 focus:ring-brand/20";

  const labelClasses = "mb-1 text-xs font-semibold text-stone-600 dark:text-stone-300";

  return (
    <div className="login-shell relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-stone-100 p-3 sm:p-6 transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px]">
        <Card className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-white/10 bg-white/95 dark:bg-[#13151b]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl transition-all duration-300">

          {/* Header & Logo */}
          <div className="mb-4 sm:mb-5 flex flex-col items-center text-center">
            <div className="mb-2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-inner ring-1 ring-brand/20 transition-transform duration-300 hover:scale-105">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink dark:text-white">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              {isSignup ? "Start your journey with UniManage" : "Sign in to access your portal"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="relative mb-4 sm:mb-5 flex rounded-xl bg-stone-100 dark:bg-white/[0.06] p-1 border border-stone-200/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setInfo(""); }}
              className={`relative z-10 flex-1 py-1.5 text-center text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isSignup
                  ? "bg-ink dark:bg-white/15 text-white shadow-sm font-bold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
              className={`relative z-10 flex-1 py-1.5 text-center text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                isSignup
                  ? "bg-ink dark:bg-white/15 text-white shadow-sm font-bold"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-3 sm:space-y-3.5">
            {isSignup && (
              <>
                {/* Row 1: Full name + Role */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 items-start animate-in fade-in duration-200">
                  <div className="flex flex-col">
                    <label htmlFor="name" className={labelClasses}>Full name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Ali Khan"
                      value={form.name}
                      onChange={set("name")}
                      required
                      className={fieldBaseClasses}
                    />
                  </div>

                  <div className="flex flex-col relative" ref={dropdownRef}>
                    <label className={labelClasses}>Role</label>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className={`${fieldBaseClasses} flex items-center justify-between text-left`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{currentRole.icon}</span>
                        <span className="truncate">{currentRole.label}</span>
                      </span>
                      <svg
                        className={`h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-brand" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-xl border border-stone-200 dark:border-white/15 bg-white dark:bg-[#1a1d26] p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        {roles.map((r) => {
                          const isSelected = form.role === r.value;
                          return (
                            <div
                              key={r.value}
                              onClick={() => {
                                setForm((f) => ({ ...f, role: r.value }));
                                setDropdownOpen(false);
                              }}
                              className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-brand/15 font-semibold text-brand"
                                  : "text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/10"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{r.icon}</span>
                                <span>{r.label}</span>
                              </span>
                              {isSelected && (
                                <svg className="h-3.5 w-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Department (+ Semester for students) */}
                <div className={`grid gap-2.5 sm:gap-3 items-start animate-in fade-in duration-200 ${form.role === "student" ? "grid-cols-2" : "grid-cols-1"}`}>
                  <div className="flex flex-col">
                    <label htmlFor="dept" className={labelClasses}>Department</label>
                    <select
                      id="dept"
                      value={form.dept}
                      onChange={set("dept")}
                      required
                      className={fieldBaseClasses}
                    >
                      <option value="" disabled>Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {form.role === "student" && (
                    <div className="flex flex-col">
                      <label htmlFor="semester" className={labelClasses}>Semester</label>
                      <select
                        id="semester"
                        value={form.semester}
                        onChange={set("semester")}
                        className={fieldBaseClasses}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className={labelClasses}>Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
                className={fieldBaseClasses}
              />
            </div>

            {/* Password with eye button */}
            <div className="flex flex-col">
              <label htmlFor="password" className={labelClasses}>Password</label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength={6}
                  value={form.password}
                  onChange={set("password")}
                  required
                  className={`${fieldBaseClasses} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 flex h-6 w-6 items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-50/90 dark:bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400 animate-in fade-in">
                <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Info / success */}
            {info && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/90 dark:bg-emerald-500/10 p-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 animate-in fade-in">
                <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{info}</span>
              </div>
            )}

            {/* Submit */}
            <div className="pt-1.5 sm:pt-2">
              <Button
                type="submit"
                className="group/btn relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-brand text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand/40 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                disabled={busy}
              >
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />

                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Processing...
                  </span>
                ) : isSignup ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <p className="mt-3 sm:mt-4 text-center text-[11px] text-stone-400">
          Protected by UniManage Security
        </p>
      </div>
    </div>
  );
}