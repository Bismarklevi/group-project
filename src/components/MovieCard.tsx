import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Movie } from '../types/movie';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface MovieCardProps {
  movie: Movie;
  style?: object;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, style }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={() => navigation.navigate('MovieDetails', { movieId: movie.id })}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {movie.title}
        </Text>
        <Text style={styles.rating}>
          ★ {movie.vote_average.toFixed(1)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rating: {
    color: '#ffd700',
    fontSize: 12,
    marginTop: 4,
  },
});

export default MovieCard; 