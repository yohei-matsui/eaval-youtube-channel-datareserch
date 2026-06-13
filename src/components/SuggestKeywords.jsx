export default function SuggestKeywords({ suggestions, onSelect, loading }) {
  if (loading) {
    return (
      <div className="mt-3">
        <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>関連キーワード取得中…</p>
        <div className="flex gap-2 flex-wrap">
          {[...Array(5)].map((_, i) => <div key={i} className="glass-skeleton h-6 w-20" />)}
        </div>
      </div>
    );
  }
  if (!suggestions.length) return null;
  return (
    <div className="mt-3">
      <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>🔎 関連キーワード</p>
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((kw, i) => (
          <button key={i} onClick={() => onSelect(kw)} className="glass-tag px-3 py-1 text-xs">{kw}</button>
        ))}
      </div>
    </div>
  );
}
