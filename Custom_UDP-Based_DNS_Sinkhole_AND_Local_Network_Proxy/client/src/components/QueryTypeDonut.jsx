import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useDashboard } from "../context/DashboardContext";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#f43f5e", "#10b981", "#ec4899", "#6366f1"];

export default function QueryTypeDonut() {
  const { distribution } = useDashboard();
  const data = distribution?.distribution ?? [];
  const total = distribution?.total ?? 0;

  return (
    <div className="glass-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">Query Type Breakdown</h2>
        <p className="text-sm text-slate-400">Distribution by DNS record type</p>
      </div>
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              nameKey="type"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#e2e8f0",
              }}
              formatter={(value, name) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{total.toLocaleString()}</span>
          <span className="text-xs text-slate-400">Total Queries</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, i) => (
          <div key={item.type} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-slate-300">{item.type}</span>
            </div>
            <span className="font-medium text-white">{item.percentage}%</span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-sm text-slate-500">No query data yet</p>
        )}
      </div>
    </div>
  );
}
