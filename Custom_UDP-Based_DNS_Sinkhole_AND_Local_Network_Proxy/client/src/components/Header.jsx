import { Shield, Download } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

function formatUptime(ms) {
  if (!ms) return "0m";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);
  return parts.join(" ");
}

export default function Header() {
  const { status, connected } = useDashboard();
  const now = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">DNS AdBlocker</h1>
          <p className="text-sm text-slate-400">Real-time network protection dashboard</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
          <span className={`h-2 w-2 rounded-full ${connected ? "animate-pulse bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-sm font-medium text-emerald-300">
            {connected ? "Protection Active" : "Disconnected"}
          </span>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300">
          Uptime: <span className="font-semibold text-white">{formatUptime(status?.uptime)}</span>
        </div>
        <div className="hidden text-sm text-slate-400 sm:block">{now}</div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500"
        >
          <Download className="h-4 w-4" />
          Save as PDF
        </button>
      </div>
    </header>
  );
}
