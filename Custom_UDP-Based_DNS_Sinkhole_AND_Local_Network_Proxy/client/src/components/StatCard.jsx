import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

function formatValue(value, format) {
  if (value == null) return "—";
  if (format === "bytes") {
    if (value >= 1_073_741_824) return `${(value / 1_073_741_824).toFixed(1)} GB`;
    if (value >= 1_048_576) return `${(value / 1_048_576).toFixed(1)} MB`;
    if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${value} B`;
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

export default function StatCard({ label, data, format, accent }) {
  const sparkData = (data?.sparkline ?? []).map((v, i) => ({ i, v }));
  const change = data?.change ?? 0;
  const positive = change >= 0;

  const accentColors = {
    violet: "#8b5cf6",
    rose: "#f43f5e",
    amber: "#f59e0b",
    cyan: "#06b6d4",
    emerald: "#10b981",
  };
  const stroke = accentColors[accent] ?? accentColors.violet;
  const gradId = `grad-${accent}`;

  return (
    <div className="glass-card group relative overflow-hidden p-5 transition hover:border-white/20">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl transition group-hover:from-white/10" />
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white">
        {formatValue(data?.value, format)}
      </p>
      <div className="mt-3 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stroke}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-rose-400"}`}>
        {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        <span>{Math.abs(change)}% vs yesterday</span>
      </div>
    </div>
  );
}
