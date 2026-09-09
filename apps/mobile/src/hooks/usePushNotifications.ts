import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../context/AuthContext';
import { supabase, isMockMode } from '../lib/supabase';

// Configure default in-app notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications(onNotificationTap?: (data: Record<string, unknown>) => void) {
  const { user } = useAuth();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Push notification received in foreground:', notification.request.content);
    });

    // Notification interaction (tap) listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data && onNotificationTap) {
        onNotificationTap(data);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'web') return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      if (token && user && !isMockMode) {
        await supabase
          .from('users')
          .update({ expo_push_token: token, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }
    } catch (err) {
      console.warn('Failed obtaining push token:', err);
    }
  };

  return { registerForPushNotificationsAsync };
}
