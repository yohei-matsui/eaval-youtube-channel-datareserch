const SORT_OPTIONS = [
  { value: 'subscriberCount_desc', label: '登録者数（多い順）' },
  { value: 'subscriberCount_asc',  label: '登録者数（少ない順）' },
  { value: 'viewCount_desc',       label: '累計再生回数（多い順）' },
  { value: 'viewCount_asc',        label: '累計再生回数（少ない順）' },
  { value: 'videoCount_desc',      label: '動画本数（多い順）' },
  { value: 'videoCount_asc',       label: '動画本数（少ない順）' },
  { value: 'avgViews_desc',        label: '平均再生数（多い順）' },
  { value: 'avgViews_asc',         label: '平均再生数（少ない順）' },
  { value: 'medianViews_desc',     label: '中央値（多い順）' },
  { value: 'medianViews_asc',      label: '中央値（少ない順）' },
];

export default function FilterControls({ sort, setSort, minSubs, setMinSubs, maxSubs, setMaxSubs, onReset }) {
  return (
    <div className="flex flex-wrap gap-4 items-end rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.40)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.88), 0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>並び替え</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="glass-select px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#6B7280' }}>登録者数フィルタ（万人）</label>
        <div className="flex items-center gap-2">
          <input type="number" min="0" placeholder="0"
            value={minSubs} onChange={e => setMinSubs(e.target.value)}
            className="glass-input w-24 px-3 py-2 text-sm" />
          <span className="text-sm" style={{ color: '#9CA3AF' }}>万〜</span>
          <input type="number" min="0" placeholder="上限なし"
            value={maxSubs} onChange={e => setMaxSubs(e.target.value)}
            className="glass-input w-24 px-3 py-2 text-sm" />
          <span className="text-sm" style={{ color: '#9CA3AF' }}>万人</span>
        </div>
      </div>

      <button
        onClick={() => { setMinSubs(''); setMaxSubs(''); setSort('subscriberCount_desc'); if (onReset) onReset(); }}
        className="text-sm underline transition-colors"
        style={{ color: '#D1D5DB' }}
        onMouseEnter={e => e.target.style.color = '#6B7280'}
        onMouseLeave={e => e.target.style.color = '#D1D5DB'}
      >
        リセット
      </button>
    </div>
  );
}
