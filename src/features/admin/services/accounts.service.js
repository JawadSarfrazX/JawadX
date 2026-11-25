import { supabase } from "../../../services/supabase";

export async function resetUserPassword(profileId, password) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch("/.netlify/functions/admin-reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ profile_id: profileId, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Password reset nahi ho saka");
}