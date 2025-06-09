import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

const SearchItem: React.FC<Props> = ({ title, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.thumbnail}
        defaultSource={require('../assets/placeholder.png')}
      />
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.playButton}>
        <Ionicons name="play-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#222',
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 150,
    height: 85,
    resizeMode: 'cover',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
  playButton: {
    paddingHorizontal: 16,
  },
});

export default SearchItem; 