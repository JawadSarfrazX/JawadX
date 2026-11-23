export default function Card({ className = "", children }) {
  return (
    <section className={`rounded-3xl bg-white/85 p-5 shadow-[0_2px_20px_rgba(60,40,10,0.06)] ring-1 ring-black/5 ${className}`}>
      {children}
    </section>
  );
}
