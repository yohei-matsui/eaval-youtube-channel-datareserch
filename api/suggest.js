export default async function handler(req, res) {
  const { q, hl = 'ja', ds = 'yt', client = 'firefox' } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });

  try {
    const url = `https://suggestqueries.google.com/complete/search?client=${client}&ds=${ds}&hl=${hl}&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
