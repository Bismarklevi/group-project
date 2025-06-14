import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';
import {
  getUpcomingMovies,
  getNowPlayingMovies,
  getImageUrl,
} from '../services/api';
import type { Movie } from '../types/movie';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'NewTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const CARD_IMAGE_HEIGHT = width * 0.4;

const NewScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const [upcoming, nowPlaying] = await Promise.all([
        getUpcomingMovies(),
        getNowPlayingMovies(),
      ]);
      setUpcomingMovies(upcoming);
      setNowPlayingMovies(nowPlaying);
    } catch (error) {
      console.error('Error loading new movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContentCard = (movie: Movie, isNewArrival: boolean = false) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.card}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
    >
      <Image
        source={
          movie.backdrop_path
            ? { uri: getImageUrl(movie.backdrop_path) || '' }
            : PLACEHOLDER_IMAGES.BACKDROP
        }
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>{movie.title}</Text>
      <Text style={styles.releaseDate}>
        {new Date(movie.release_date).toLocaleDateString()}
      </Text>
          </View>
          {isNewArrival && (
            <View style={styles.newArrivalBadge}>
              <Text style={styles.newArrivalText}>New Arrival</Text>
            </View>
          )}
        </View>
        <Text style={styles.overview} numberOfLines={2}>
          {movie.overview}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.genreTags}>
            <View style={styles.genreTag}>
              <Text style={styles.genreText}>Drama</Text>
            </View>
            <View style={styles.genreTag}>
              <Text style={styles.genreText}>Suspense</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.TEXT.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={24} color={COLORS.TEXT.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* New Arrivals */}
        <View style={styles.section}>
          {nowPlayingMovies.map(movie => renderContentCard(movie, true))}
        </View>

        {/* Coming Soon */}
        <View style={styles.section}>
          {upcomingMovies.map(movie => renderContentCard(movie))}
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.DEFAULT,
  },
  headerTitle: {
    ...TYPOGRAPHY.STYLES.H1,
    color: COLORS.TEXT.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: COLORS.SURFACE.DEFAULT,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    ...TYPOGRAPHY.STYLES.H3,
    color: COLORS.TEXT.PRIMARY,
    marginBottom: 4,
  },
  releaseDate: {
    ...TYPOGRAPHY.STYLES.BODY_SMALL,
    color: COLORS.TEXT.SECONDARY,
  },
  newArrivalBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  newArrivalText: {
    ...TYPOGRAPHY.STYLES.LABEL,
    color: COLORS.TEXT.PRIMARY,
  },
  overview: {
    ...TYPOGRAPHY.STYLES.BODY,
    color: COLORS.TEXT.SECONDARY,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreTags: {
    flexDirection: 'row',
    gap: 8,
  },
  genreTag: {
    backgroundColor: COLORS.SURFACE.LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  genreText: {
    ...TYPOGRAPHY.STYLES.LABEL,
    color: COLORS.TEXT.PRIMARY,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
});

export default NewScreen; 