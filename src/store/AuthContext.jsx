import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, email, name, role, avatar }
  const [loading, setLoading] = useState(true);

  async function loadProfile(session) {
    if (!session) { setUser(null); return; }
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", session.user.id)
      .single();
    if (error) { console.error(error); setUser(null); return; }
    setUser({
      id: session.user.id,
      email: session.user.email,
      name: data.full_name,
      role: data.role,
      avatar: `https://i.pravatar.cc/80?u=${session.user.id}`,
    });
  }

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => loadProfile(data.session))
      .finally(() => setLoading(false));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // Returns true agar email confirmation chahiye
  const signup = async ({ name, role, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, requested_role: role } },
    });
    if (error) throw error;
    return !data.session;
  };

  const logout = () => supabase.auth.signOut();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-stone-500">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);