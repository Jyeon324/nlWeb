import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login'; // Assuming 'login' is the auth route
    const isAddJamRoute = segments[0] === 'addJam'; // Our new route

    // If user is not logged in AND not on a public route (login or addJam), redirect to login
    if (!user && !inAuthGroup && !isAddJamRoute) {
      router.replace('/login');
    }
    // If user is logged in AND trying to access a non-tab route (and not addJam), redirect to tabs
    else if (user && !['(tabs)', 'addJam'].includes(segments[0])) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  // If we are loading, we don't render anything.
  // We can return a loading screen here if we want.
  if (loading) {
    return <View />;
  }

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
