import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { MovieDetails, Credits, Video, Movie, Cast, Crew } from '../types/movie';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getRecommendedMovies,
  getImageUrl,
} from '../services/api';
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetails'>;

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.33;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;
const CAST_IMAGE_SIZE = width * 0.2;

const imageStyle: ImageStyle = {
  overflow: 'hidden',
};

const MovieDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    loadMovieData();
  }, [movieId]);

  const loadMovieData = async () => {
    try {
      setLoading(true);
      const [movieDetails, movieCredits, movieVideos, similar, recommended] = await Promise.all([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
        getMovieVideos(movieId),
        getSimilarMovies(movieId),
        getRecommendedMovies(movieId),
      ]);

      setDetails(movieDetails);
      setCredits(movieCredits);
      setVideos(movieVideos);
      setSimilarMovies(similar);
      setRecommendedMovies(recommended);
    } catch (error) {
      console.error('Error loading movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePlayTrailer = async () => {
    const trailer = videos.find(video => video.type === 'Trailer') || videos[0];
    if (trailer && details) {
      navigation.navigate('VideoPlayer', {
        videoId: trailer.key,
        title: details.title
      });
    }
  };

  const renderCastMember = (cast: Cast) => (
    <View key={cast.id} style={styles.castMember}>
      <Image
        source={
          cast.profile_path
            ? { uri: getImageUrl(cast.profile_path) || undefined }
            : PLACEHOLDER_IMAGES.PREVIEW
        }
        style={{
          width: CAST_IMAGE_SIZE,
          height: CAST_IMAGE_SIZE,
          borderRadius: CAST_IMAGE_SIZE / 2,
          marginBottom: 8,
          resizeMode: 'cover',
        } satisfies ImageStyle}
      />
      <Text style={styles.castName} numberOfLines={1}>{cast.name}</Text>
      <Text style={styles.castCharacter} numberOfLines={1}>{cast.character}</Text>
    </View>
  );

  const renderMovie = (movie: Movie) => (
    <TouchableOpacity
      key={movie.id}
      style={styles.movieItem}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
    >
      <Image
        source={
          movie.poster_path
            ? { uri: getImageUrl(movie.poster_path) || undefined }
            : PLACEHOLDER_IMAGES.POSTER
        }
        style={{
          width: POSTER_WIDTH,
          height: POSTER_HEIGHT,
          borderRadius: 8,
          resizeMode: 'cover',
        } satisfies ImageStyle}
      />
    </TouchableOpacity>
  );

  if (loading || !details || !credits) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  const director = credits.crew.find((person: Crew) => person.job === 'Director');

  const genreTagStyle = {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.SURFACE.DEFAULT,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <Image
            source={
              details.backdrop_path
                ? { uri: getImageUrl(details.backdrop_path, 'original') || undefined }
                : PLACEHOLDER_IMAGES.BACKDROP
            }
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{details.title}</Text>
          {details.tagline && (
            <Text style={styles.tagline}>{details.tagline}</Text>
          )}

          <View style={styles.metadata}>
            <Text style={styles.metadataText}>
              {new Date(details.release_date).getFullYear()}
            </Text>
            <Text style={styles.metadataDot}>•</Text>
            <Text style={styles.metadataText}>
              {formatRuntime(details.runtime)}
            </Text>
            <Text style={styles.metadataDot}>•</Text>
            <Text style={styles.metadataText}>
              {details.vote_average.toFixed(1)} ★
            </Text>
          </View>

          {/* Genres */}
          <View style={styles.genresContainer}>
            {details.genres.map((genre: { id: number; name: string }) => (
              <View key={genre.id} style={genreTagStyle}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {videos.length > 0 && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayTrailer}
              >
                <Ionicons name="play" size={24} color={COLORS.BACKGROUND} />
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.myListButton}>
              <Ionicons name="add" size={24} color={COLORS.TEXT.PRIMARY} />
              <Text style={styles.myListText}>My List</Text>
            </TouchableOpacity>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{details.overview}</Text>
          </View>

          {/* Director */}
          {director && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Director</Text>
              <Text style={styles.directorName}>{director.name}</Text>
            </View>
          )}

          {/* Cast */}
          {credits.cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <View style={styles.castList}>
                {credits.cast.map((cast: Cast) => (
                  <View key={cast.id} style={styles.castMember}>
                    <Image
                      source={
                        cast.profile_path
                          ? { uri: getImageUrl(cast.profile_path) || undefined }
                          : PLACEHOLDER_IMAGES.PREVIEW
                      }
                      style={{
                        width: CAST_IMAGE_SIZE,
                        height: CAST_IMAGE_SIZE,
                        borderRadius: CAST_IMAGE_SIZE / 2,
                        marginBottom: 8,
                        resizeMode: 'cover',
                      } satisfies ImageStyle}
                    />
                    <Text style={styles.castName} numberOfLines={1}>{cast.name}</Text>
                    <Text style={styles.castCharacter} numberOfLines={1}>{cast.character}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{details.status}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Original Language</Text>
                <Text style={styles.infoValue}>
                  {details.spoken_languages[0]?.english_name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>
                  {details.budget > 0 ? formatMoney(details.budget) : 'N/A'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Revenue</Text>
                <Text style={styles.infoValue}>
                  {details.revenue > 0 ? formatMoney(details.revenue) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Movies</Text>
              <View style={styles.movieList}>
                {similarMovies.map((movie: Movie) => (
                  <TouchableOpacity
                    key={movie.id}
                    style={styles.movieItem}
                    onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
                  >
                    <Image
                      source={
                        movie.poster_path
                          ? { uri: getImageUrl(movie.poster_path) || undefined }
                          : PLACEHOLDER_IMAGES.POSTER
                      }
                      style={{
                        width: POSTER_WIDTH,
                        height: POSTER_HEIGHT,
                        borderRadius: 8,
                        resizeMode: 'cover',
                      } satisfies ImageStyle}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Recommended Movies */}
          {recommendedMovies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              <View style={styles.movieList}>
                {recommendedMovies.map((movie: Movie) => (
                  <TouchableOpacity
                    key={movie.id}
                    style={styles.movieItem}
                    onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
                  >
                    <Image
                      source={
                        movie.poster_path
                          ? { uri: getImageUrl(movie.poster_path) || undefined }
                          : PLACEHOLDER_IMAGES.POSTER
                      }
                      style={{
                        width: POSTER_WIDTH,
                        height: POSTER_HEIGHT,
                        borderRadius: 8,
                        resizeMode: 'cover',
                      } satisfies ImageStyle}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  backdropContainer: {
    height: width * 0.6,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.OVERLAY.DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metadataText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
  },
  metadataDot: {
    color: COLORS.TEXT.SECONDARY,
    marginHorizontal: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  genreText: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.TEXT.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    gap: 8,
  },
  playText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: 'bold',
  },
  myListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    gap: 8,
  },
  myListText: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overview: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  directorName: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
  },
  castList: {
    flexDirection: 'row',
    gap: 16,
  },
  castMember: {
    marginRight: 16,
    alignItems: 'center',
    width: CAST_IMAGE_SIZE,
  },
  castImage: {
    width: CAST_IMAGE_SIZE,
    height: CAST_IMAGE_SIZE,
    borderRadius: CAST_IMAGE_SIZE / 2,
    marginBottom: 8,
    resizeMode: 'cover',
    overflow: 'hidden',
  } as const,
  castName: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  castCharacter: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 12,
    textAlign: 'center',
  },
  additionalInfo: {
    backgroundColor: COLORS.SURFACE.DEFAULT,
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    flex: 1,
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
  },
  infoValue: {
    flex: 2,
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
  },
  movieList: {
    flexDirection: 'row',
    gap: 12,
  },
  movieItem: {
    marginRight: 12,
  },
  posterImage: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 8,
    resizeMode: 'cover',
    overflow: 'hidden',
  } as const,
});

export default MovieDetailsScreen; 