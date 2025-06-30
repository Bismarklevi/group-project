import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileSelection'>;

const PROFILES = [
  { id: '1', name: 'Profile 1', avatar: PLACEHOLDER_IMAGES.AVATAR, color: '#E50914' },
  { id: '2', name: 'Profile 2', avatar: PLACEHOLDER_IMAGES.AVATAR, color: '#1DB954' },
  { id: '3', name: 'Profile 3', avatar: PLACEHOLDER_IMAGES.AVATAR, color: '#00B4E4' },
  { id: '4', name: 'Profile 4', avatar: PLACEHOLDER_IMAGES.AVATAR, color: '#FF9900' },
];

const ProfileSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const handleProfileSelect = (profileId: string) => {
    // TODO: Store selected profile in context/state
    navigation.replace('MainTabs', { screen: 'HomeTab' });
  };

  const handleManageProfiles = () => {
    navigation.navigate('EditProfile', { isNewProfile: false, profileId: '1' });
  };

  const handleAddProfile = () => {
    navigation.navigate('EditProfile', { isNewProfile: true, profileId: undefined });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Who's Watching?</Text>
      <View style={styles.profilesContainer}>
        {PROFILES.map(profile => (
          <TouchableOpacity
            key={profile.id}
            style={styles.profileItem}
            onPress={() => handleProfileSelect(profile.id)}
          >
            <Image
              source={profile.avatar}
              style={[styles.profileImage, { borderColor: profile.color }]}
            />
            <Text style={styles.profileName}>{profile.name}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addProfileButton}
          onPress={handleAddProfile}
        >
          <View style={styles.addProfileIcon}>
            <Text style={styles.addProfileIconText}>+</Text>
          </View>
          <Text style={styles.profileName}>Add Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.manageButton}
        onPress={handleManageProfiles}
      >
        <Text style={styles.manageButtonText}>Manage Profiles</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  profilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  profileItem: {
    alignItems: 'center',
    width: 100,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 4,
  },
  profileName: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
  },
  addProfileButton: {
    alignItems: 'center',
    width: 100,
  },
  addProfileIcon: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.SURFACE.DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addProfileIconText: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 40,
  },
  manageButton: {
    borderWidth: 1,
    borderColor: COLORS.TEXT.SECONDARY,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
  },
  manageButtonText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 16,
  },
});

export default ProfileSelectionScreen; 