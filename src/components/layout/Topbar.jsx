import { Search, Plus, Bell, Moon } from "lucide-react";
import Button from "../ui/Button";
import useTheme from "../../hooks/useTheme";

export default function Topbar() {
  const { toggle } = useTheme();
  const icon = "grid size-10 place-items-center rounded-full bg-white ring-1 ring-black/5 hover:bg-stone-50";
  return (
    <header className="flex items-center gap-3">
      <label className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white/90 px-4 ring-1 ring-black/5 md:max-w-xs">
        <Search size={16} className="text-stone-400" />
        <input placeholder="Search" className="w-full bg-transparent text-sm outline-none" />
      </label>
      <div className="ml-auto flex items-center gap-2">
        <Button><Plus size={16} /> Quick Add</Button>
        <button className={icon} aria-label="Notifications"><Bell size={17} /></button>
        <button className={icon} aria-label="Toggle theme" onClick={toggle}><Moon size={17} /></button>
      </div>
    </header>
  );
}
