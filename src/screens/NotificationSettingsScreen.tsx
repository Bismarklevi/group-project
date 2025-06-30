import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import {
  getNotificationSettings,
  saveNotificationSettings,
  initializeNotifications,
  defaultNotificationSettings,
} from '../services/notificationService';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [settings, setSettings] = useState(defaultNotificationSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getNotificationSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (key: keyof typeof settings) => {
    try {
      if (!settings[key] && key === 'newContent') {
        // Request permissions when enabling notifications for the first time
        const token = await initializeNotifications();
        if (!token) {
          Alert.alert(
            'Permissions Required',
            'Please enable notifications in your device settings to receive updates.'
          );
          return;
        }
      }

      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };
      
      setSettings(newSettings);
      await saveNotificationSettings(newSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>New Content Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified when new movies and shows are added
              </Text>
            </View>
            <Switch
              value={settings.newContent}
              onValueChange={() => handleToggle('newContent')}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Recommendations</Text>
              <Text style={styles.settingDescription}>
                Receive personalized movie and show recommendations
              </Text>
            </View>
            <Switch
              value={settings.recommendations}
              onValueChange={() => handleToggle('recommendations')}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>App Updates</Text>
              <Text style={styles.settingDescription}>
                Stay informed about new features and improvements
              </Text>
            </View>
            <Switch
              value={settings.updates}
              onValueChange={() => handleToggle('updates')}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Downloads</Text>
              <Text style={styles.settingDescription}>
                Get notified when your downloads are complete
              </Text>
            </View>
            <Switch
              value={settings.downloads}
              onValueChange={() => handleToggle('downloads')}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>
        </View>

        <View style={styles.infoSection}>
          <Ionicons name="information-circle" size={20} color={COLORS.TEXT.SECONDARY} />
          <Text style={styles.infoText}>
            You can change your notification preferences at any time in your device settings
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DARK,
  },
  headerTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DARK,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.SURFACE.DARK,
    margin: 16,
    borderRadius: 8,
  },
  infoText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default NotificationSettingsScreen; 