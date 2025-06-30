import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import LoginScreen from './LoginScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [dataUsage, setDataUsage] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState('High');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Autoplay next episode</Text>
            <Switch
              value={autoplay}
              onValueChange={setAutoplay}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('NotificationSettings')}
          >
            <Text style={styles.settingLabel}>Notification Preferences</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Usage</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Cellular data for streaming</Text>
            <Switch
              value={dataUsage}
              onValueChange={setDataUsage}
              trackColor={{ false: COLORS.SURFACE.DARK, true: COLORS.PRIMARY }}
            />
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Download quality</Text>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>{downloadQuality}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT.SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>App version</Text>
            <Text style={styles.settingValueText}>1.0.0</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
            style={styles.logoutButton}
            >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SURFACE.DARK,
  },
  sectionTitle: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingLabel: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 16,
    marginRight: 4,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.SURFACE.DARK,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.DANGER,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen; 