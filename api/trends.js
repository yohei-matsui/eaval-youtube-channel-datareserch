import googleTrends from 'google-trends-api';

export default async function handler(req, res) {
  const { q, geo = 'JP' } = req.query;
  if (!q) return res.status(400).json({ error: 'q is required' });

  try {
    const result = await googleTrends.relatedQueries({
      keyword: q,
      geo,
      hl: geo === 'JP' ? 'ja' : geo === 'KR' ? 'ko' : 'en',
    });

    const data = JSON.parse(result);
    const widgets = data?.default?.rankedList || [];

    const top = widgets[0]?.rankedKeyword?.slice(0, 10).map(k => ({
      query: k.query,
      value: k.value,
    })) || [];

    const rising = widgets[1]?.rankedKeyword?.slice(0, 10).map(k => ({
      query: k.query,
      value: k.formattedValue || k.value,
      isBreakout: k.formattedValue === 'Breakout',
    })) || [];

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(200).json({ top, rising });
  } catch (e) {
    return res.status(500).json({ error: e.message, top: [], rising: [] });
  }
}
