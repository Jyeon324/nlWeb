import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Schedule from '@/components/Schedule';
import {IconSymbol} from "@/components/ui/IconSymbol";

const mockEvents = [
  {
    id: 1,
    day: '수',
    startTime: '14:00',
    endTime: '16:00',
    title: '정기 합주',
  },
  {
    id: 2,
    day: '금',
    startTime: '18:00',
    endTime: '21:00',
    title: '신입생 환영 합주',
  },
];

const ActionButton = ({ title, subtitle, iconName, color, onPress }) => (
  <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <IconSymbol name={iconName} size={32} color="white" style={styles.buttonIcon} />
    <Text style={styles.buttonTitle}>{title}</Text>
    <Text style={styles.buttonSubtitle}>{subtitle}</Text>
  </Pressable>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>NLHEAM CHORUS</Text>
        
        <View style={styles.buttonGrid}>
          <ActionButton 
            title="내 정보" 
            subtitle="My Information" 
            iconName="person.fill" 
            color="#007AFF" 
            onPress={() => { /* Navigate to profile */ }} 
          />
          <ActionButton 
            title="합주 신청" 
            subtitle="Ensemble Application" 
            iconName="music.note.list" 
            color="#FF9500" 
            onPress={() => { /* Navigate to application */ }} 
          />
          <ActionButton 
            title="세션 신청" 
            subtitle="Session Application" 
            iconName="guitars.fill" 
            color="#34C759" 
            onPress={() => { /* Navigate to session application */ }} 
          />
          <ActionButton 
            title="합주 조회" 
            subtitle="Ensemble View" 
            iconName="calendar" 
            color="#5856D6" 
            onPress={() => { /* Navigate to schedule view */ }} 
          />
        </View>

        <Text style={styles.scheduleHeader}>합주 시간표</Text>
        <Schedule events={mockEvents} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  buttonIcon: {
    alignSelf: 'flex-start',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scheduleHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
});