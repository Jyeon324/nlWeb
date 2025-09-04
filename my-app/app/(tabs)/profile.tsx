import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>내 정보</Text>
        <Pressable style={[styles.logoutButton, { backgroundColor: theme.buttonBackground }]} onPress={() => signOut()}>
          <Text style={[styles.logoutButtonText, { color: theme.buttonTextColor }]}>로그아웃</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});