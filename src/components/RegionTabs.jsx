const REGIONS = [
  { code: 'JP', label: '🇯🇵 日本（JP）' },
  { code: 'KR', label: '🇰🇷 韓国（KR）' },
  { code: 'US', label: '🇺🇸 アメリカ（US）' },
];

export default function RegionTabs({ active, onChange }) {
  return (
    <div className="flex border-b border-gray-200">
      {REGIONS.map(r => (
        <button
          key={r.code}
          onClick={() => onChange(r.code)}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            active === r.code
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
