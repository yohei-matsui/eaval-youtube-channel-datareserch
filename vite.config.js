import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import googleTrends from 'google-trends-api'

function trendsApiPlugin() {
  return {
    name: 'trends-api',
    configureServer(server) {
      server.middlewares.use('/api/trends', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const q = url.searchParams.get('q');
        const geo = url.searchParams.get('geo') || 'JP';
        if (!q) { res.statusCode = 400; res.end(JSON.stringify({ error: 'q required' })); return; }
        try {
          const result = await googleTrends.relatedQueries({
            keyword: q, geo,
            hl: geo === 'JP' ? 'ja' : geo === 'KR' ? 'ko' : 'en',
          });
          const data = JSON.parse(result);
          const widgets = data?.default?.rankedList || [];
          const top = widgets[0]?.rankedKeyword?.slice(0, 10).map(k => ({ query: k.query, value: k.value })) || [];
          const rising = widgets[1]?.rankedKeyword?.slice(0, 10).map(k => ({
            query: k.query, value: k.formattedValue || k.value, isBreakout: k.formattedValue === 'Breakout',
          })) || [];
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ top, rising }));
        } catch (e) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ top: [], rising: [], error: e.message }));
        }
      });

      server.middlewares.use('/api/suggest', async (req, res) => {
        const url = new URL(req.url, 'http://localhost');
        const q = url.searchParams.get('q');
        const hl = url.searchParams.get('hl') || 'ja';
        if (!q) { res.statusCode = 400; res.end('[]'); return; }
        try {
          const target = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=${hl}&q=${encodeURIComponent(q)}`;
          const r = await fetch(target, {
            headers: {
              'Accept-Encoding': 'identity',
              'Accept-Charset': 'UTF-8',
            },
          });
          const text = await r.text();
          const data = JSON.parse(text);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(data));
        } catch {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify([q, []]));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), trendsApiPlugin()],
})
