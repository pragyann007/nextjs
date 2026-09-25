import Header from "./components/Header";
import StatCard from "./components/StatCard";
import BlockedQueriesChart from "./components/BlockedQueriesChart";
import QueryTypeDonut from "./components/QueryTypeDonut";
import StatusBoxes from "./components/StatusBoxes";
import BlockedTable from "./components/BlockedTable";
import { DashboardProvider, useDashboard } from "./context/DashboardContext";

function Dashboard() {
  const { summary, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <Header />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Total DNS Queries" data={summary?.totalQueries} accent="violet" />
          <StatCard label="Blocked Queries" data={summary?.blockedQueries} accent="rose" />
          <StatCard label="Blocked Domains" data={summary?.blockedDomains} accent="amber" />
          <StatCard label="Ads Blocked" data={summary?.adsBlocked} accent="cyan" />
          <StatCard label="Bandwidth Saved" data={summary?.bandwidthSaved} format="bytes" accent="emerald" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <BlockedQueriesChart />
          </div>
          <QueryTypeDonut />
        </div>

        <StatusBoxes />
        <BlockedTable />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
