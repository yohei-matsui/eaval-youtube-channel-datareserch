const SORT_OPTIONS = [
  { value: 'subscriberCount_desc', label: '登録者数（多い順）' },
  { value: 'subscriberCount_asc', label: '登録者数（少ない順）' },
  { value: 'viewCount_desc', label: '合計視聴回数（多い順）' },
  { value: 'viewCount_asc', label: '合計視聴回数（少ない順）' },
  { value: 'videoCount_desc', label: '動画本数（多い順）' },
  { value: 'videoCount_asc', label: '動画本数（少ない順）' },
];

export default function FilterControls({ sort, setSort, minSubs, setMinSubs, maxSubs, setMaxSubs }) {
  return (
    <div className="flex flex-wrap gap-4 items-end bg-gray-50 rounded-lg p-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">並び替え</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">登録者数フィルタ（万人）</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="0"
            value={minSubs}
            onChange={e => setMinSubs(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <span className="text-gray-500 text-sm">万〜</span>
          <input
            type="number"
            min="0"
            placeholder="上限なし"
            value={maxSubs}
            onChange={e => setMaxSubs(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <span className="text-gray-500 text-sm">万人</span>
        </div>
      </div>

      <button
        onClick={() => { setMinSubs(''); setMaxSubs(''); setSort('subscriberCount_desc'); }}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
      >
        リセット
      </button>
    </div>
  );
}
