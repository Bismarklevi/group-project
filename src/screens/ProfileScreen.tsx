import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import { PLACEHOLDER_IMAGES } from '../assets/placeholder';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'ProfileTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SETTINGS_OPTIONS = [
  { id: 'notifications', icon: 'notifications', label: 'Notifications' },
  { id: 'downloads', icon: 'download', label: 'Downloads' },
  { id: 'security', icon: 'shield', label: 'Security' },
  { id: 'help', icon: 'help-circle', label: 'Help' },
  { id: 'about', icon: 'information-circle', label: 'About' },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { isNewProfile: false, profileId: '1' });
  };

  const handleSettingPress = (settingId: string) => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <TouchableOpacity
          style={styles.profileSection}
          onPress={handleEditProfile}
        >
          <Image source={PLACEHOLDER_IMAGES.AVATAR} style={styles.profileImage} />
          <Text style={styles.profileName}>Profile 1</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT.SECONDARY} />
        </TouchableOpacity>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {SETTINGS_OPTIONS.map(option => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.settingItem}
              onPress={() => handleSettingPress(option.id)}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={option.icon as any} size={24} color={COLORS.TEXT.PRIMARY} />
              </View>
              <Text style={styles.settingLabel}>{option.label}</Text>
              <Ionicons name="chevron-forward" size={24} color={COLORS.TEXT.SECONDARY} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={COLORS.STATUS.ERROR} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DEFAULT,
  },
  title: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DEFAULT,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileName: {
    flex: 1,
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DEFAULT,
  },
  settingIcon: {
    width: 40,
  },
  settingLabel: {
    flex: 1,
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE.DEFAULT
  },
  logoutText: {
    color: COLORS.STATUS.ERROR,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionInfo: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
  },
});

export default ProfileScreen; 