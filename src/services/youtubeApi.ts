import axios from 'axios';
import Constants from 'expo-constants';

const YOUTUBE_API_KEY = Constants.expoConfig?.extra?.youtubeApiKey || 'AIzaSyCfXam8G2C_6DEszFyXzQqF19gqvFUQT-M';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const youtubeApi = axios.create({
  baseURL: YOUTUBE_BASE_URL,
  params: {
    key: YOUTUBE_API_KEY,
    part: 'snippet,statistics,contentDetails',
  },
  timeout: 10000, // 10 seconds timeout
});

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
}

export interface YouTubeSearchResult {
  items: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export const searchYouTubeVideos = async (
  query: string,
  maxResults: number = 10,
  pageToken?: string
): Promise<YouTubeSearchResult> => {
  try {
    const response = await youtubeApi.get('/search', {
      params: {
        q: query,
        maxResults,
        pageToken,
        type: 'video',
        videoEmbeddable: true,
        part: 'snippet',
      },
    });

    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');
    
    // Get detailed video information
    const detailsResponse = await youtubeApi.get('/videos', {
      params: {
        id: videoIds,
        part: 'snippet,statistics,contentDetails',
      },
    });

    const videos: YouTubeVideo[] = detailsResponse.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }));

    return {
      items: videos,
      nextPageToken: response.data.nextPageToken,
      totalResults: response.data.pageInfo.totalResults,
    };
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw error;
  }
};

export const getVideoDetails = async (videoId: string): Promise<YouTubeVideo> => {
  try {
    const response = await youtubeApi.get('/videos', {
      params: {
        id: videoId,
        part: 'snippet,statistics,contentDetails',
      },
    });

    const item = response.data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export const getRelatedVideos = async (
  videoId: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> => {
  try {
    const response = await youtubeApi.get('/search', {
      params: {
        relatedToVideoId: videoId,
        maxResults,
        type: 'video',
        videoEmbeddable: true,
        part: 'snippet',
      },
    });

    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');
    
    const detailsResponse = await youtubeApi.get('/videos', {
      params: {
        id: videoIds,
        part: 'snippet,statistics,contentDetails',
      },
    });

    return detailsResponse.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: item.statistics.viewCount,
      likeCount: item.statistics.likeCount,
    }));
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return [];
  }
};

export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.padStart(2, '0')}`;
};

export const formatViewCount = (viewCount: string): string => {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`;
  }
  return `${count} views`;
}; 