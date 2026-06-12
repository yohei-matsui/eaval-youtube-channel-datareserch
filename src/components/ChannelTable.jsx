function fmt(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}億`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toLocaleString();
}

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function fmtRatio(longForm, shorts) {
  const total = longForm + shorts;
  if (total === 0) return { longPct: '-', shortPct: '-' };
  return {
    longPct: Math.round((longForm / total) * 100),
    shortPct: Math.round((shorts / total) * 100),
  };
}

const TOOLTIPS = {
  title: 'チャンネル名をクリックするとYouTubeチャンネルページに移動します',
  publishedAt: 'チャンネルが開設された日付です',
  subscriberCount: 'チャンネルの現在の登録者数です',
  viewCount: 'チャンネル全動画の累計視聴回数です',
  videoCount: 'チャンネルに投稿された動画の総本数です',
  ratio: '直近100本の動画を取得し、再生時間が180秒超を長尺・180秒以下をショートとして分類した比率です',
};

function Th({ children, tooltip, className = '' }) {
  return (
    <th className={`px-3 py-3 font-medium relative group ${className}`}>
      <span className="cursor-default">{children}</span>
      <span className="pointer-events-none absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded bg-gray-800 text-white text-xs font-normal leading-snug px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal text-center shadow-lg">
        {tooltip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
      </span>
    </th>
  );
}

export default function ChannelTable({ channels }) {
  if (channels.length === 0) {
    return <p className="text-center text-gray-400 py-12">データがありません</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            <Th tooltip={TOOLTIPS.title} className="min-w-[180px]">チャンネル名</Th>
            <Th tooltip={TOOLTIPS.publishedAt} className="whitespace-nowrap">開設日</Th>
            <Th tooltip={TOOLTIPS.subscriberCount} className="whitespace-nowrap text-right">登録者数</Th>
            <Th tooltip={TOOLTIPS.viewCount} className="whitespace-nowrap text-right">合計視聴数</Th>
            <Th tooltip={TOOLTIPS.videoCount} className="whitespace-nowrap text-right">動画総数</Th>
            <Th tooltip={TOOLTIPS.ratio} className="whitespace-nowrap text-center">
              <span>長尺：ショート</span>
              <span className="block text-xs text-gray-400 font-normal">直近100本の比率</span>
            </Th>
          </tr>
        </thead>
        <tbody>
          {channels.map((ch, i) => {
            const { longPct, shortPct } = fmtRatio(ch.longForm, ch.shorts);
            return (
              <tr key={ch.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <td className="px-3 py-3">
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {ch.title}
                  </a>
                </td>
                <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{fmtDate(ch.publishedAt)}</td>
                <td className="px-3 py-3 text-right font-medium">{fmt(ch.subscriberCount)}</td>
                <td className="px-3 py-3 text-right text-gray-600">{fmt(ch.viewCount)}</td>
                <td className="px-3 py-3 text-right text-gray-600">{ch.videoCount.toLocaleString()}</td>
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  <span className="text-blue-600 font-medium">{longPct}%</span>
                  <span className="text-gray-400 mx-1">:</span>
                  <span className="text-pink-500 font-medium">{shortPct}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2 px-3">※ショートは再生時間が180秒以下の動画。直近100本に基づく比率です</p>
    </div>
  );
}
