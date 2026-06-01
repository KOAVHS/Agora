import { Slot, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, AppState, AppStateStatus } from 'react-native';
import { colors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const router = useRouter();
  const initAuth = useAuthStore((s) => s.initAuth);
  const touchLastActive = useAuthStore((s) => s.touchLastActive);

  useEffect(() => {
    // initialize auth and check for expired session flag
    (async () => {
      await initAuth();
      try {
        const expired = await AsyncStorage.getItem('sessionExpired');
        if (expired === 'true') {
          await AsyncStorage.removeItem('sessionExpired');
          Alert.alert('Sesión cerrada', 'La sesión se cerró por ausencia. Por favor inicia sesión nuevamente.');
          router.replace('/auth');
        }
      } catch {}
    })();

    const mountedRef = { current: true } as { current: boolean };
    const appStateRef = { current: AppState.currentState } as { current: AppStateStatus };
    const onChange = (nextState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        // app came to foreground
        touchLastActive();
      }
      appStateRef.current = nextState;
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      mountedRef.current = false;
      sub.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});