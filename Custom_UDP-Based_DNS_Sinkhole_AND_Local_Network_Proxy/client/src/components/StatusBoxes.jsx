import { Filter, Globe, Layers, Users } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

const items = [
  {
    key: "filtering",
    icon: Filter,
    label: "Filtering Mode",
    getValue: (s) => s?.filteringMode ?? "—",
    getSub: (s) => s?.filteringLevel ?? "",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    key: "upstream",
    icon: Globe,
    label: "Upstream DNS",
    getValue: (s) => (s ? `${s.upstreamDns} ${s.upstreamProvider}` : "—"),
    getSub: (s) => (s?.upstreamEncrypted ? "Encrypted DoH" : "Standard DNS"),
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    key: "categories",
    icon: Layers,
    label: "Blocking Categories",
    getValue: (s) => (s ? `${s.categoriesEnabled}/${s.categoriesTotal} Categories Enabled` : "—"),
    getSub: () => "StevenBlack + Custom",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    key: "clients",
    icon: Users,
    label: "Clients Protected",
    getValue: (s) => (s ? `${s.clientsProtected} Devices Connected` : "—"),
    getSub: (s) => (s ? `${s.blocklistSize?.toLocaleString()} domains blocked` : ""),
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function StatusBoxes() {
  const { status } = useDashboard();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, icon: Icon, label, getValue, getSub, color, bg }) => (
        <div key={key} className="glass-card flex items-start gap-4 p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{getValue(status)}</p>
            <p className="mt-0.5 truncate text-xs text-slate-400">{getSub(status)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
