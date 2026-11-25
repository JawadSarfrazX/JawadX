import { createClient } from "@supabase/supabase-js";

const reply = (body, statusCode = 200) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const SYSTEM_RULES = `Tum UniManage university portal ke assistant ho.
Sirf university portal, uske features aur is user ke apne data ke baare mein jawab do.
Dusre users ka private data kabhi mat batao. Data change karne ka dawa mat karo, sirf dikhane mein madad karo.
User jis zaban mein sawal kare (Urdu, Roman Urdu ya English), usi mein jawab do. Jawab chhote aur saaf rakho.`;

// Pehla model busy ho to doosra try hoga
const MODELS = ["gemini-3.8-flash", "gemini-2.5-flash-lite"];

async function callGemini(apiKey, payload) {
  let lastError = null;

  for (const model of MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const raw = await res.text();
    let data = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (res.ok && data) return { data, model };

    lastError = data?.error?.message ?? `Gemini error (status ${res.status})`;
    console.error(`Gemini ${model} failed:`, lastError);
  }

  throw new Error(lastError || "Gemini abhi available nahi hai");
}

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return reply({ error: "Method not allowed" }, 405);

    const url = process.env.VITE_SUPABASE_URL;
    const anon = process.env.VITE_SUPABASE_ANON_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!url || !anon) return reply({ error: "Supabase env variables missing (.env / Netlify)" }, 500);
    if (!geminiKey) return reply({ error: "GEMINI_API_KEY missing (.env / Netlify)" }, 500);

    const auth = event.headers.authorization || event.headers.Authorization;
    if (!auth) return reply({ error: "Login required" }, 401);

    const supabase = createClient(url, anon, {
      global: { headers: { Authorization: auth } },
    });

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) return reply({ error: "Invalid session. Dobara login karein." }, 401);
    const user = userData.user;

    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    if (profErr || !profile) return reply({ error: "Profile nahi mila" }, 403);

    let context = "";
    if (profile.role === "student") {
      const { data } = await supabase
        .from("students")
        .select("student_code, dept, semester, status")
        .eq("profile_id", user.id)
        .maybeSingle();
      context = `User ka student record: ${JSON.stringify(data)}`;
    } else if (profile.role === "teacher") {
      const { data } = await supabase
        .from("teachers")
        .select("dept, email")
        .eq("profile_id", user.id)
        .maybeSingle();
      const { data: courses } = await supabase.from("courses").select("code, title");
      context = `User ka teacher record: ${JSON.stringify(data)}. Courses: ${JSON.stringify(courses ?? [])}`;
    } else {
      const { count: s } = await supabase.from("students").select("*", { count: "exact", head: true });
      const { count: t } = await supabase.from("teachers").select("*", { count: "exact", head: true });
      const { count: c } = await supabase.from("courses").select("*", { count: "exact", head: true });
      context = `Overall counts: students=${s}, teachers=${t}, courses=${c}`;
    }

    const body = JSON.parse(event.body || "{}");
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (messages.length === 0 || messages[0].role !== "user") {
      return reply({ error: "Invalid messages" }, 400);
    }

    const system = `${SYSTEM_RULES}
User ka naam: ${profile.full_name}. Role: ${profile.role}.
${context}`;

    const payload = {
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 700 },
    };

    let data;
    try {
      ({ data } = await callGemini(geminiKey, payload));
    } catch (err) {
      return reply(
        { error: `AI abhi busy hai, thori dair baad dobara try karein. (${err.message})` },
        503
      );
    }

    const text = (data.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("\n")
      .trim();

    return reply({ reply: text || "Maaf kijiye, jawab nahi mil saka." });
  } catch (err) {
    console.error("CHAT FUNCTION CRASH:", err);
    return reply({ error: `Server error: ${err.name}: ${err.message}` }, 500);
  }
}