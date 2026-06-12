import { useState } from 'react';

export default function ApiKeyInput({ apiKey, onSave }) {
  const [value, setValue] = useState(apiKey || '');
  const [show, setShow] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (value.trim()) onSave(value.trim());
  };

  const isSaved = apiKey && apiKey === value.trim();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">1</div>
        <p className="text-sm font-semibold text-gray-700">APIキー設定</p>
      </div>
      <p className="text-xs text-gray-400 mb-4 ml-7">
        🔒 キーはブラウザの SessionStorage にのみ保持され、サーバーには送信・保存されません
      </p>

      <form onSubmit={handleSave} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="AIza..."
            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 font-mono"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {show ? '隠す' : '表示'}
          </button>
        </div>
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-40 transition-colors whitespace-nowrap"
        >
          保存
        </button>
        {apiKey && (
          <button
            type="button"
            onClick={() => { setValue(''); onSave(''); }}
            className="px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors whitespace-nowrap"
          >
            削除
          </button>
        )}
      </form>

      <div className="mt-3 flex items-center gap-3">
        {isSaved ? (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span>✓</span> APIキーが設定されています
          </span>
        ) : (
          <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
            <span>⚠</span> APIキー未設定（モックデータで動作中）
          </span>
        )}
        <a
          href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline ml-auto"
        >
          YouTube Data API v3 の取得方法はこちら ↗
        </a>
      </div>
    </div>
  );
}
