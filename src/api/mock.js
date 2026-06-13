const BASE_CHANNELS = {
  JP: [
    { id: 'UC_jp1', title: 'テックチャンネルJP', publishedAt: '2018-04-12T00:00:00Z', subscriberCount: 850000, viewCount: 45000000, videoCount: 320, shorts: 28, longForm: 22 },
    { id: 'UC_jp2', title: 'ガジェット速報', publishedAt: '2019-08-01T00:00:00Z', subscriberCount: 420000, viewCount: 22000000, videoCount: 180, shorts: 35, longForm: 15 },
    { id: 'UC_jp3', title: 'プログラミング道場', publishedAt: '2020-01-15T00:00:00Z', subscriberCount: 1200000, viewCount: 78000000, videoCount: 510, shorts: 10, longForm: 40 },
    { id: 'UC_jp4', title: 'AI解説チャンネル', publishedAt: '2021-03-22T00:00:00Z', subscriberCount: 320000, viewCount: 15000000, videoCount: 95, shorts: 42, longForm: 8 },
    { id: 'UC_jp5', title: 'スタートアップ実録', publishedAt: '2017-11-05T00:00:00Z', subscriberCount: 2100000, viewCount: 130000000, videoCount: 720, shorts: 18, longForm: 32 },
    { id: 'UC_jp6', title: 'デザインラボ', publishedAt: '2022-06-10T00:00:00Z', subscriberCount: 95000, viewCount: 3200000, videoCount: 42, shorts: 30, longForm: 20 },
    { id: 'UC_jp7', title: 'ビジネス思考塾', publishedAt: '2019-02-28T00:00:00Z', subscriberCount: 680000, viewCount: 38000000, videoCount: 260, shorts: 5, longForm: 45 },
    { id: 'UC_jp8', title: 'マーケティング研究所', publishedAt: '2020-09-14T00:00:00Z', subscriberCount: 155000, viewCount: 8900000, videoCount: 130, shorts: 22, longForm: 28 },
    { id: 'UC_jp9', title: 'エンジニアTV', publishedAt: '2018-07-20T00:00:00Z', subscriberCount: 390000, viewCount: 21000000, videoCount: 195, shorts: 15, longForm: 35 },
    { id: 'UC_jp10', title: '副業戦略チャンネル', publishedAt: '2021-12-01T00:00:00Z', subscriberCount: 74000, viewCount: 2800000, videoCount: 58, shorts: 38, longForm: 12 },
    { id: 'UC_jp11', title: 'クラウドエンジニアリング', publishedAt: '2020-04-05T00:00:00Z', subscriberCount: 210000, viewCount: 11000000, videoCount: 142, shorts: 8, longForm: 42 },
    { id: 'UC_jp12', title: '動画編集テクニック', publishedAt: '2022-01-18T00:00:00Z', subscriberCount: 88000, viewCount: 4100000, videoCount: 76, shorts: 33, longForm: 17 },
  ],
  KR: [
    { id: 'UC_kr1', title: '테크리뷰KR', publishedAt: '2018-06-20T00:00:00Z', subscriberCount: 1400000, viewCount: 92000000, videoCount: 430, shorts: 20, longForm: 30 },
    { id: 'UC_kr2', title: '스타트업 인사이더', publishedAt: '2019-11-10T00:00:00Z', subscriberCount: 560000, viewCount: 31000000, videoCount: 210, shorts: 25, longForm: 25 },
    { id: 'UC_kr3', title: '코딩마스터', publishedAt: '2020-03-05T00:00:00Z', subscriberCount: 890000, viewCount: 54000000, videoCount: 380, shorts: 12, longForm: 38 },
    { id: 'UC_kr4', title: 'AI트렌드', publishedAt: '2021-07-15T00:00:00Z', subscriberCount: 290000, viewCount: 13000000, videoCount: 88, shorts: 40, longForm: 10 },
    { id: 'UC_kr5', title: '마케팅랩', publishedAt: '2017-09-22T00:00:00Z', subscriberCount: 1800000, viewCount: 110000000, videoCount: 650, shorts: 15, longForm: 35 },
    { id: 'UC_kr6', title: '디자인 스튜디오', publishedAt: '2022-04-08T00:00:00Z', subscriberCount: 78000, viewCount: 2900000, videoCount: 35, shorts: 28, longForm: 22 },
    { id: 'UC_kr7', title: '비즈니스 클래스', publishedAt: '2019-05-14T00:00:00Z', subscriberCount: 720000, viewCount: 42000000, videoCount: 290, shorts: 6, longForm: 44 },
    { id: 'UC_kr8', title: '스마트 투자', publishedAt: '2020-10-30T00:00:00Z', subscriberCount: 180000, viewCount: 9500000, videoCount: 145, shorts: 20, longForm: 30 },
    { id: 'UC_kr9', title: '개발자 브이로그', publishedAt: '2018-12-08T00:00:00Z', subscriberCount: 420000, viewCount: 24000000, videoCount: 220, shorts: 16, longForm: 34 },
    { id: 'UC_kr10', title: '부업 마스터', publishedAt: '2022-02-14T00:00:00Z', subscriberCount: 65000, viewCount: 2400000, videoCount: 52, shorts: 36, longForm: 14 },
    { id: 'UC_kr11', title: '클라우드 강의', publishedAt: '2020-07-19T00:00:00Z', subscriberCount: 245000, viewCount: 13500000, videoCount: 168, shorts: 9, longForm: 41 },
    { id: 'UC_kr12', title: '영상편집 스쿨', publishedAt: '2021-09-25T00:00:00Z', subscriberCount: 102000, viewCount: 5200000, videoCount: 89, shorts: 31, longForm: 19 },
  ],
  US: [
    { id: 'UC_us1', title: 'TechVision US', publishedAt: '2017-03-15T00:00:00Z', subscriberCount: 3200000, viewCount: 210000000, videoCount: 890, shorts: 22, longForm: 28 },
    { id: 'UC_us2', title: 'StartupInsider', publishedAt: '2018-09-28T00:00:00Z', subscriberCount: 1100000, viewCount: 68000000, videoCount: 340, shorts: 18, longForm: 32 },
    { id: 'UC_us3', title: 'CodeMastery', publishedAt: '2019-05-12T00:00:00Z', subscriberCount: 2400000, viewCount: 150000000, videoCount: 620, shorts: 8, longForm: 42 },
    { id: 'UC_us4', title: 'AI Revolution', publishedAt: '2021-01-20T00:00:00Z', subscriberCount: 780000, viewCount: 42000000, videoCount: 155, shorts: 38, longForm: 12 },
    { id: 'UC_us5', title: 'MarketingPros', publishedAt: '2016-07-04T00:00:00Z', subscriberCount: 4500000, viewCount: 310000000, videoCount: 1100, shorts: 14, longForm: 36 },
    { id: 'UC_us6', title: 'DesignMinds', publishedAt: '2022-03-17T00:00:00Z', subscriberCount: 190000, viewCount: 8200000, videoCount: 68, shorts: 26, longForm: 24 },
    { id: 'UC_us7', title: 'BusinessStrategy', publishedAt: '2018-11-30T00:00:00Z', subscriberCount: 1600000, viewCount: 95000000, videoCount: 480, shorts: 4, longForm: 46 },
    { id: 'UC_us8', title: 'InvestSmart', publishedAt: '2020-06-22T00:00:00Z', subscriberCount: 410000, viewCount: 22000000, videoCount: 195, shorts: 19, longForm: 31 },
    { id: 'UC_us9', title: 'Dev Diaries', publishedAt: '2019-02-14T00:00:00Z', subscriberCount: 870000, viewCount: 51000000, videoCount: 310, shorts: 13, longForm: 37 },
    { id: 'UC_us10', title: 'Side Hustle Nation', publishedAt: '2021-08-05T00:00:00Z', subscriberCount: 145000, viewCount: 6800000, videoCount: 82, shorts: 34, longForm: 16 },
    { id: 'UC_us11', title: 'Cloud Architecture', publishedAt: '2020-02-10T00:00:00Z', subscriberCount: 520000, viewCount: 28000000, videoCount: 235, shorts: 7, longForm: 43 },
    { id: 'UC_us12', title: 'VideoEditPro', publishedAt: '2022-07-22T00:00:00Z', subscriberCount: 230000, viewCount: 11000000, videoCount: 98, shorts: 29, longForm: 21 },
  ],
};

