import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import { getImageUrl } from '../services/api';
import {
  type DownloadedMovie,
  getDownloadedMovies,
  deleteDownload,
  initializeDownloadDirectory,
} from '../services/downloadManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Downloads'>;

const DownloadManagerScreen: React.FC<Props> = ({ navigation }) => {
  const [downloads, setDownloads] = useState<DownloadedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDownloadedMovies();
  }, []);

  const loadDownloadedMovies = async () => {
    try {
      await initializeDownloadDirectory();
      const downloadedMovies = await getDownloadedMovies();
      setDownloads(downloadedMovies);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDownload = async (movie: DownloadedMovie) => {
    try {
      await deleteDownload(movie.id);
      setDownloads(prev => prev.filter(d => d.id !== movie.id));
    } catch (error) {
      console.error('Error deleting download:', error);
      Alert.alert('Error', 'Failed to delete download');
    }
  };

  const handlePlayDownload = (movie: DownloadedMovie) => {
    if (movie.localUri) {
      navigation.navigate('VideoPlayer', {
        videoId: movie.id.toString(),
        title: movie.title,
        localUri: movie.localUri,
      });
    }
  };

  const renderDownloadItem = ({ item }: { item: DownloadedMovie }) => (
    <View style={styles.downloadItem}>
      <Image
        source={{ uri: getImageUrl(item.poster_path) || undefined }}
        style={styles.thumbnail}
      />
      <View style={styles.downloadInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.status}>
          {item.status === 'downloading'
            ? `Downloading ${Math.round(item.progress || 0)}%`
            : item.status}
        </Text>
      </View>
      <View style={styles.actions}>
        {item.status === 'completed' ? (
          <TouchableOpacity
            onPress={() => handlePlayDownload(item)}
            style={styles.actionButton}
          >
            <Ionicons name="play-circle" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete Download',
              'Are you sure you want to delete this download?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => handleDeleteDownload(item),
                },
              ]
            );
          }}
          style={styles.actionButton}
        >
          <Ionicons name="trash" size={24} color={COLORS.STATUS.ERROR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
      </View>

      {downloads.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="download" size={48} color={COLORS.TEXT.SECONDARY} />
          <Text style={styles.emptyText}>No downloads yet</Text>
          <Text style={styles.emptySubtext}>
            Downloaded movies will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          renderItem={renderDownloadItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DARK,
  },
  headerTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  listContent: {
    padding: 16,
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE.DARK,
    marginBottom: 12,
  },
  thumbnail: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  downloadInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  status: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DownloadManagerScreen; 