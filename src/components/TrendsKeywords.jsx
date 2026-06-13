export default function TrendsKeywords({ top, rising, onSelect, loading }) {
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(232,32,48,0.04)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: '#bbb' }}>
          📈 関連キーワード取得中…
        </p>
        <div className="flex gap-2 flex-wrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-skeleton h-6 w-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!top.length && !rising.length) return null;

  return (
    <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(232,32,48,0.04)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
      <p className="text-xs font-semibold mb-3 flex items-center gap-1" style={{ color: '#888' }}>
        <span>📈</span> 関連キーワード
      </p>

      {top.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: '#2563eb' }}>🔎 他の人はこちらも検索</p>
          <div className="flex gap-2 flex-wrap">
            {top.map((item, i) => (
              <button
                key={i}
                onClick={() => onSelect(item.query)}
                className="px-3 py-1 text-xs rounded-full transition-all"
                style={{
                  background: 'rgba(37,99,235,0.08)',
                  color: '#1d4ed8',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
