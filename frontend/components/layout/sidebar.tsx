import Link from "next/link";
import { Activity, FileAudio, History, KeyRound, LayoutDashboard, ShieldCheck } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: FileAudio },
  { href: "/history", label: "History", icon: History },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/admin/sop", label: "SOP Admin", icon: ShieldCheck },
  { href: "/history", label: "Status Queue", icon: Activity }
];

export function Sidebar() {
  return (
    <aside className="glass glow-border hidden w-72 shrink-0 rounded-3xl p-5 lg:block">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Workspace</div>
        <h2 className="mt-3 text-2xl font-semibold text-white">Operations Hub</h2>
      </div>
      <div className="space-y-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-white"
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
