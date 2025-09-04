import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, useColorScheme } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import Colors from '../../constants/Colors';

export default function ApplyScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleBackPress = () => {
    router.push('/(tabs)');
    return true; // Prevent default behavior
  };

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => subscription.remove();
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>←</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.text, { color: theme.text }]}>Apply Screen</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});