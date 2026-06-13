import { exportCSV, exportPDF } from '../utils/export';

export default function ExportButtons({ channels, selectedIds, query, region }) {
  // 選択があればそれだけ、なければ全件
  const targets = selectedIds && selectedIds.size > 0
    ? channels.filter(ch => selectedIds.has(ch.id))
    : channels;

  if (!channels.length) return null;

  const filename = `yt_${region}_${query}_${new Date().toISOString().slice(0, 10)}`;
  const label = selectedIds && selectedIds.size > 0
    ? `${selectedIds.size}件選択`
    : `全${channels.length}件`;

  const hasSelection = selectedIds && selectedIds.size > 0;

  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* 説明テキスト */}
      <p className="text-xs" style={{ color: '#aaa' }}>
        {hasSelection ? (
          <>
            チェックした <span className="font-semibold" style={{ color: '#e82030' }}>{selectedIds.size}件</span> を出力します
          </>
        ) : (
          <>
            左のチェックボックスで選択したデータのみ出力できます
            <span className="ml-1" style={{ color: '#ccc' }}>（未選択時は全件）</span>
          </>
        )}
      </p>

      {/* ボタン行 */}
      <div className="flex items-center gap-2">
        {/* 選択件数ラベル */}
        <span className="text-xs" style={{ color: hasSelection ? '#e82030' : '#bbb' }}>
          {label}を出力
        </span>

      <button
        onClick={() => exportCSV(targets, filename)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all"
        style={{
          background: 'rgba(22,163,74,0.1)',
          color: '#15803d',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.1)'; }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        CSV出力
      </button>

      <button
        onClick={() => exportPDF(targets, query, filename)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all"
        style={{
          background: 'rgba(232,32,48,0.08)',
          color: '#c01020',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,32,48,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,32,48,0.08)'; }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><polyline points="9 9 10 9"/>
        </svg>
        PDF出力
      </button>
      </div>
    </div>
  );
}
