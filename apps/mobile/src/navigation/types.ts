import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Groups: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CreateBroadcastModal: { groupId?: string };
  CreateGroupModal: undefined;
  AcceptInviteModal: { token: string };
  GroupSettingsModal: { groupId: string };
};
