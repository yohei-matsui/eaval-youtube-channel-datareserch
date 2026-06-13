export async function fetchSuggestions(query, lang = 'ja') {
  try {
    const params = new URLSearchParams({ client: 'firefox', ds: 'yt', hl: lang, q: query });
    const res = await fetch(`/api/suggest?${params}`);
    const data = await res.json();
    const suggestions = data[1] || [];
    return suggestions.filter(s => s !== query).slice(0, 10);
  } catch {
    return [];
  }
}
