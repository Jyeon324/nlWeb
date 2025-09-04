import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform, Pressable, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import Colors from '../constants/Colors';

const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
const displayHours = Array.from({ length: 10 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);
const SLOT_HEIGHT = 40;

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export default function AddJamScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);

  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [currentPickerTarget, setCurrentPickerTarget] = useState('startTime');
  const [artist, setArtist] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [selectedSessions, setSelectedSessions] = useState({
      '보컬': null, '리드기타': null, '리듬기타': null, '베이스': null, '드럼': null, '키보드': null, '스트링': null,
  });
  const [showSessionDetailModal, setShowSessionDetailModal] = useState(false);
  const [currentSessionBeingEdited, setCurrentSessionBeingEdited] = useState(null);
  const [studentIdInput, setStudentIdInput] = useState('');

  const handleSessionPress = (sessionName) => {
    setCurrentSessionBeingEdited(sessionName);
    if (selectedSessions[sessionName] && selectedSessions[sessionName] !== '모집중') {
      setStudentIdInput(selectedSessions[sessionName]);
    } else {
      setStudentIdInput('');
    }
    setShowSessionDetailModal(true);
  };

  const assignStudentId = () => {
    if (currentSessionBeingEdited && studentIdInput.trim() !== '') {
      setSelectedSessions(prevState => ({ ...prevState, [currentSessionBeingEdited]: studentIdInput.trim() }));
      closeSessionDetailModal();
    } else {
      Alert.alert('오류', '학번을 입력해주세요.');
    }
  };

  const markAsRecruiting = () => {
    if (currentSessionBeingEdited) {
      setSelectedSessions(prevState => ({ ...prevState, [currentSessionBeingEdited]: '모집중' }));
      closeSessionDetailModal();
    }
  };

  const closeSessionDetailModal = () => {
    setShowSessionDetailModal(false);
    setCurrentSessionBeingEdited(null);
    setStudentIdInput('');
  };

  const onTimeChange = (event, newTime) => {
    setShowPicker(false);
    const selectedValue = Platform.OS === 'web' ? event : newTime;
    if (selectedValue) {
      if (currentPickerTarget === 'startTime') setSelectedStartTime(selectedValue);
      else setSelectedEndTime(selectedValue);
    }
  };

  const handleSubmit = () => { /* ... existing submit logic ... */ };

  const weekDays = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, []);

  const calculateJamBlockStyle = (day) => {
    const startHour = selectedStartTime.getHours();
    const startMinute = selectedStartTime.getMinutes();
    const endHour = selectedEndTime.getHours();
    const endMinute = selectedEndTime.getMinutes();
    const timetableStartHour = 9;
    const startOffsetMinutes = (startHour - timetableStartHour) * 60 + startMinute;
    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    if (startOffsetMinutes < 0 || durationMinutes <= 0 || !isSameDay(day, selectedStartTime)) return null;
    const top = (startOffsetMinutes / 60) * SLOT_HEIGHT;
    const height = (durationMinutes / 60) * SLOT_HEIGHT;
    return { position: 'absolute', top, height, width: '100%', backgroundColor: 'rgba(0, 122, 255, 0.6)', borderRadius: 4, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2 };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>합주 추가</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.addButton}>저장</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timetableContainer}>
        <View style={styles.timetableHeaderContainer}>
          <View style={styles.timeGutter} />
          {weekDays.map((date, index) => (
            <View key={index} style={styles.dayHeader}>
              <Text style={styles.dayNameText}>{dayNames[date.getDay()]}</Text>
              <Text style={[styles.dayNumberText, isSameDay(date, new Date()) && styles.todayText]}>
                {date.getDate()}
              </Text>
            </View>
          ))}
        </View>
        <ScrollView style={styles.gridScrollView}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={styles.timeGutter}>
                {displayHours.map(hour => (
                    <View key={hour} style={styles.hourCell}>
                    <Text style={styles.hourText}>{hour}</Text>
                    </View>
                ))}
                </View>

                <View style={styles.grid}>
                {weekDays.map((date, index) => (
                    <View key={index} style={styles.dayColumn}>
                    {displayHours.map(hour => (
                        <TouchableOpacity key={hour} style={styles.timeSlot} />
                    ))}
                    {calculateJamBlockStyle(date) && (
                        <View style={calculateJamBlockStyle(date)}>
                        <Text style={styles.jamBlockText}>
                            {selectedStartTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })} -
                            {selectedEndTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </Text>
                        </View>
                    )}
                    </View>
                ))}
                </View>
            </View>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.dateTimeSelectionContainer}>
            <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>시작 시간</Text>
                <Pressable onPress={() => { setCurrentPickerTarget('startTime'); setShowPicker(true); }} style={styles.dateTimeButton}>
                <Text style={styles.dateTimeButtonText}>
                    {selectedStartTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
                </Pressable>
            </View>
            <View style={styles.inputGroupHalf}>
                <Text style={styles.label}>끝 시간</Text>
                <Pressable onPress={() => { setCurrentPickerTarget('endTime'); setShowPicker(true); }} style={styles.dateTimeButton}>
                <Text style={styles.dateTimeButtonText}>
                    {selectedEndTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </Text>
                </Pressable>
            </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>가수</Text>
          <TextInput style={styles.input} placeholderTextColor={theme.subtitleText} placeholder="가수 이름을 입력하세요" value={artist} onChangeText={setArtist} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>곡명</Text>
          <TextInput style={styles.input} placeholderTextColor={theme.subtitleText} placeholder="곡명을 입력하세요" value={songTitle} onChangeText={setSongTitle} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>세션</Text>
          <View style={styles.sessionsContainer}>
            {Object.keys(selectedSessions).map((sessionName) => (
              <TouchableOpacity key={sessionName} style={[styles.sessionItem, selectedSessions[sessionName] !== null && styles.selectedSessionItem, selectedSessions[sessionName] === '모집중' && styles.recruitingSessionItem]} onPress={() => handleSessionPress(sessionName)}>
                <Text style={styles.sessionText}>
                  {sessionName}
                  {selectedSessions[sessionName] && selectedSessions[sessionName] !== '모집중' && ` (${selectedSessions[sessionName]})`}
                  {selectedSessions[sessionName] === '모집중' && ` (모집중)`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {showSessionDetailModal && (
        <Pressable style={styles.modalBackdrop} onPress={closeSessionDetailModal}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.sessionDetailModalContainer}>
            <Text style={styles.sessionDetailModalTitle}>{currentSessionBeingEdited} 세션 설정</Text>
            <TextInput style={styles.input} placeholderTextColor={theme.subtitleText} placeholder="학번을 입력하세요" value={studentIdInput} onChangeText={setStudentIdInput} keyboardType="numeric" />
            <TouchableOpacity style={styles.modalButton} onPress={assignStudentId}><Text style={styles.modalButtonText}>학번으로 추가</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={markAsRecruiting}><Text style={styles.modalButtonText}>모집중으로 설정</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeSessionDetailModal}><Text style={styles.modalButtonText}>취소</Text></TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme = Colors.dark) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.borderColor, backgroundColor: theme.inputBackground },
  backButton: { fontSize: 24, fontWeight: 'bold', color: theme.text },
  title: { fontSize: 18, fontWeight: 'bold', color: theme.text },
  addButton: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  timetableContainer: { height: 250, backgroundColor: theme.scheduleBackground, borderRadius: 10, margin: 10, overflow: 'hidden' },
  timetableHeaderContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.borderColor, backgroundColor: theme.cardHeaderBackground },
  dayHeader: { flex: 1, paddingVertical: 5, alignItems: 'center' },
  dayNameText: { color: theme.text, fontSize: 10, marginBottom: 2 },
  dayNumberText: { color: theme.text, fontWeight: 'bold', fontSize: 14 },
  todayText: { color: '#E53935' },
  gridScrollView: { flex: 1 },
  timeGutter: { width: 50, paddingHorizontal: 2, borderRightWidth: 1, borderRightColor: theme.borderColor },
  hourCell: { height: SLOT_HEIGHT, justifyContent: 'flex-start', alignItems: 'center' },
  hourText: { color: theme.subtitleText, fontSize: 10, transform: [{ translateY: -5 }] },
  grid: { flex: 1, flexDirection: 'row', position: 'relative' },
  dayColumn: { flex: 1, borderRightWidth: 1, borderRightColor: theme.borderColor },
  timeSlot: { height: SLOT_HEIGHT, borderBottomWidth: 1, borderBottomColor: theme.borderColor },
  jamBlockText: { color: 'white', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  formContainer: { padding: 20 },
  inputGroup: { marginBottom: 15 },
  inputGroupHalf: { flex: 1, marginHorizontal: 5 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: theme.text },
  input: { backgroundColor: theme.inputBackground, borderWidth: 1, borderColor: theme.borderColor, borderRadius: 8, padding: 12, fontSize: 16, color: theme.text },
  dateTimeSelectionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  dateTimeButton: { backgroundColor: theme.inputBackground, borderWidth: 1, borderColor: theme.borderColor, borderRadius: 8, padding: 12, alignItems: 'center' },
  dateTimeButtonText: { color: theme.text, fontSize: 16 },
  modalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  sessionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  sessionItem: { backgroundColor: theme.inputBackground, borderWidth: 1, borderColor: theme.borderColor, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, marginRight: 10, marginBottom: 10 },
  selectedSessionItem: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  recruitingSessionItem: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
  sessionText: { color: theme.text, fontSize: 14, fontWeight: 'bold' },
  sessionDetailModalContainer: { backgroundColor: theme.scheduleBackground, borderRadius: 10, padding: 20, width: '80%', alignItems: 'center' },
  sessionDetailModalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 20 },
  modalButton: { backgroundColor: '#007AFF', borderRadius: 8, padding: 12, marginTop: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#FF3B30', marginTop: 20 },
});
