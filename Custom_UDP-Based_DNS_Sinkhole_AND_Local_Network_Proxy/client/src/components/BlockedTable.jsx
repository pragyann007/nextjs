import { Search, ShieldBan, Info } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

const CATEGORY_STYLES = {
  Advertising: "badge-advertising",
  Analytics: "badge-analytics",
  Tracking: "badge-tracking",
  "Social Media": "badge-social",
  Malware: "badge-malware",
};

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function BlockedTable() {
  const { blockedLogs, search, setSearch } = useDashboard();

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recently Blocked Domains</h2>
          <p className="text-sm text-slate-400">Live feed of blocked DNS requests</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search domains, clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 sm:w-72"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Domain</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Blocked At</th>
              <th className="px-5 py-3 font-medium">Queries</th>
              <th className="px-5 py-3 font-medium">Client</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {blockedLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  No blocked queries yet. Point a device to this DNS server to start blocking.
                </td>
              </tr>
            ) : (
              blockedLogs.map((row, i) => (
                <tr
                  key={`${row.domain}-${row.timestamp}-${i}`}
                  className="border-b border-white/[0.03] transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <ShieldBan className="h-4 w-4 shrink-0 text-rose-400" />
                      <span className="font-medium text-white">{row.domain}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${CATEGORY_STYLES[row.category] ?? "badge-tracking"}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{formatTime(row.timestamp)}</td>
                  <td className="px-5 py-3.5 font-medium text-white">{row.queries}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{row.client}</td>
                  <td className="px-5 py-3.5">
                    <button
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-violet-400"
                      title={`Type: ${row.type}`}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
