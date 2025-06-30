import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from './types';
import { COLORS } from '../services/constants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignUpScreen';
import ProfileSelectionScreen from '../screens/ProfileSelectionScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NewScreen from '../screens/NewScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import ViewAllScreen from '../screens/ViewAllScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import LogoScreen from '../screens/LogoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DownloadManagerScreen from '../screens/DownloadManagerScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';

type HomeScreenProps = BottomTabScreenProps<TabParamList, 'HomeTab'>;
type SearchScreenProps = BottomTabScreenProps<TabParamList, 'SearchTab'>;
type NewScreenProps = BottomTabScreenProps<TabParamList, 'NewTab'>;
type ProfileScreenProps = BottomTabScreenProps<TabParamList, 'ProfileTab'>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.BACKGROUND,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: COLORS.TEXT.PRIMARY,
        tabBarInactiveTintColor: COLORS.TEXT.SECONDARY,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen as React.FC<HomeScreenProps>}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen as React.FC<SearchScreenProps>}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="NewTab"
        component={NewScreen as React.FC<NewScreenProps>}
        options={{
          tabBarLabel: 'New',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen as React.FC<ProfileScreenProps>}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Logo" 
          component={LogoScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'Logo'>>} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'Login'>>} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'Signup'>>} 
        />
        <Stack.Screen 
          name="ProfileSelection" 
          component={ProfileSelectionScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'ProfileSelection'>>} 
        />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'MovieDetails'>>}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="ViewAll"
          component={ViewAllScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'ViewAll'>>}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'EditProfile'>>}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'Settings'>>}
        />
        <Stack.Screen
          name="Downloads"
          component={DownloadManagerScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'Downloads'>>}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>>}
        />
        <Stack.Screen
          name="VideoPlayer"
          component={VideoPlayerScreen as React.FC<NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>>}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 