import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

function InitialLayout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    // Prevent navigation until the router has mounted.
    if (segments.length === 0) {
      return;
    }

    if (user && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!user && inTabsGroup) {
      router.replace('/login');
    }
  }, [user, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <InitialLayout />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
