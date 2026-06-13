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
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: '#e82030' }}
        >
          1
        </div>
        <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>APIキー設定</p>
      </div>
      <p className="text-xs mb-4 ml-7" style={{ color: '#999' }}>
        🔒 キーはブラウザの SessionStorage にのみ保持され、サーバーには送信・保存されません
      </p>

      <form onSubmit={handleSave} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="AIza..."
            className="glass-input w-full px-4 py-2.5 pr-12 text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
            style={{ color: '#aaa' }}
            onMouseEnter={e => e.target.style.color = '#555'}
            onMouseLeave={e => e.target.style.color = '#aaa'}
          >
            {show ? '隠す' : '表示'}
          </button>
        </div>
        <button
          type="submit"
          disabled={!value.trim()}
          className="glass-btn-primary px-5 py-2.5 text-sm whitespace-nowrap"
        >
          保存
        </button>
        {apiKey && (
          <button
            type="button"
            onClick={() => { setValue(''); onSave(''); }}
            className="glass-btn-secondary px-4 py-2.5 text-sm whitespace-nowrap"
          >
            削除
          </button>
        )}
      </form>

      <div className="mt-3 flex items-center gap-3">
        {isSaved ? (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#16a34a' }}>
            <span>✓</span> APIキーが設定されています
          </span>
        ) : (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#b45309' }}>
            <span>⚠</span> APIキー未設定（モックデータで動作中）
          </span>
        )}
        <a
          href="https://note.com/yuki_tech/n/na82ad826df1f"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs ml-auto transition-colors"
          style={{ color: '#e82030' }}
          onMouseEnter={e => e.target.style.color = '#b01020'}
          onMouseLeave={e => e.target.style.color = '#e82030'}
        >
          YouTube Data API v3 の取得方法はこちら ↗
        </a>
      </div>
    </div>
  );
}
