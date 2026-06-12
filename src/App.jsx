import { useState, useMemo } from 'react';
import RegionTabs from './components/RegionTabs';
import FilterControls from './components/FilterControls';
import ChannelTable from './components/ChannelTable';
import ApiKeyInput from './components/ApiKeyInput';
import { loadChannels } from './api/youtube';
import { getMockChannels } from './api/mock';

const SESSION_KEY = 'yt_research_api_key';
const REGIONS = ['JP', 'KR', 'US'];

function getStoredKey() {
  try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch { return ''; }
}

const emptyRegionData = () => ({ channels: [], nextPageToken: null, mockPage: 0 });

const STEPS = [
  { num: 1, icon: '🔑', title: 'APIキー設定', desc: 'YouTube Data API v3のキーをページ内で入力・保存する' },
  { num: 2, icon: '🔍', title: 'キーワード入力', desc: '調査したいジャンルやキーワードを入力して検索する' },
  { num: 3, icon: '🌏', title: '国別データ取得', desc: '日本・韓国・アメリカの3リージョンのチャンネルを同時取得' },
  { num: 4, icon: '📊', title: 'フィルタ・分析', desc: '登録者数・視聴数でソート＆フィルタして競合を比較する' },
];

export default function App() {
  const [apiKey, setApiKey] = useState(getStoredKey);
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activeRegion, setActiveRegion] = useState('JP');
  const [regionData, setRegionData] = useState({ JP: emptyRegionData(), KR: emptyRegionData(), US: emptyRegionData() });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('subscriberCount_desc');
  const [minSubs, setMinSubs] = useState('');
  const [maxSubs, setMaxSubs] = useState('');

  const useMock = !apiKey;

  const handleSaveKey = (key) => {
    setApiKey(key);
    try {
      if (key) sessionStorage.setItem(SESSION_KEY, key);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    // キーが変わったら結果をリセット
    setQuery('');
    setInputValue('');
    setRegionData({ JP: emptyRegionData(), KR: emptyRegionData(), US: emptyRegionData() });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const q = inputValue.trim();
    setQuery(q);
    setLoading(true);
    setError(null);
    const fresh = { JP: emptyRegionData(), KR: emptyRegionData(), US: emptyRegionData() };

    try {
      if (useMock) {
        for (const region of REGIONS) {
          const result = getMockChannels(region, 0);
          fresh[region] = { ...result, mockPage: 0 };
        }
        setRegionData(fresh);
      } else {
        const results = await Promise.all(REGIONS.map(r => loadChannels(q, r, apiKey)));
        REGIONS.forEach((r, i) => { fresh[r] = { ...results[i], mockPage: 0 }; });
        setRegionData(fresh);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const current = regionData[activeRegion];
      if (useMock) {
        const nextPage = current.mockPage + 1;
        const result = getMockChannels(activeRegion, nextPage);
        setRegionData(prev => ({
          ...prev,
          [activeRegion]: { channels: [...prev[activeRegion].channels, ...result.channels], nextPageToken: result.nextPageToken, mockPage: nextPage },
        }));
      } else {
        const result = await loadChannels(query, activeRegion, apiKey, current.nextPageToken);
        setRegionData(prev => ({
          ...prev,
          [activeRegion]: { channels: [...prev[activeRegion].channels, ...result.channels], nextPageToken: result.nextPageToken, mockPage: 0 },
        }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const displayed = useMemo(() => {
    let list = [...(regionData[activeRegion]?.channels || [])];
    const min = minSubs !== '' ? parseFloat(minSubs) * 10000 : null;
    const max = maxSubs !== '' ? parseFloat(maxSubs) * 10000 : null;
    if (min !== null) list = list.filter(c => c.subscriberCount >= min);
    if (max !== null) list = list.filter(c => c.subscriberCount <= max);
    const [field, dir] = sort.split('_');
    list.sort((a, b) => dir === 'asc' ? a[field] - b[field] : b[field] - a[field]);
    return list;
  }, [regionData, activeRegion, sort, minSubs, maxSubs]);

  const hasSearched = query !== '';
  const current = regionData[activeRegion];

  return (
    <div className="min-h-screen bg-rose-50/60">

      {/* Header */}
      <header className="pt-8 pb-2 text-center">
        <div className="inline-flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-base">YouTubeチャンネルデータ分析ツール</span>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 pt-6 pb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-snug">
          キーワードから競合チャンネルを<br />リサーチしてデータを抽出するツールです
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
          検索キーワードを入力するだけで、日本・韓国・アメリカからそれぞれ関連チャンネルを一括取得。
          登録者数・視聴数・長尺/ショート比率などを一覧で比較できます。
        </p>
      </section>

      {/* Steps */}
      <section className="px-6 pb-8">
        <p className="text-center text-xs font-medium text-gray-400 mb-4 tracking-widest uppercase">使い方</p>
        <div className="flex justify-center items-start gap-2 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-start gap-2">
              <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-4 w-40 text-center">
                <div className="text-xs text-rose-400 font-bold mb-1">{step.num}</div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">{step.title}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{step.desc}</div>
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-gray-300 text-lg mt-10">›</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 space-y-4 pb-8">
        {/* Step 1: API Key */}
        <ApiKeyInput apiKey={apiKey} onSave={handleSaveKey} />

        {/* Step 2: Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">2</div>
            <p className="text-sm font-semibold text-gray-700">検索キーワードを入力してください</p>
            {useMock && (
              <span className="ml-auto text-xs bg-amber-50 text-amber-500 border border-amber-200 px-2 py-0.5 rounded-full">
                モックデータで動作中
              </span>
            )}
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="例：プログラミング、AI、マーケティング"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-gray-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-6 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
            >
              {loading ? '検索中…' : 'チャンネル取得 & 分析スタート'}
            </button>
          </form>
          {!hasSearched && (
            <p className="text-xs text-gray-400 mt-3 text-center">↑ 上記にキーワードを入力してください</p>
          )}
        </div>
      </div>

      {/* Results */}
      {(hasSearched || loading) && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              エラーが発生しました: {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
            <div className="px-6 pt-5 pb-0 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                <p className="text-sm font-semibold text-gray-700">
                  「<span className="text-red-500">{query}</span>」の検索結果
                </p>
              </div>
              <RegionTabs active={activeRegion} onChange={setActiveRegion} />
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block w-8 h-8 border-4 border-rose-100 border-t-red-500 rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400 text-sm">チャンネルデータを取得中...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FilterControls
                    sort={sort} setSort={setSort}
                    minSubs={minSubs} setMinSubs={setMinSubs}
                    maxSubs={maxSubs} setMaxSubs={setMaxSubs}
                  />
                  <div className="text-xs text-gray-400">
                    {displayed.length} チャンネル表示中
                    {(minSubs || maxSubs) && ' （フィルタ適用中）'}
                  </div>
                  <ChannelTable channels={displayed} />
                  {current.nextPageToken && (
                    <div className="text-center pt-2">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-8 py-2.5 bg-white border-2 border-red-400 text-red-500 rounded-lg text-sm font-medium hover:bg-rose-50 disabled:opacity-50 transition-colors"
                      >
                        {loadingMore ? '読み込み中…' : '次の10件を取得'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
