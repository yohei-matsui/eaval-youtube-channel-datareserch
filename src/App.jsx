import { useState, useMemo } from 'react';
import RegionTabs from './components/RegionTabs';
import FilterControls from './components/FilterControls';
import ChannelTable from './components/ChannelTable';
import ApiKeyInput from './components/ApiKeyInput';
import ExportButtons from './components/ExportButtons';
import { loadChannels } from './api/youtube';
import { getMockChannels } from './api/mock';
import { translateToAllRegions } from './api/translate';
import { fetchSuggestions } from './api/suggest';
import { fetchTrends } from './api/trends';
import SuggestKeywords from './components/SuggestKeywords';
import TrendsKeywords from './components/TrendsKeywords';

const SESSION_KEY = 'yt_research_api_key';
const REGIONS = ['JP', 'KR', 'US'];

const REGION_LABEL = { JP: '🇯🇵 日本（JP）', KR: '🇰🇷 韓国（KR）', US: '🇺🇸 アメリカ（US）' };
const REGION_PLACEHOLDER = { JP: '例：プログラミング、英語、料理', KR: '예: 프로그래밍, 영어, 요리', US: 'e.g. programming, English, cooking' };

function getStoredKey() {
  try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch { return ''; }
}

const emptyRegionData = () => ({ channels: [], nextPageToken: null, mockPage: 0 });

const STEPS = [
  { num: 1, icon: '🔑', title: 'APIキー設定', desc: 'YouTube Data API v3のキーをページ内で入力・保存する' },
  { num: 2, icon: '🔍', title: 'キーワード入力', desc: '日本語で入力すると韓国語・英語に自動翻訳して検索' },
  { num: 3, icon: '🌏', title: '国別データ取得', desc: '日本・韓国・アメリカそれぞれの言語で独立して取得' },
  { num: 4, icon: '📊', title: 'フィルタ・分析', desc: '登録者数・視聴数でソート＆フィルタして競合を比較する' },
];

