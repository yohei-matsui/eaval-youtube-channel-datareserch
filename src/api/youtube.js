const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function apiFetch(path, params, apiKey) {
  params.set('key', apiKey);
  const res = await fetch(`${BASE_URL}${path}?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error?.message || res.statusText;
    throw new Error(`YouTube API エラー (${res.status}): ${msg}`);
  }
  return res.json();
}

const REGION_LANG = { JP: 'ja', KR: 'ko', US: 'en' };

export async function searchChannels(query, regionCode, apiKey, pageToken = null) {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'channel',
    q: query,
    regionCode,
    relevanceLanguage: REGION_LANG[regionCode] || 'en',
    maxResults: 50,
  });
  if (pageToken) params.set('pageToken', pageToken);

  const data = await apiFetch('/search', params, apiKey);
  const channelIds = data.items.map(item => item.snippet.channelId);
  return { channelIds, nextPageToken: data.nextPageToken || null };
}

export async function fetchChannelDetails(channelIds, apiKey) {
  const params = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: channelIds.join(','),
  });
  const data = await apiFetch('/channels', params, apiKey);
  return data.items;
}

export async function fetchVideoStats(uploadsPlaylistId, apiKey) {
  const params = new URLSearchParams({
    part: 'contentDetails',
    playlistId: uploadsPlaylistId,
    maxResults: 100,
  });

  const data = await apiFetch('/playlistItems', params, apiKey).catch(() => null);
  if (!data?.items?.length) return { shorts: 0, long: 0, total: 0 };

  const videoIds = data.items.map(item => item.contentDetails.videoId);

  const videoParams = new URLSearchParams({ part: 'contentDetails,statistics', id: videoIds.join(',') });
  const videoData = await apiFetch('/videos', videoParams, apiKey).catch(() => null);
  if (!videoData?.items?.length) return { shorts: 0, long: 0, total: 0, avgViews: 0, medianViews: 0 };

  let shorts = 0;
  let long = 0;
  const longViewCounts = [];

  for (const video of videoData.items) {
    const seconds = parseDuration(video.contentDetails.duration);
    const views = parseInt(video.statistics?.viewCount || '0');
    if (seconds <= 180) {
      shorts++;
    } else {
      long++;
      longViewCounts.push(views);
    }
  }

  const avgViews = longViewCounts.length
    ? Math.round(longViewCounts.reduce((a, b) => a + b, 0) / longViewCounts.length)
    : 0;

  const sorted = [...longViewCounts].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const medianViews = sorted.length
    ? sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : 0;

  return { shorts, long, total: videoData.items.length, avgViews, medianViews };
}

function parseDuration(iso) {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] || '0') * 3600) + (parseInt(match[2] || '0') * 60) + parseInt(match[3] || '0');
}

async function fetchChannelsBatch(channelIds, apiKey) {
  if (channelIds.length === 0) return [];
  const items = await fetchChannelDetails(channelIds, apiKey);
  return Promise.all(
    items.map(async item => {
      const uploadsId = item.contentDetails?.relatedPlaylists?.uploads;
      const stats = uploadsId
        ? await fetchVideoStats(uploadsId, apiKey)
        : { shorts: 0, long: 0, total: 0, avgViews: 0, medianViews: 0 };
      return {
        id: item.id,
        title: item.snippet.title,
        url: `https://www.youtube.com/channel/${item.id}`,
        publishedAt: item.snippet.publishedAt,
        subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
        viewCount: parseInt(item.statistics.viewCount || '0'),
        videoCount: parseInt(item.statistics.videoCount || '0'),
        shorts: stats.shorts,
        longForm: stats.long,
        recentTotal: stats.total,
        avgViews: stats.avgViews,
        medianViews: stats.medianViews,
      };
    })
  );
}

export async function loadChannels(query, regionCode, apiKey) {
  // 1ページ目（50件）
  const page1 = await searchChannels(query, regionCode, apiKey);
  if (page1.channelIds.length === 0) return { channels: [], nextPageToken: null };

  // 2ページ目（50件）をページ1と並列取得
  const page2Promise = page1.nextPageToken
    ? searchChannels(query, regionCode, apiKey, page1.nextPageToken)
    : Promise.resolve({ channelIds: [], nextPageToken: null });

  const [batch1, page2] = await Promise.all([
    fetchChannelsBatch(page1.channelIds, apiKey),
    page2Promise,
  ]);

  const batch2 = await fetchChannelsBatch(page2.channelIds, apiKey);

  const channels = [...batch1, ...batch2];
  channels.sort((a, b) => b.subscriberCount - a.subscriberCount);

  return { channels, nextPageToken: null };
}
