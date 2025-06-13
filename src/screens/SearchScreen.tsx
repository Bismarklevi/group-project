import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';
import {
  searchMovies,
  getImageUrl,
  type Movie,
} from '../services/api';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'SearchTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.33;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const searchResults = await searchMovies(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item: movie }: { item: Movie }) => (
    <TouchableOpacity
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={COLORS.TEXT.SECONDARY}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setQuery('')}
            >
              <Ionicons name="close" size={20} color={COLORS.TEXT.SECONDARY} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderMovie}
          keyExtractor={movie => movie.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color={COLORS.TEXT.SECONDARY} />
          <Text style={styles.emptyText}>
            {query.trim()
              ? 'No results found'
              : 'Search for your favorite movies'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    paddingRight: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  searchButton: {
    backgroundColor: COLORS.SURFACE,
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 12,
  },
  movieItem: {
    flex: 1,
    margin: 4,
    maxWidth: `${100 / 3}%`,
  },
  posterImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  movieTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SearchScreen; 