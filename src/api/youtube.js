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

export async function searchChannels(query, regionCode, apiKey, pageToken = null) {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'channel',
    q: query,
    regionCode,
    maxResults: 10,
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

  const videoParams = new URLSearchParams({ part: 'contentDetails', id: videoIds.join(',') });
  const videoData = await apiFetch('/videos', videoParams, apiKey).catch(() => null);
  if (!videoData?.items?.length) return { shorts: 0, long: 0, total: 0 };

  let shorts = 0;
  let long = 0;
  for (const video of videoData.items) {
    const seconds = parseDuration(video.contentDetails.duration);
    if (seconds <= 180) shorts++;
    else long++;
  }

  return { shorts, long, total: videoData.items.length };
}

function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] || '0') * 3600) + (parseInt(match[2] || '0') * 60) + parseInt(match[3] || '0');
}

export async function loadChannels(query, regionCode, apiKey, pageToken = null) {
  const { channelIds, nextPageToken } = await searchChannels(query, regionCode, apiKey, pageToken);
  if (channelIds.length === 0) return { channels: [], nextPageToken: null };

  const items = await fetchChannelDetails(channelIds, apiKey);

  const channels = await Promise.all(
    items.map(async item => {
      const uploadsId = item.contentDetails?.relatedPlaylists?.uploads;
      const stats = uploadsId ? await fetchVideoStats(uploadsId, apiKey) : { shorts: 0, long: 0, total: 0 };
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
      };
    })
  );

  return { channels, nextPageToken };
}
