export type RootStackParamList = {
  Logo: undefined;
  Login: undefined;
  SignUp: undefined;
  ProfileSelect: undefined;
  MainTabs: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 