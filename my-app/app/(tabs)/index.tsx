import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, SafeAreaView, useColorScheme } from 'react-native';

// Platform-specific imports
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";

import { IconSymbol } from '@/components/ui/IconSymbol';
import Schedule from '@/components/Schedule';
import { Link, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

// Register Korean locale
registerLocale('ko', ko);

const mockEvents = [
  { id: 1, day: '수', startTime: '14:00', endTime: '16:00', title: '정기 합주' },
  { id: 2, day: '금', startTime: '18:00', endTime: '21:00', title: '신입생 환영 합주' },
];

const ActionButton = ({ title, subtitle, iconName, color, onPress, theme }) => (
  <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <IconSymbol name={iconName} size={32} color="white" style={styles.buttonIcon} />
    <Text style={styles.buttonTitle}>{title}</Text>
    <Text style={[styles.buttonSubtitle, { color: theme.cardSubtitle }]}>{subtitle}</Text>
  </Pressable>
);

const getWeekRange = (date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const format = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${format(startOfWeek)} - ${format(endOfWeek)}`;
};

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const onDateChange = (eventOrDate, selectedDateOrEvent) => {
    setShowPicker(false);
    const selectedDate = Platform.OS === 'web' ? eventOrDate : selectedDateOrEvent;
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const renderDatePicker = () => {
    if (!showPicker) return null;

    if (Platform.OS === 'web') {
      return (
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={[styles.webDatePickerContainer, { backgroundColor: theme.background }]}>
              <DatePicker
                selected={currentDate}
                onChange={onDateChange}
                inline
                locale="ko"
              />
            </View>
          </Pressable>
        </Pressable>
      );
    }

    return (
      <DateTimePicker
        value={currentDate}
        mode="date"
        display="default"
        onChange={onDateChange}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.container}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>NLHEAM CHORUS</Text>
          
          <View style={styles.buttonGrid}>
            <ActionButton title="내 정보" subtitle="My Information" iconName="person.fill" color="#007AFF" theme={theme} />
            <ActionButton title="공지사항" subtitle="Announcements" iconName="megaphone.fill" color="#5856D6" theme={theme} />
            <Link href="/addJam" asChild>
              <ActionButton title="합주 신청" subtitle="Ensemble Application" iconName="music.note.list" color="#FF9500" theme={theme} />
            </Link>
            <ActionButton title="세션 신청" subtitle="Session Application" iconName="guitars.fill" color="#34C759" theme={theme} />
          </View>

          <View style={styles.scheduleHeaderContainer}>
            <Text style={[styles.scheduleHeader, { color: theme.text }]}>합주 시간표</Text>
            <View style={styles.weekNavController}>
              <Pressable onPress={handlePrevWeek} style={styles.navButton}><IconSymbol name="chevron.left" size={22} color={theme.text} /></Pressable>
              <Text style={[styles.weekRangeText, { color: theme.text }]}>{getWeekRange(currentDate)}</Text>
              <Pressable onPress={handleNextWeek} style={styles.navButton}><IconSymbol name="chevron.right" size={22} color={theme.text} /></Pressable>
              <Pressable onPress={() => setShowPicker(true)} style={styles.navButton}><IconSymbol name="calendar" size={22} color={theme.text} /></Pressable>
            </View>
          </View>
          
          <Schedule currentDate={currentDate} events={mockEvents} theme={theme} />
        </ScrollView>
      </SafeAreaView>

      {renderDatePicker()}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  buttonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  button: { width: '48%', height: 120, borderRadius: 20, padding: 15, marginBottom: 16, justifyContent: 'space-between' },
  buttonIcon: { alignSelf: 'flex-start' },
  buttonTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  buttonSubtitle: { fontSize: 14 },
  scheduleHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  scheduleHeader: { fontSize: 22, fontWeight: 'bold' },
  weekNavController: { flexDirection: 'row', alignItems: 'center' },
  weekRangeText: { marginHorizontal: 10, fontWeight: '600', fontSize: 16 },
  navButton: { padding: 5 },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  webDatePickerContainer: {
    borderRadius: 16,
    padding: 10,
    overflow: 'hidden',
  },
});