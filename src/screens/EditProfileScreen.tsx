import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';
import { addProfile, updateProfile, deleteProfile, getProfile, type Profile } from '../services/profiles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const PROFILE_COLORS = [
  '#E50914', // Netflix Red
  '#1DB954', // Spotify Green
  '#00B4E4', // Twitter Blue
  '#FF9900', // Amazon Orange
  '#7B2BFF', // Purple
  '#FF69B4', // Pink
];

const EditProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isNewProfile, profileId } = route.params;
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROFILE_COLORS[0]);
  const [isKids, setIsKids] = useState(false);
  const [loading, setLoading] = useState(!isNewProfile);

  useEffect(() => {
    if (!isNewProfile && profileId) {
      loadProfile();
    }
  }, [isNewProfile, profileId]);

  const loadProfile = async () => {
    try {
      const profile = await getProfile(profileId!);
      if (profile) {
        setName(profile.name);
        setSelectedColor(profile.color);
        setIsKids(profile.isKids);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a profile name');
      return;
    }

    try {
      const profileData: Omit<Profile, 'id'> = {
        name: name.trim(),
        color: selectedColor,
        isKids,
      };

      if (isNewProfile) {
        await addProfile(profileData);
      } else if (profileId) {
        await updateProfile({ ...profileData, id: profileId });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleDelete = async () => {
    if (!profileId) return;

    try {
      await deleteProfile(profileId);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete profile');
    }
  };

  const handleEditAvatar = () => {
    // TODO: Implement avatar selection
    Alert.alert('Coming Soon', 'Avatar selection will be available soon!');
  };

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isNewProfile ? 'Create Profile' : 'Edit Profile'}
        </Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <Image
            source={PLACEHOLDER_IMAGES.AVATAR}
            style={[styles.avatar, { borderColor: selectedColor }]}
          />
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={handleEditAvatar}
          >
            <Ionicons name="camera" size={24} color={COLORS.TEXT.PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter profile name"
              placeholderTextColor={COLORS.TEXT.SECONDARY}
              maxLength={20}
            />
          </View>

          <View style={styles.colorSection}>
            <Text style={styles.label}>Profile Color</Text>
            <View style={styles.colorGrid}>
              {PROFILE_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.kidsSection}>
            <Text style={styles.label}>Kids Profile</Text>
            <TouchableOpacity
              style={styles.kidsToggle}
              onPress={() => setIsKids(!isKids)}
            >
              <View
                style={[
                  styles.toggleTrack,
                  isKids && { backgroundColor: COLORS.PRIMARY },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    isKids && { transform: [{ translateX: 20 }] },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {!isNewProfile && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Delete Profile',
                'Are you sure you want to delete this profile?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: handleDelete,
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>Delete Profile</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 24,
    right: '50%',
    marginRight: -60,
    backgroundColor: COLORS.SURFACE,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 16,
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    padding: 12,
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
  },
  colorSection: {
    gap: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: COLORS.TEXT.PRIMARY,
  },
  kidsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kidsToggle: {
    padding: 4,
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SURFACE,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.TEXT.PRIMARY,
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.ERROR,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 