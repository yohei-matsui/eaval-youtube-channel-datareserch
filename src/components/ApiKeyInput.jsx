import { useState, useEffect, useRef } from 'react';

export default function ApiKeyInput({ apiKey, onSave }) {
  const [value, setValue] = useState(apiKey || '');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(!!apiKey);
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setSaved(false);
    clearTimeout(debounceRef.current);
    if (v.trim()) {
      debounceRef.current = setTimeout(() => {
        onSave(v.trim());
        setSaved(true);
      }, 500);
    } else {
      onSave('');
    }
  };

  useEffect(() => {
    if (!apiKey) { setValue(''); setSaved(false); }
  }, [apiKey]);

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: '#dc2030' }}>1</div>
        <p className="text-sm font-semibold" style={{ color: '#1F2937' }}>APIキー設定</p>
      </div>
      <p className="text-xs mb-4 ml-7" style={{ color: '#6B7280' }}>
        キーはブラウザの SessionStorage にのみ保持され、サーバーには送信・保存されません
      </p>

      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            placeholder="AIza..."
            className="glass-input w-full px-4 py-2.5 pr-12 text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={e => e.target.style.color = '#374151'}
            onMouseLeave={e => e.target.style.color = '#9CA3AF'}
          >
            {show ? '隠す' : '表示'}
          </button>
        </div>
        {apiKey && (
          <button
            type="button"
            onClick={() => { setValue(''); onSave(''); setSaved(false); }}
            className="glass-btn-secondary px-4 py-2.5 text-sm whitespace-nowrap"
          >
            削除
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {saved && apiKey ? (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#16a34a' }}>
            <span>✓</span> APIキーが設定されています
          </span>
        ) : (
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#b45309' }}>
            <span>⚠</span> APIキーが未設定です
          </span>
        )}
        <a
          href="https://note.com/yuki_tech/n/na82ad826df1f"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs ml-auto transition-colors"
          style={{ color: '#dc2030' }}
          onMouseEnter={e => e.target.style.color = '#9e1020'}
          onMouseLeave={e => e.target.style.color = '#dc2030'}
        >
          YouTube Data API v3 の取得方法はこちら ↗
        </a>
      </div>
    </div>
  );
}
