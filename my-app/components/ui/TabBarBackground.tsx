import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function TabBarBackground() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // On non-iOS platforms, we render a view with the theme's background color.
  // This component just needs to be a valid, non-undefined component to prevent crashes.
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />;
}

export function useBottomTabOverflow() {
  return 0;
}