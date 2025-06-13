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
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';
import {
  getUpcomingMovies,
  getNowPlayingMovies,
  getImageUrl,
  type Movie,
} from '../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'NewTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.33;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

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

  const renderMovie = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
    >
      <Image
        source={
          movie.poster_path
            ? { uri: getImageUrl(movie.poster_path) || '' }
            : PLACEHOLDER_IMAGES.POSTER
        }
        style={styles.posterImage}
      />
      <Text style={styles.movieTitle} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.releaseDate}>
        {new Date(movie.release_date).toLocaleDateString()}
      </Text>
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
      <ScrollView style={styles.scrollView}>
        {/* Now Playing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Now Playing</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moviesRow}>
              {nowPlayingMovies.map(renderMovie)}
            </View>
          </ScrollView>
        </View>

        {/* Coming Soon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.moviesRow}>
              {upcomingMovies.map(renderMovie)}
            </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  moviesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  movieItem: {
    width: POSTER_WIDTH,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 4,
    marginBottom: 8,
  },
  movieTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
    marginBottom: 4,
  },
  releaseDate: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 12,
  },
});

export default NewScreen; 