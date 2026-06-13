export async function fetchTrends(query, geo = 'JP') {
  try {
    const params = new URLSearchParams({ q: query, geo });
    const res = await fetch(`/api/trends?${params}`);
    const data = await res.json();
    return { top: data.top || [], rising: data.rising || [] };
  } catch {
    return { top: [], rising: [] };
  }
}
