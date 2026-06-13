const REGIONS = [
  { code: 'JP', label: '🇯🇵 日本（JP）' },
  { code: 'KR', label: '🇰🇷 韓国（KR）' },
  { code: 'US', label: '🇺🇸 アメリカ（US）' },
];

export default function RegionTabs({ active, onChange }) {
  return (
    <div className="flex" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      {REGIONS.map(r => (
        <button
          key={r.code}
          onClick={() => onChange(r.code)}
          className={`px-6 py-3 font-medium text-sm transition-colors -mb-px ${
            active === r.code ? 'glass-tab-active' : 'glass-tab-inactive'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
