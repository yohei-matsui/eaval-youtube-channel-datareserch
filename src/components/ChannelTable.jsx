import { useState } from 'react';

function CopyButton({ url }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} title="URLをコピー"
      className="p-1.5 rounded-lg transition-all"
      style={{ color: copied ? '#16a34a' : '#D1D5DB', background: copied ? 'rgba(22,163,74,0.07)' : 'transparent' }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.color = '#9CA3AF'; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.color = '#D1D5DB'; }}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function Checkbox({ checked, indeterminate = false, onChange, title }) {
  return (
    <label title={title} className="flex items-center justify-center cursor-pointer w-5 h-5 relative">
      <input type="checkbox" checked={checked}
        ref={el => { if (el) el.indeterminate = indeterminate; }}
        onChange={onChange} className="sr-only" />
      <span className="w-4 h-4 rounded flex items-center justify-center transition-all shrink-0"
        style={{
          background: checked || indeterminate
            ? 'linear-gradient(160deg,#f04050,#cc1828)'
            : 'rgba(255,255,255,0.6)',
          boxShadow: checked || indeterminate
            ? 'inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 6px rgba(204,24,40,0.28)'
            : 'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 0 0 1px rgba(220,38,38,0.18)',
        }}
      >
        {indeterminate && !checked ? (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 2" fill="none">
            <line x1="1" y1="1" x2="9" y2="1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : checked ? (
          <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
            <polyline points="1,4 3.5,6.5 9,1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : null}
      </span>
    </label>
  );
}

function fmt(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}億`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toLocaleString();
}
function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
}
function fmtRatio(longForm, shorts) {
  const total = longForm + shorts;
  if (total === 0) return { longPct: '-', shortPct: '-' };
  return { longPct: Math.round((longForm/total)*100), shortPct: Math.round((shorts/total)*100) };
}

const TOOLTIPS = {
  title:           'チャンネル名をクリックするとYouTubeチャンネルページに移動します',
  publishedAt:     'チャンネルが開設された日付です',
  subscriberCount: 'チャンネルの現在の登録者数です',
  viewCount:       'チャンネル全動画の累計再生回数です',
  videoCount:      'チャンネルに投稿された動画の総本数です',
  avgViews:        '直近100本のうち3分超の長尺動画のみを対象にした1本あたり平均再生回数です',
  medianViews:     '直近100本のうち3分超の長尺動画のみを対象にした再生回数の中央値です。外れ値の影響を受けにくく実力値に近い指標です',
  ratio:           '直近100本の動画を取得し、再生時間が180秒超を長尺・180秒以下をショートとして分類した比率です',
  copy:            'チャンネルURLをクリップボードにコピーします',
};

function Th({ children, tooltip, className = '' }) {
  return (
    <th className={`px-3 py-3 font-medium relative group ${className}`} style={{ color: '#6B7280' }}>
      <span className="cursor-default">{children}</span>
      {tooltip && (
        <span className="pointer-events-none absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl text-xs font-normal leading-snug px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal text-center"
          style={{
            background: 'rgba(31,41,55,0.92)',
            backdropFilter: 'blur(16px)',
            color: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          }}
        >
          {tooltip}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: 'rgba(31,41,55,0.92)' }} />
        </span>
      )}
    </th>
  );
}

export default function ChannelTable({ channels, selectedIds, onToggle, onToggleAll }) {
  if (channels.length === 0) {
    return <p className="text-center py-12" style={{ color: '#9CA3AF' }}>データがありません</p>;
  }

  const allSelected  = channels.length > 0 && channels.every(ch => selectedIds.has(ch.id));
  const someSelected = channels.some(ch => selectedIds.has(ch.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm glass-table">
        <thead>
          <tr className="text-left">
            <th className="px-3 py-3 w-10 text-center">
              <Checkbox checked={allSelected} indeterminate={someSelected && !allSelected}
                onChange={() => onToggleAll(allSelected)}
                title={allSelected ? 'すべて解除' : 'すべて選択'} />
            </th>
            <Th tooltip={TOOLTIPS.title}           className="min-w-[180px]">チャンネル名</Th>
            <Th tooltip={TOOLTIPS.publishedAt}     className="whitespace-nowrap">開設日</Th>
            <Th tooltip={TOOLTIPS.subscriberCount} className="whitespace-nowrap text-right">登録者数</Th>
            <Th tooltip={TOOLTIPS.viewCount}       className="whitespace-nowrap text-right">累計再生回数</Th>
            <Th tooltip={TOOLTIPS.videoCount}      className="whitespace-nowrap text-right">動画総数</Th>
            <Th tooltip={TOOLTIPS.avgViews}        className="whitespace-nowrap text-right">
              <span>平均再生数</span>
              <span className="block text-xs font-normal" style={{ color: '#9CA3AF' }}>長尺のみ</span>
            </Th>
            <Th tooltip={TOOLTIPS.medianViews}     className="whitespace-nowrap text-right">
              <span>中央値</span>
              <span className="block text-xs font-normal" style={{ color: '#9CA3AF' }}>長尺のみ</span>
            </Th>
            <Th tooltip={TOOLTIPS.ratio}           className="whitespace-nowrap text-center">
              <span>長尺：ショート</span>
              <span className="block text-xs font-normal" style={{ color: '#9CA3AF' }}>直近100本の比率</span>
            </Th>
            <Th tooltip={TOOLTIPS.copy} className="text-center w-10"></Th>
          </tr>
        </thead>
        <tbody>
          {channels.map(ch => {
            const { longPct, shortPct } = fmtRatio(ch.longForm, ch.shorts);
            const isSelected = selectedIds.has(ch.id);
            return (
              <tr key={ch.id} onClick={() => onToggle(ch.id)} className="cursor-pointer"
                style={isSelected ? { background: 'rgba(220,38,38,0.04)' } : {}}>
                <td className="px-3 py-3 text-center" onClick={e => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onChange={() => onToggle(ch.id)} />
                </td>
                <td className="px-3 py-3">
                  <a href={ch.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="font-medium transition-colors"
                    style={{ color: '#dc2030' }}
                    onMouseEnter={e => e.target.style.color = '#9e1020'}
                    onMouseLeave={e => e.target.style.color = '#dc2030'}
                  >{ch.title}</a>
                </td>
                <td className="px-3 py-3 whitespace-nowrap" style={{ color: '#9CA3AF' }}>{fmtDate(ch.publishedAt)}</td>
                <td className="px-3 py-3 text-right font-semibold" style={{ color: '#1F2937' }}>{fmt(ch.subscriberCount)}</td>
                <td className="px-3 py-3 text-right" style={{ color: '#374151' }}>{fmt(ch.viewCount)}</td>
                <td className="px-3 py-3 text-right" style={{ color: '#374151' }}>{ch.videoCount.toLocaleString()}</td>
                <td className="px-3 py-3 text-right" style={{ color: '#374151' }}>{fmt(ch.avgViews)}</td>
                <td className="px-3 py-3 text-right" style={{ color: '#374151' }}>{fmt(ch.medianViews)}</td>
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  <span className="font-medium" style={{ color: '#2563eb' }}>{longPct}%</span>
                  <span className="mx-1" style={{ color: '#E5E7EB' }}>:</span>
                  <span className="font-medium" style={{ color: '#dc2030' }}>{shortPct}%</span>
                </td>
                <td className="px-2 py-3 text-center" onClick={e => e.stopPropagation()}>
                  <CopyButton url={ch.url} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs mt-2 px-3" style={{ color: '#9CA3AF' }}>
        ※直近100本に基づく集計。平均再生数・中央値は3分超の長尺動画のみが対象。ショートは180秒以下の動画
      </p>
    </div>
  );
}