// ベース12件から100件に水増し（シード乱数で差異をつける）
function generateChannels(region, base) {
  const NAMES = {
    JP: ['チャンネル','放送局','スタジオ','ラボ','ブログ','実験室','倶楽部','工房','研究室','道場'],
    KR: ['채널','스튜디오','클래스','랩','방송','연구소','아카데미','공방','클럽','도장'],
    US: ['Channel','Studio','Academy','Lab','Hub','Central','Media','Network','Zone','Pro'],
  };
  const extra = [];
  for (let i = base.length + 1; i <= 100; i++) {
    const seed = i * 7 + region.charCodeAt(0) * 13;
    const subs = Math.round((50000 + ((seed * 1664525 + 1013904223) & 0x7fffffff) % 3000000) / 1000) * 1000;
    const videos = 20 + (seed % 800);
    const year = 2016 + (seed % 8);
    const month = String(1 + (seed % 12)).padStart(2, '0');
    const day = String(1 + (seed % 28)).padStart(2, '0');
    const nameList = NAMES[region];
    const name = nameList[seed % nameList.length] + (i < 50 ? ` ${i}` : ` #${i}`);
    const lf = 5 + (seed % 46);
    const sh = 50 - lf;
    extra.push({
      id: `UC_${region.toLowerCase()}${i}`,
      title: name,
      publishedAt: `${year}-${month}-${day}T00:00:00Z`,
      subscriberCount: subs,
      viewCount: subs * (20 + (seed % 80)),
      videoCount: videos,
      shorts: sh,
      longForm: lf,
    });
  }
  return [...base, ...extra];
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function strToSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h;
}

function withMeta(channels, region) {
  return channels.map(ch => ({
    ...ch,
    url: ch.url || `https://www.youtube.com/channel/${ch.id}`,
    recentTotal: 50,
    avgViews: ch.videoCount > 0 ? Math.round(ch.viewCount / ch.videoCount) : 0,
    medianViews: ch.videoCount > 0 ? Math.round(ch.viewCount / ch.videoCount * 0.6) : 0,
  }));
}

const MOCK_CHANNELS = {
  JP: generateChannels('JP', BASE_CHANNELS.JP),
  KR: generateChannels('KR', BASE_CHANNELS.KR),
  US: generateChannels('US', BASE_CHANNELS.US),
};

export function getMockChannels(regionCode, page = 0, query = '') {
  const base = MOCK_CHANNELS[regionCode] || [];
  const seed = strToSeed(query + regionCode);
  const shuffled = query ? seededShuffle(base, seed) : base;
  return {
    channels: withMeta(shuffled, regionCode),
    nextPageToken: null,
  };
}
