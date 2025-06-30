import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

export interface NotificationSettings {
  newContent: boolean;
  recommendations: boolean;
  updates: boolean;
  downloads: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  newContent: true,
  recommendations: true,
  updates: true,
  downloads: true,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const initializeNotifications = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with your Expo project ID
    });
    
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return token.data;
  }
  
  return null;
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    return settings ? JSON.parse(settings) : defaultNotificationSettings;
  } catch (error) {
    console.error('Error loading notification settings:', error);
    return defaultNotificationSettings;
  }
};

export const saveNotificationSettings = async (settings: NotificationSettings) => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput = null
) => {
  const settings = await getNotificationSettings();
  
  // Check if notifications are enabled for this type
  if (!settings.newContent) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
};

export const sendDownloadNotification = async (title: string, status: 'completed' | 'failed') => {
  const settings = await getNotificationSettings();
  
  if (!settings.downloads) {
    return;
  }

  const message = status === 'completed'
    ? `${title} has been downloaded successfully`
    : `Failed to download ${title}`;

  await scheduleLocalNotification(
    status === 'completed' ? 'Download Complete' : 'Download Failed',
    message
  );
};

export const sendNewContentNotification = async (title: string) => {
  const settings = await getNotificationSettings();
  
  if (!settings.newContent) {
    return;
  }

  await scheduleLocalNotification(
    'New Content Available',
    `${title} is now available to stream`
  );
};

export const sendRecommendationNotification = async (title: string) => {
  const settings = await getNotificationSettings();
  
  if (!settings.recommendations) {
    return;
  }

  await scheduleLocalNotification(
    'Recommended for You',
    `Based on your watching history, you might like ${title}`
  );
};

export const sendUpdateNotification = async (version: string) => {
  const settings = await getNotificationSettings();
  
  if (!settings.updates) {
    return;
  }

  await scheduleLocalNotification(
    'App Update Available',
    `Version ${version} is now available with new features and improvements`
  );
}; 