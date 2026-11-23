import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../../../store/AuthContext";
import { ROUTES } from "../../../constants/routes";

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", role: "student", email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // User set hote hi role ke hisaab se redirect
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

  return (
    <div className="login-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 p-3 sm:p-4 transition-colors duration-300">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl transition-transform duration-700 hover:scale-110" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl transition-transform duration-700 hover:scale-110" />

      {/* Compact Outer Container */}
      <div className="relative z-10 w-full max-w-[370px]">
        {/* Compact Card with Pro Glassmorphism */}
        <Card className="group border border-stone-200/80 bg-white/95 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:border-stone-300 sm:p-6">
          
          {/* Header & Animated Logo Badge */}
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand shadow-inner ring-1 ring-brand/20 transition-all duration-300 hover:scale-110 hover:rotate-3 hover:bg-brand/15">
              <svg className="h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl transition-all">
              {isSignup ? "Create account" : "Welcome back"}
            </h1>
            <p className="mt-0.5 text-xs font-medium text-stone-500">
              {isSignup ? "Start your journey with UniManage" : "Sign in to access your portal"}
            </p>
          </div>

          {/* Segmented Tab Switcher with Interactive Hover */}
          <div className="relative mb-4 flex rounded-xl bg-stone-100/90 p-1 shadow-inner border border-stone-200/60">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setInfo(""); }}
              className={`relative z-10 flex-1 py-1.5 text-center text-xs font-semibold transition-all duration-200 ${
                !isSignup
                  ? "rounded-lg bg-ink text-white shadow-md scale-[1.02]"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
              className={`relative z-10 flex-1 py-1.5 text-center text-xs font-semibold transition-all duration-200 ${
                isSignup
                  ? "rounded-lg bg-ink text-white shadow-md scale-[1.02]"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-3">
            {isSignup && (
              <div className="space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                <div className="transition-transform duration-200 hover:-translate-y-0.5">
                  <Input
                    id="name"
                    label="Full name"
                    placeholder="Ali Khan"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </div>
                
                {/* Custom Elegant Animated Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="mb-1 block text-xs font-semibold text-stone-600">
                    I am a
                  </label>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-stone-200/90 bg-stone-100/70 px-3 text-xs font-medium text-ink transition-all duration-200 hover:bg-white hover:border-brand/40 hover:shadow-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15"
                  >
                    <span className="flex items-center gap-2">
                      <span>{currentRole.icon}</span>
                      <span>{currentRole.label}</span>
                    </span>
                    <svg
                      className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-brand" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu Options */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-stone-200 bg-white p-1 shadow-lg backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
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
                                ? "bg-brand/10 font-semibold text-brand"
                                : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
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
            )}

            <div className="transition-transform duration-200 hover:-translate-y-0.5">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div className="transition-transform duration-200 hover:-translate-y-0.5">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                minLength={6}
                value={form.password}
                onChange={set("password")}
                required
              />
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-50/90 p-2.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="h-4 w-4 shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Success/Info Message Box */}
            {info && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-50/90 p-2.5 text-xs font-medium text-emerald-700 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{info}</span>
              </div>
            )}

            {/* Animated Submit Button with Hover Lift & Glow */}
            <div className="pt-1.5">
              <Button
                type="submit"
                className="group/btn relative flex h-10 w-full items-center justify-center overflow-hidden rounded-xl bg-brand text-xs font-semibold text-white shadow-md shadow-brand/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/40 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                disabled={busy}
              >
                {/* Subtle shine sweep on hover */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                
                {busy ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
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

        {/* Minimal Footer Note */}
        <p className="mt-4 text-center text-[11px] text-stone-400">
          Protected by UniManage Security
        </p>
      </div>
    </div>
  );
}