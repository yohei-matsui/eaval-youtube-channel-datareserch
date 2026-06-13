import { exportCSV, exportPDF } from '../utils/export';

export default function ExportButtons({ channels, selectedIds, query, region }) {
  const targets = selectedIds && selectedIds.size > 0
    ? channels.filter(ch => selectedIds.has(ch.id))
    : channels;
  if (!channels.length) return null;

  const filename = `yt_${region}_${query}_${new Date().toISOString().slice(0, 10)}`;
  const hasSelection = selectedIds && selectedIds.size > 0;
  const label = hasSelection ? `${selectedIds.size}件選択` : `全${channels.length}件`;

  const btnBase = {
    border: 'none', borderRadius: '9999px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem',
    fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.18s ease',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.88), 0 1px 4px rgba(0,0,0,0.06)',
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        {hasSelection ? (
          <>チェックした <span className="font-semibold" style={{ color: '#dc2030' }}>{selectedIds.size}件</span> を出力します</>
        ) : (
          <>左のチェックボックスで選択したデータのみ出力できます<span className="ml-1" style={{ color: '#D1D5DB' }}>（未選択時は全件）</span></>
        )}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: hasSelection ? '#dc2030' : '#9CA3AF' }}>{label}を出力</span>
        <button onClick={() => exportCSV(targets, filename)}
          style={{ ...btnBase, background: 'rgba(255,255,255,0.55)', color: '#15803d' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.82)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          CSV出力
        </button>
        <button onClick={() => exportPDF(targets, query, filename)}
          style={{ ...btnBase, background: 'rgba(255,255,255,0.55)', color: '#be1828' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.82)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
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
