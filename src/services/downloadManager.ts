import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types/movie';

export interface DownloadedMovie extends Movie {
  progress?: number;
  status: 'downloading' | 'completed' | 'error';
  localUri?: string;
}

const DOWNLOADS_STORAGE_KEY = '@downloads';
const DOWNLOAD_DIR = FileSystem.documentDirectory + 'downloads/';

export const initializeDownloadDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
  }
};

export const getDownloadedMovies = async (): Promise<DownloadedMovie[]> => {
  try {
    const downloadsJson = await AsyncStorage.getItem(DOWNLOADS_STORAGE_KEY);
    return downloadsJson ? JSON.parse(downloadsJson) : [];
  } catch (error) {
    console.error('Error loading downloads:', error);
    return [];
  }
};

export const saveDownloadedMovies = async (downloads: DownloadedMovie[]) => {
  try {
    await AsyncStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
  } catch (error) {
    console.error('Error saving downloads:', error);
  }
};

export const downloadMovie = async (
  movie: Movie,
  videoUrl: string,
  onProgress?: (progress: number) => void
): Promise<DownloadedMovie> => {
  const fileName = `movie_${movie.id}.mp4`;
  const fileUri = DOWNLOAD_DIR + fileName;

  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
        onProgress?.(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result) {
      throw new Error('Download failed');
    }

    const downloadedMovie: DownloadedMovie = {
      ...movie,
      status: 'completed',
      localUri: result.uri,
    };

    // Update stored downloads
    const downloads = await getDownloadedMovies();
    const updatedDownloads = [...downloads, downloadedMovie];
    await saveDownloadedMovies(updatedDownloads);

    return downloadedMovie;
  } catch (error) {
    console.error('Error downloading movie:', error);
    return {
      ...movie,
      status: 'error',
    };
  }
};

export const deleteDownload = async (movieId: number) => {
  try {
    const downloads = await getDownloadedMovies();
    const movieToDelete = downloads.find(d => d.id === movieId);

    if (movieToDelete?.localUri) {
      await FileSystem.deleteAsync(movieToDelete.localUri);
    }

    const updatedDownloads = downloads.filter(d => d.id !== movieId);
    await saveDownloadedMovies(updatedDownloads);
  } catch (error) {
    console.error('Error deleting download:', error);
    throw error;
  }
}; 