export default function App() {
  const [apiKey, setApiKey] = useState(getStoredKey);
  const [activeRegion, setActiveRegion] = useState('JP');
  const [inputValue, setInputValue] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translatedQueries, setTranslatedQueries] = useState({ JP: '', KR: '', US: '' });
  const [regionData, setRegionData] = useState({ JP: emptyRegionData(), KR: emptyRegionData(), US: emptyRegionData() });
  const [regionLoading, setRegionLoading] = useState({ JP: false, KR: false, US: false });
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [trends, setTrends] = useState({ top: [], rising: [] });
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('subscriberCount_desc');
  const [sortChanged, setSortChanged] = useState(false);
  const [minSubs, setMinSubs] = useState('');
  const [maxSubs, setMaxSubs] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [resultLimit, setResultLimit] = useState(50);

  const useMock = !apiKey;

  const handleSaveKey = (key) => {
    setApiKey(key);
    try {
      if (key) sessionStorage.setItem(SESSION_KEY, key);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setRegionData({ JP: emptyRegionData(), KR: emptyRegionData(), US: emptyRegionData() });
    setHasSearched(false);
    setSuggestions([]);
    setTrends({ top: [], rising: [] });
  };

  const searchRegion = async (region, query, fresh = false) => {
    setRegionLoading(prev => ({ ...prev, [region]: true }));
    try {
      let result;
      if (useMock) {
        result = getMockChannels(region, 0, query);
      } else {
        result = await loadChannels(query, region, apiKey, resultLimit);
      }
      if (fresh) {
        setRegionData(prev => ({ ...prev, [region]: { ...result, mockPage: 0 } }));
      } else {
        setRegionData(prev => ({ ...prev, [region]: { ...result, mockPage: 0 } }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegionLoading(prev => ({ ...prev, [region]: false }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const q = inputValue.trim();
    setError(null);
    setSortChanged(false);
    setHasSearched(true);
    setSuggestions([]);
    setSuggestLoading(true);
    setTrends({ top: [], rising: [] });
    setTrendsLoading(true);
    setTranslating(true);

    // 翻訳 + サジェスト + トレンド を並列取得
    const [queries] = await Promise.all([
      translateToAllRegions(q).catch(() => ({ JP: q, KR: q, US: q })),
      fetchSuggestions(q, 'ja').then(s => { setSuggestions(s); setSuggestLoading(false); }).catch(() => setSuggestLoading(false)),
      fetchTrends(q, 'JP').then(t => { setTrends(t); setTrendsLoading(false); }).catch(() => setTrendsLoading(false)),
    ]);
    setTranslatedQueries(queries);
    setTranslating(false);

    // 3リージョン並列検索
    setRegionLoading({ JP: true, KR: true, US: true });
    await Promise.all(REGIONS.map(r => searchRegion(r, queries[r], true)));
  };

  // タブ内の翻訳キーワードを手動編集して再検索
  const handleReSearch = async (region) => {
    const q = translatedQueries[region]?.trim();
    if (!q) return;
    setSortChanged(false);
    await searchRegion(region, q);
  };

  const displayed = useMemo(() => {
    let list = [...(regionData[activeRegion]?.channels || [])];
    const min = minSubs !== '' ? parseFloat(minSubs) * 10000 : null;
    const max = maxSubs !== '' ? parseFloat(maxSubs) * 10000 : null;
    if (min !== null) list = list.filter(c => c.subscriberCount >= min);
    if (max !== null) list = list.filter(c => c.subscriberCount <= max);
    if (sortChanged) {
      const [field, dir] = sort.split('_');
      list.sort((a, b) => dir === 'asc' ? a[field] - b[field] : b[field] - a[field]);
    }
    return list;
  }, [regionData, activeRegion, sort, sortChanged, minSubs, maxSubs]);

  const anyLoading = translating || Object.values(regionLoading).some(Boolean);
  const currentLoading = regionLoading[activeRegion];

  return (
    <div className="bg-space">

      {/* Header */}
      <header className="pt-8 pb-2 text-center">
        <div className="inline-flex items-center gap-3 mb-1">
          <img src="/logo.png" alt="EAVAL" className="w-10 h-10 object-contain" />
          <span className="font-bold text-base tracking-wide" style={{ color: '#1a1a1a' }}>YouTubeチャンネルデータリサーチツール</span>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 pt-6 pb-8">
        <h1 className="text-3xl font-bold mb-3 leading-snug" style={{ color: '#1a1a1a' }}>
          キーワードから競合チャンネルをリサーチしてデータを抽出するツールです
        </h1>
        <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: '#888' }}>
          検索キーワードを入力するだけで、日本・韓国・アメリカからそれぞれ関連チャンネルを一括取得。
          登録者数・視聴数・長尺/ショート比率などを一覧で比較できます。
        </p>
      </section>

      {/* Steps */}
      <section className="px-6 pb-8">
        <p className="text-center text-xs font-medium mb-4 tracking-widest uppercase" style={{ color: '#bbb' }}>使い方</p>
        <div className="flex justify-center items-start gap-3 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-start gap-3">
              <div className="glass-card p-4 w-44 text-center">
                <div className="text-xs font-bold mb-1" style={{ color: '#e82030' }}>{step.num}</div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>{step.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: '#999' }}>{step.desc}</div>
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-lg mt-10" style={{ color: '#ddd' }}>›</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 space-y-4 pb-8">
        {/* Step 1: API Key */}
        <ApiKeyInput apiKey={apiKey} onSave={handleSaveKey} />

        {/* Step 2: Search */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#e82030' }}>2</div>
            <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>キーワードと取得するチャンネル数を入力してください</p>
            {useMock && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(217,119,6,0.1)', color: '#b45309' }}>
                モックデータで動作中
              </span>
            )}
          </div>
          <p className="text-xs mb-4 ml-7" style={{ color: '#999' }}>
            日本語で入力すると韓国語・英語に<span style={{ color: '#e82030' }} className="font-medium">自動翻訳</span>して各リージョンで検索します
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="例：プログラミング、英語学習、料理"
              className="glass-input flex-1 px-4 py-3 text-sm"
            />
            {/* 取得件数セレクタ */}
            <select
              value={resultLimit}
              onChange={e => setResultLimit(Number(e.target.value))}
              title="取得件数（多いほどAPI消費が増えます）"
              className="glass-select px-3 py-2 text-sm"
            >
              {[10,20,30,40,50,60,70,80,90,100].map(n => (
                <option key={n} value={n}>{n}件</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={anyLoading || !inputValue.trim()}
              className="glass-btn-primary px-6 py-3 text-sm whitespace-nowrap"
            >
              {translating ? '翻訳中…' : anyLoading ? '検索中…' : 'チャンネル取得 & 分析スタート'}
            </button>
          </form>
          <p className="text-xs mt-2 ml-1" style={{ color: '#f59e0b' }}>
            ⚠️ 取得件数が多いほどAPI消費が増え、1日の利用上限に達しやすくなります
          </p>

          {/* サジェストキーワード */}
          {hasSearched && (
            <SuggestKeywords
              suggestions={suggestions}
              loading={suggestLoading}
              onSelect={kw => setInputValue(kw)}
            />
          )}

          {/* Google Trends キーワード */}
          {hasSearched && (
            <TrendsKeywords
              top={trends.top}
              rising={trends.rising}
              loading={trendsLoading}
              onSelect={kw => setInputValue(kw)}
            />
          )}

          {/* 翻訳済みキーワード表示 */}
          {hasSearched && !translating && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium" style={{ color: '#999' }}>各リージョンの検索キーワード（編集して再検索も可能）</p>
              {REGIONS.map(region => (
                <div key={region} className="flex gap-2 items-center">
                  <span className="text-xs w-28 shrink-0" style={{ color: '#777' }}>{REGION_LABEL[region]}</span>
                  <input
                    type="text"
                    value={translatedQueries[region] || ''}
                    onChange={e => setTranslatedQueries(prev => ({ ...prev, [region]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleReSearch(region)}
                    className="glass-input flex-1 px-3 py-1.5 text-sm"
                  />
                  <button
                    onClick={() => handleReSearch(region)}
                    disabled={regionLoading[region] || !translatedQueries[region]?.trim()}
                    className="glass-btn-secondary px-3 py-1.5 text-xs whitespace-nowrap"
                  >
                    {regionLoading[region] ? '…' : '再検索'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          {error && (
            <div className="mb-4 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,32,48,0.08)', color: '#c01020' }}>
              エラー: {error}
            </div>
          )}

          {useMock && (
            <div className="mb-4 flex items-start gap-3 p-4 rounded-xl text-sm" style={{ background: 'rgba(217,119,6,0.08)', color: '#92400e' }}>
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <p className="font-semibold mb-0.5">デモ表示中 — 表示されているのはサンプルデータです</p>
                <p className="text-xs" style={{ color: '#b45309' }}>APIキーを設定すると実際のYouTubeチャンネルが取得されます。</p>
              </div>
            </div>
          )}

          <div className="glass-panel overflow-hidden">
            <div className="px-6 pt-5 pb-0" style={{ borderBottom: '1px solid rgba(232,32,48,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#e82030' }}>3</div>
                <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                  検索結果
                  {translatedQueries[activeRegion] && (
                    <span className="ml-2 font-normal" style={{ color: '#999' }}>
                      「<span style={{ color: '#e82030' }}>{translatedQueries[activeRegion]}</span>」
                    </span>
                  )}
                </p>
              </div>
              <RegionTabs active={activeRegion} onChange={setActiveRegion} />
            </div>

            <div className="p-6">
              {currentLoading || translating ? (
                <div className="text-center py-16">
                  <div className="glass-spinner inline-block w-8 h-8 mb-3"></div>
                  <p className="text-sm" style={{ color: '#aaa' }}>
                    {translating ? 'キーワードを翻訳中...' : 'チャンネルデータを取得中...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <FilterControls
                    sort={sort} setSort={v => { setSort(v); setSortChanged(true); }}
                    minSubs={minSubs} setMinSubs={setMinSubs}
                    maxSubs={maxSubs} setMaxSubs={setMaxSubs}
                    onReset={() => setSortChanged(false)}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: '#aaa' }}>
                      {displayed.length} チャンネル表示中
                      {selectedIds.size > 0 && (
                        <span className="ml-2 font-medium" style={{ color: '#e82030' }}>
                          {selectedIds.size}件選択中
                        </span>
                      )}
                      {(minSubs || maxSubs) && ' （フィルタ適用中）'}
                    </div>
                    <ExportButtons
                      channels={displayed}
                      selectedIds={selectedIds}
                      query={translatedQueries[activeRegion] || ''}
                      region={activeRegion}
                    />
                  </div>
                  <ChannelTable
                    channels={displayed}
                    selectedIds={selectedIds}
                    onToggle={id => setSelectedIds(prev => {
                      const next = new Set(prev);
                      next.has(id) ? next.delete(id) : next.add(id);
                      return next;
                    })}
                    onToggleAll={allSelected => {
                      if (allSelected) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(displayed.map(ch => ch.id)));
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
