const SORT_OPTIONS = [
  { value: 'subscriberCount_desc', label: '登録者数（多い順）' },
  { value: 'subscriberCount_asc', label: '登録者数（少ない順）' },
  { value: 'viewCount_desc', label: '累計再生回数（多い順）' },
  { value: 'viewCount_asc', label: '累計再生回数（少ない順）' },
  { value: 'videoCount_desc', label: '動画本数（多い順）' },
  { value: 'videoCount_asc', label: '動画本数（少ない順）' },
  { value: 'avgViews_desc', label: '平均再生数（多い順）' },
  { value: 'avgViews_asc', label: '平均再生数（少ない順）' },
  { value: 'medianViews_desc', label: '中央値（多い順）' },
  { value: 'medianViews_asc', label: '中央値（少ない順）' },
];

const LIMIT_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function FilterControls({ sort, setSort, minSubs, setMinSubs, maxSubs, setMaxSubs, resultLimit, setResultLimit, onReset }) {
  return (
    <div
      className="flex flex-wrap gap-4 items-end rounded-xl p-4"
      style={{ background: 'rgba(232,32,48,0.04)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}
    >
      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#777' }}>並び替え</label>
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
        <label className="block text-xs font-medium mb-1" style={{ color: '#777' }}>登録者数フィルタ（万人）</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="0"
            value={minSubs}
            onChange={e => setMinSubs(e.target.value)}
            className="glass-input w-24 px-3 py-2 text-sm"
          />
          <span className="text-sm" style={{ color: '#aaa' }}>万〜</span>
          <input
            type="number"
            min="0"
            placeholder="上限なし"
            value={maxSubs}
            onChange={e => setMaxSubs(e.target.value)}
            className="glass-input w-24 px-3 py-2 text-sm"
          />
          <span className="text-sm" style={{ color: '#aaa' }}>万人</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1" style={{ color: '#777' }}>
          取得件数
          <span className="ml-1 font-normal" style={{ color: '#bbb' }}>（次回検索から適用）</span>
        </label>
        <p className="text-xs mb-1" style={{ color: '#f59e0b' }}>
          ⚠️ 件数が多いほどAPI消費が増え、1日の上限に達しやすくなります
        </p>
        <select
          value={resultLimit}
          onChange={e => setResultLimit(Number(e.target.value))}
          className="glass-select px-3 py-2 text-sm"
        >
          {LIMIT_OPTIONS.map(n => (
            <option key={n} value={n}>{n}件</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => { setMinSubs(''); setMaxSubs(''); setSort('subscriberCount_desc'); if (onReset) onReset(); }}
        className="text-sm transition-colors underline"
        style={{ color: '#ccc' }}
        onMouseEnter={e => e.target.style.color = '#888'}
        onMouseLeave={e => e.target.style.color = '#ccc'}
      >
        リセット
      </button>
    </div>
  );
}
