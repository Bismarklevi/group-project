import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelect'>;

interface Profile {
  id: string;
  name: string;
  color: string;
  isKids?: boolean;
}

const profiles: Profile[] = [
  { id: '1', name: 'Emenalo', color: '#0089FF' },
  { id: '2', name: 'Onyeka', color: '#FFB800' },
  { id: '3', name: 'Thelma', color: '#E50914' },
  { id: '4', name: 'Kids', color: '#7B2FFF', isKids: true },
];

const ProfileSelectScreen: React.FC<Props> = ({ navigation }) => {
  const handleProfileSelect = (profile: Profile) => {
    navigation.replace('MainTabs');
  };

  const renderProfile = (profile: Profile) => (
    <TouchableOpacity
      key={profile.id}
      style={styles.profileContainer}
      onPress={() => handleProfileSelect(profile)}
    >
      {profile.isKids ? (
        <View style={[styles.profileAvatar, { backgroundColor: profile.color }]}>
          <Text style={styles.kidsText}>kids</Text>
        </View>
      ) : (
        <View style={[styles.profileAvatar, { backgroundColor: profile.color }]}>
          <Text style={styles.avatarSmile}>:)</Text>
        </View>
      )}
      <Text style={styles.profileName}>{profile.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>STREAMIO</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Who's watching?</Text>

      <View style={styles.profilesGrid}>
        {profiles.map(profile => renderProfile(profile))}
      </View>

      <TouchableOpacity style={styles.addProfileButton}>
        <Ionicons name="add-circle-outline" size={32} color="white" />
        <Text style={styles.addProfileText}>Add Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');
const avatarSize = width * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    color: '#E50914',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  profileContainer: {
    alignItems: 'center',
    width: 100,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarSmile: {
    color: '#fff',
    fontSize: 32,
  },
  kidsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    fontSize: 14,
  },
  addProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  addProfileText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileSelectScreen; 