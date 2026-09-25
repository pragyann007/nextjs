import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { socket } from "../hooks/useSocket";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyRange, setHistoryRange] = useState("7d");
  const [distribution, setDistribution] = useState(null);
  const [blockedLogs, setBlockedLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    try {
      const [s, h, d, logs, st] = await Promise.all([
        api.getSummary(),
        api.getHistory(historyRange),
        api.getDistribution(),
        api.getBlockedLogs(search),
        api.getStatus(),
      ]);
      setSummary(s);
      setHistory(h);
      setDistribution(d);
      setBlockedLogs(logs.items);
      setStatus(st);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [historyRange, search]);

  const refreshHistory = useCallback(async (range) => {
    try {
      const h = await api.getHistory(range);
      setHistory(h);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  const refreshLogs = useCallback(async (q) => {
    try {
      const logs = await api.getBlockedLogs(q);
      setBlockedLogs(logs.items);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  }, []);

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 10000);
    return () => clearInterval(interval);
  }, [refreshAll]);

  useEffect(() => {
    refreshHistory(historyRange);
  }, [historyRange, refreshHistory]);

  useEffect(() => {
    const timer = setTimeout(() => refreshLogs(search), 300);
    return () => clearTimeout(timer);
  }, [search, refreshLogs]);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onBlocked = async () => {
      try {
        const [s, logs, st, d] = await Promise.all([
          api.getSummary(),
          api.getBlockedLogs(search),
          api.getStatus(),
          api.getDistribution(),
        ]);
        setSummary(s);
        setBlockedLogs(logs.items);
        setStatus(st);
        setDistribution(d);
        const h = await api.getHistory(historyRange);
        setHistory(h);
      } catch {
        /* silent */
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("dns_blocked", onBlocked);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("dns_blocked", onBlocked);
    };
  }, [search, historyRange]);

  return (
    <DashboardContext.Provider
      value={{
        summary,
        history,
        historyRange,
        setHistoryRange,
        distribution,
        blockedLogs,
        status,
        search,
        setSearch,
        connected,
        loading,
        refreshAll,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
