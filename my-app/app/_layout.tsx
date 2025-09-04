import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, useColorScheme } from 'react-native';
import 'react-native-reanimated';
import Colors from '../constants/Colors';

function ThemedLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthRoute = segments[0] === 'login';

    // If the user is not signed in and not on the login screen, redirect to login.
    if (!user && !inAuthRoute) {
      router.replace('/login');
    } 
    // If the user is signed in and on the login screen, redirect to the home screen.
    else if (user && inAuthRoute) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="addJam" options={{ title: '합주 추가' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
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
      <ThemedLayout />
    </AuthProvider>
  );
}
