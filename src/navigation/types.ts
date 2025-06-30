import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  NewTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Logo: undefined;
  Login: undefined;
  Signup: undefined;
  ProfileSelection: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  MovieDetails: {
    movieId: number;
  };
  ViewAll: {
    category: string;
    title: string;
  };
  EditProfile: {
    isNewProfile: boolean;
    profileId?: string;
  };
  VideoPlayer: {
    videoId: string;
    title?: string;
    localUri?: string;
  };
  Settings: undefined;
  Downloads: undefined;
  NotificationSettings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 