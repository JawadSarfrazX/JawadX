const variants = {
  primary: "bg-ink text-white hover:bg-black",
  brand: "bg-brand text-white hover:bg-orange-600",
  ghost: "bg-white text-ink ring-1 ring-black/10 hover:bg-stone-50",
};

export default function Button({ variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
