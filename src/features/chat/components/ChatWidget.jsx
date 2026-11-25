import { useEffect, useRef, useState } from "react";
import { supabase } from "../../../services/supabase";
import { useAuth } from "../../../store/AuthContext";

const SUGGESTIONS = {
  admin: ["Overall stats kya hain?", "Portal mein kya kya features hain?"],
  teacher: ["Mere courses kaun se hain?", "Mera record dikhao"],
  student: ["Mera record kya hai?", "Mera semester kitna hai?"],
};

export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || busy) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });

      const raw = await res.text();
      let json = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch {
        json = null;
      }

      if (!json) {
        throw new Error(`Server ne khali jawab diya (status ${res.status}). Terminal dekhein.`);
      }
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);

      setMessages((m) => [...m, { role: "assistant", content: json.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Maaf kijiye, error aaya: ${err.message}` },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const suggestions = SUGGESTIONS[user?.role] ?? SUGGESTIONS.student;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-brand text-xl text-white shadow-lg shadow-brand/30 transition hover:scale-105"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#13151b]">
          <div className="border-b border-stone-200 px-4 py-3 dark:border-white/10">
            <p className="text-sm font-bold text-ink dark:text-white">UniManage Assistant</p>
            <p className="text-xs capitalize text-stone-500 dark:text-stone-400">{user?.role} mode</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-stone-500 dark:text-stone-400">Koi sawal poochein:</p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-xl bg-stone-100 px-3 py-2 text-left text-xs text-stone-700 hover:bg-stone-200 dark:bg-white/[0.06] dark:text-stone-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "bg-stone-100 text-stone-800 dark:bg-white/[0.08] dark:text-stone-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {busy && <p className="text-xs text-stone-400">Soch raha hoon...</p>}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-stone-200 p-3 dark:border-white/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Yahan likhein..."
              className="h-10 flex-1 rounded-xl bg-stone-100 px-3 text-xs text-stone-900 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-brand/30 dark:bg-[#1e2330] dark:text-stone-100"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="h-10 rounded-xl bg-brand px-4 text-xs font-bold text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}