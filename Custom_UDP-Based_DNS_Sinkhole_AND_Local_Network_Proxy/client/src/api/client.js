const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function fetchApi(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getSummary: () => fetchApi("/api/stats/summary"),
  getHistory: (range = "7d") => fetchApi(`/api/stats/history?range=${range}`),
  getDistribution: () => fetchApi("/api/stats/distribution"),
  getBlockedLogs: (search = "", limit = 50) =>
    fetchApi(`/api/logs/blocked?search=${encodeURIComponent(search)}&limit=${limit}`),
  getStatus: () => fetchApi("/api/status"),
};
