export default function TrendsKeywords({ top, rising, onSelect, loading }) {
  if (loading) {
    return (
      <div className="mt-4 p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.40)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.88)' }}>
        <p className="text-xs font-medium mb-3" style={{ color: '#9CA3AF' }}>📈 Google Trends 関連キーワード取得中…</p>
        <div className="flex gap-2 flex-wrap">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-skeleton h-6 w-24" />)}
        </div>
      </div>
    );
  }
  if (!top.length && !rising.length) return null;

  const tagBase = {
    border: 'none', borderRadius: '9999px', cursor: 'pointer',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.88), 0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.15s ease',
  };

  return (
    <div className="mt-4 p-4 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.40)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.88)' }}>

      {rising.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium mb-2" style={{ color: '#d97706' }}>🔥急上昇</p>
          <div className="flex gap-2 flex-wrap">
            {rising.map((item, i) => (
              <button key={i} onClick={() => onSelect(item.query)}
                className="flex items-center gap-1 px-3 py-1 text-xs"
                style={{ ...tagBase, background: 'rgba(255,255,255,0.55)', color: '#b45309' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.80)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
              >
                {item.query}
                {item.isBreakout && <span className="text-[10px] font-bold" style={{ color: '#d97706' }}>急上昇</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {top.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: '#2563eb' }}>🔎他の人はこちらも検索</p>
          <div className="flex gap-2 flex-wrap">
            {top.map((item, i) => (
              <button key={i} onClick={() => onSelect(item.query)}
                className="px-3 py-1 text-xs"
                style={{ ...tagBase, background: 'rgba(255,255,255,0.55)', color: '#1d4ed8' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.80)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
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
