import { createClient } from "@supabase/supabase-js";

const reply = (body, statusCode = 200) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return reply({ error: "Method not allowed" }, 405);

  const auth = event.headers.authorization;
  if (!auth) return reply({ error: "Login required" }, 401);

  // Pehle check karein ke request karne wala user admin hai
  const caller = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await caller.auth.getUser();
  if (!user) return reply({ error: "Invalid session" }, 401);

  const { data: me } = await caller.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return reply({ error: "Sirf admin password reset kar sakta hai" }, 403);

  const { profile_id, password } = JSON.parse(event.body || "{}");
  if (!profile_id || typeof password !== "string" || password.length < 6) {
    return reply({ error: "Password kam az kam 6 characters ka hona chahiye" }, 400);
  }

  // Service role sirf is server function mein istemal hoti hai
  const admin = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.auth.admin.updateUserById(profile_id, { password });
  if (error) return reply({ error: error.message }, 500);

  return reply({ ok: true });
};