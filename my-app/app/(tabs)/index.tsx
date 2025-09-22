import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, useColorScheme, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';

import { IconSymbol } from '@/components/ui/IconSymbol';
import Schedule from '@/components/Schedule';
import { Link } from 'expo-router';
import Colors from '../../constants/Colors';

const mockEvents = [
  { id: 1, day: '수', startTime: '14:00', endTime: '16:00', title: '정기 합주' },
  { id: 2, day: '금', startTime: '18:00', endTime: '21:00', title: '신입생 환영 합주' },
];

const ActionButton = ({ title, subtitle, iconName, color, onPress, theme }) => (
  <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <IconSymbol name={iconName} size={32} color="white" style={styles.buttonIcon} />
    <Text style={styles.buttonTitle}>{title}</Text>
    <Text style={[styles.buttonSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>{subtitle}</Text>
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

const getCalendarTheme = (theme) => ({
  backgroundColor: theme.background,
  calendarBackground: theme.scheduleBackground,
  textSectionTitleColor: theme.text,
  selectedDayBackgroundColor: Colors.dark.tint, // Using a consistent tint color
  selectedDayTextColor: '#ffffff',
  todayTextColor: Colors.dark.tint,
  dayTextColor: theme.text,
  textDisabledColor: theme.subtitleText,
  dotColor: Colors.dark.tint,
  selectedDotColor: '#ffffff',
  arrowColor: Colors.dark.tint,
  monthTextColor: theme.text,
  indicatorColor: theme.text,
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 14,
});

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const calendarTheme = getCalendarTheme(theme);

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

  const onDayPress = (day) => {
    setCurrentDate(new Date(day.timestamp));
    setShowPicker(false);
  };

  const renderCalendarModal = () => (
    <Modal
      visible={showPicker}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPicker(false)}
    >
      <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.calendarContainer, { backgroundColor: theme.scheduleBackground }]}>
            <Calendar
              current={currentDate.toISOString().split('T')[0]}
              onDayPress={onDayPress}
              monthFormat={'yyyy년 MM월'}
              theme={calendarTheme}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.container}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>NLHEAM CHORUS</Text>
          
          <View style={styles.buttonGrid}>
            <Link href="/(tabs)/profile" asChild>
              <ActionButton title="내 정보" subtitle="My Information" iconName="person.fill" color="#007AFF" theme={theme} />
            </Link>
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

      {renderCalendarModal()}
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '90%',
  },
});
