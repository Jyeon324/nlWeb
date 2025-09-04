import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';

export default function ApplyScreen() {
  const router = useRouter();

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
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'black' }}>←</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Apply Screen</Text>
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
