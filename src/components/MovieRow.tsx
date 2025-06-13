import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  showViewAll?: boolean;
  category?: string;
}

const MovieRow: React.FC<MovieRowProps> = ({ 
  title, 
  movies, 
  showViewAll = true,
  category 
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleViewAll = () => {
    if (category) {
      navigation.navigate('ViewAll', { category, title });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showViewAll && category && (
          <Pressable onPress={handleViewAll}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default MovieRow; 