// MyMemory Translation API（無料・APIキー不要）
export async function translate(text, from, to) {
  if (!text.trim()) return text;
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
    );
    const data = await res.json();
    if (data.responseStatus === 200) return data.responseData.translatedText;
  } catch {}
  return text; // 失敗時は元のテキストをそのまま返す
}

export async function translateToAllRegions(jpQuery) {
  // ja→en を先に取得し、en→ko の精度が高い経路で韓国語に変換
  const en = await translate(jpQuery, 'ja', 'en').catch(() => jpQuery);
  const kr = await translate(en, 'en', 'ko').catch(() => en);
  return { JP: jpQuery, KR: kr, US: en };
}
