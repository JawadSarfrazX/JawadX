export default function Input({ label, id, className = "", ...props }) {
  return (
    <label htmlFor={id} className="block text-sm">
      {label && <span className="mb-1 block font-medium text-stone-600">{label}</span>}
      <input id={id} className={`h-11 w-full rounded-xl bg-stone-100 px-3 outline-none ring-1 ring-transparent focus:ring-brand ${className}`} {...props} />
    </label>
  );
}
