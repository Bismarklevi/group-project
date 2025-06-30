import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import {
  getMoviesByCategory,
  getImageUrl,
} from '../services/api';
import { Movie } from '@/types/movie';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';
import { CONTENT_SECTIONS, COLORS } from '../services/constants';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const FEATURED_HEIGHT = width;
const POSTER_WIDTH = width * 0.33;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

const CATEGORIES = [
  { id: 'trending', title: 'Trending Now' },
  { id: 'popular', title: 'Popular on Streamio' },
  { id: 'topRated', title: 'Top Rated' },
  { id: 'action', title: 'Action Movies' },
  { id: 'comedy', title: 'Comedy Movies' },
  { id: 'drama', title: 'Drama Movies' },
  { id: 'horror', title: 'Horror Movies' },
  { id: 'animation', title: 'Animation Movies' },
  { id: 'scifi', title: 'Sci-Fi Movies' },
  { id: 'documentary', title: 'Documentaries' },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Record<string, Movie[]>>({});
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SearchTab')}
          style={styles.headerButton}
        >
          <Ionicons name="search" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const moviesByCategory: Record<string, Movie[]> = {};
      
      // Load movies for each category in parallel
      await Promise.all(
        CATEGORIES.map(async category => {
          const results = await getMoviesByCategory(category.id);
          moviesByCategory[category.id] = results;
          
          // Set the first trending movie as featured
          if (category.id === 'trending' && results.length > 0) {
            setFeaturedMovie(results[0]);
          }
        })
      );

      setMovies(moviesByCategory);
    } catch (error) {
      console.error('Error loading movies:', error);
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
        {/* Featured Movie */}
        {featuredMovie && (
          <TouchableOpacity
            style={styles.featuredContainer}
            onPress={() =>
              navigation.navigate('MovieDetails', { movieId: featuredMovie.id })
            }
          >
            <Image
              source={
                featuredMovie.backdrop_path
                  ? { uri: getImageUrl(featuredMovie.backdrop_path, 'original') || '' }
                  : PLACEHOLDER_IMAGES.BACKDROP
              }
              style={styles.featuredImage}
            />
            <View style={styles.featuredGradient}>
              <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Movie Categories */}
        {CATEGORIES.map(category => {
          const categoryMovies = movies[category.id] || [];
          if (categoryMovies.length === 0) return null;

          return (
            <View key={category.id} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moviesRow}>
                  {categoryMovies.map(renderMovie)}
                </View>
              </ScrollView>
            </View>
          );
        })}
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
  featuredContainer: {
    height: FEATURED_HEIGHT,
    width: '100%',
    marginBottom: 24,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: FEATURED_HEIGHT / 2,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  featuredTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
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
  },
  headerButton: {
    marginRight: 16,
    padding: 4,
  },
});

export default HomeScreen; 