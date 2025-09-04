import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";

// Date/Time Picker Imports



// Timetable constants and helper functions (adapted from Schedule.tsx)
const SLOT_HEIGHT = 40; // Adjusted for a more compact view
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
const displayHours = Array.from({ length: 10 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`); // 9:00 to 18:00

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export default function AddJamScreen() {
  const router = useRouter();
  
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false); // Now only for time pickers
  const [currentPickerTarget, setCurrentPickerTarget] = useState<'startTime' | 'endTime'>('startTime'); // Only for time pickers
  const [artist, setArtist] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [selectedSessions, setSelectedSessions] = useState<{ [key: string]: string | null }>(
    {
      '보컬': null,
      '리드기타': null,
      '리듬기타': null,
      '베이스': null,
      '드럼': null,
      '키보드': null,
      '스트링': null,
    }
  );

  const [showSessionDetailModal, setShowSessionDetailModal] = useState(false);
  const [currentSessionBeingEdited, setCurrentSessionBeingEdited] = useState<string | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('');

  const handleSessionPress = (sessionName: string) => {
    setCurrentSessionBeingEdited(sessionName);
    if (selectedSessions[sessionName] && selectedSessions[sessionName] !== '모집중') {
      setStudentIdInput(selectedSessions[sessionName] as string);
    } else {
      setStudentIdInput('');
    }
    setShowSessionDetailModal(true);
  };

  const assignStudentId = () => {
    if (currentSessionBeingEdited && studentIdInput.trim() !== '') {
      setSelectedSessions(prevState => ({
        ...prevState,
        [currentSessionBeingEdited]: studentIdInput.trim(),
      }));
      closeSessionDetailModal();
    } else {
      Alert.alert('오류', '학번을 입력해주세요.');
    }
  };

  const markAsRecruiting = () => {
    if (currentSessionBeingEdited) {
      setSelectedSessions(prevState => ({
        ...prevState,
        [currentSessionBeingEdited]: '모집중',
      }));
      closeSessionDetailModal();
    }
  };

  const closeSessionDetailModal = () => {
    setShowSessionDetailModal(false);
    setCurrentSessionBeingEdited(null);
    setStudentIdInput('');
  };

  const onTimeChange = (event: any, newTime?: Date) => {
    setShowPicker(false);
    const selectedValue = Platform.OS === 'web' ? event : newTime;

    if (selectedValue) {
      if (currentPickerTarget === 'startTime') {
        setSelectedStartTime(selectedValue);
      } else if (currentPickerTarget === 'endTime') {
        setSelectedEndTime(selectedValue);
      }
    }
  };

  const handleStartTimePress = () => {
    setCurrentPickerTarget('startTime');
    setShowPicker(true);
  };

  const handleEndTimePress = () => {
    setCurrentPickerTarget('endTime');
    setShowPicker(true);
  };

  const handleSubmit = () => {
    const formattedStartTime = selectedStartTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedEndTime = selectedEndTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (!formattedStartTime || !formattedEndTime || !artist || !songTitle) {
      Alert.alert('필수 정보 누락', '시작 시간, 끝 시간, 가수, 곡명은 필수 입력 항목입니다.');
      return;
    }

    if (selectedStartTime.getTime() >= selectedEndTime.getTime()) {
      Alert.alert('시간 오류', '시작 시간은 끝 시간보다 빨라야 합니다.');
      return;
    }

    const selectedSessionDetails = Object.keys(selectedSessions)
      .filter(key => selectedSessions[key] !== null)
      .map(key => {
        const value = selectedSessions[key];
        return `${key}: ${value}`;
      })
      .join(', ');

    Alert.alert(
      '합주 추가',
      `시작 시간: ${formattedStartTime}\n` + 
      `끝 시간: ${formattedEndTime}\n` + 
      `가수: ${artist}\n` + 
      `곡명: ${songTitle}\n` + 
      `세션: ${selectedSessionDetails || '없음'}`
    );
    setSelectedStartTime(new Date());
    setSelectedEndTime(new Date());
    setArtist('');
    setSongTitle('');
    setSelectedSessions({
      '보컬': null,
      '리드기타': null,
      '리듬기타': null,
      '베이스': null,
      '드럼': null,
      '키보드': null,
      '스트링': null,
    });
  };

  // Calculate week days for the timetable (starting from Sunday)
  const weekDays = React.useMemo(() => {
    const startOfWeek = new Date(); // Changed to current date
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Set to Sunday of the current week
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, []); // Removed selectedDate from dependency

  const calculateJamBlockStyle = (day: Date) => {
    const startHour = selectedStartTime.getHours();
    const startMinute = selectedStartTime.getMinutes();
    const endHour = selectedEndTime.getHours();
    const endMinute = selectedEndTime.getMinutes();

    // Assuming timetable starts at 9:00 (displayHours starts from 9:00)
    const timetableStartHour = 9;

    const startOffsetMinutes = (startHour - timetableStartHour) * 60 + startMinute;
    const durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);

    if (startOffsetMinutes < 0 || durationMinutes <= 0) {
      return null; // Invalid time range or outside timetable hours
    }

    const top = (startOffsetMinutes / 60) * SLOT_HEIGHT;
    const height = (durationMinutes / 60) * SLOT_HEIGHT;

    return {
      position: 'absolute',
      top: top,
      height: height,
      width: '100%',
      backgroundColor: 'rgba(0, 122, 255, 0.6)', // Blue with some transparency
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 2,
    };
  };

  const renderTimePicker = () => {
    if (!showPicker) return null;

    let pickerValue = currentPickerTarget === 'startTime' ? selectedStartTime : selectedEndTime;

    if (Platform.OS === 'web') {
      return (
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.webDatePickerContainer}>
            <DatePicker
              selected={pickerValue}
              onChange={onTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              inline
              locale="ko"
            />
          </Pressable>
        </Pressable>
      );
    }

    return (
      <DateTimePicker
        value={pickerValue}
        mode="time"
        display="spinner"
        onChange={onTimeChange}
      />
    );
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

      {/* Timetable Section */}
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
                  {/* Render the jam session block */}
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
              {/* Events would be rendered here if any */}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Form Section */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        

        <View style={styles.dateTimeSelectionContainer}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>시작 시간</Text>
            <Pressable onPress={handleStartTimePress} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeButtonText}>
                {selectedStartTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputGroupHalf}>
            <Text style={styles.label}>끝 시간</Text>
            <Pressable onPress={handleEndTimePress} style={styles.dateTimeButton}>
              <Text style={styles.dateTimeButtonText}>
                {selectedEndTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>가수</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            placeholder="가수 이름을 입력하세요"
            value={artist}
            onChangeText={setArtist}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>곡명</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            placeholder="곡명을 입력하세요"
            value={songTitle}
            onChangeText={setSongTitle}
          />
        </View>

        {/* Sessions Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>세션</Text>
          <View style={styles.sessionsContainer}>
            {Object.keys(selectedSessions).map((sessionName) => (
              <TouchableOpacity
                key={sessionName}
                style={[ 
                  styles.sessionItem,
                  selectedSessions[sessionName] !== null && styles.selectedSessionItem,
                  selectedSessions[sessionName] === '모집중' && styles.recruitingSessionItem,
                ]}
                onPress={() => handleSessionPress(sessionName)}
              >
                <Text
                  style={[ 
                    styles.sessionText,
                    selectedSessions[sessionName] !== null && styles.selectedSessionText,
                  ]}
                >
                  {sessionName}
                  {selectedSessions[sessionName] && selectedSessions[sessionName] !== '모집중' && ` (${selectedSessions[sessionName]})`}
                  {selectedSessions[sessionName] === '모집중' && ` (모집중)`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      {renderTimePicker()} {/* Changed from renderDatePicker() */}

      {/* Session Detail Modal */}
      {showSessionDetailModal && currentSessionBeingEdited && (
        <Pressable style={styles.modalBackdrop} onPress={closeSessionDetailModal}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.sessionDetailModalContainer}>
            <Text style={styles.sessionDetailModalTitle}>{currentSessionBeingEdited} 세션 설정</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#aaa"
              placeholder="학번을 입력하세요"
              value={studentIdInput}
              onChangeText={setStudentIdInput}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.modalButton} onPress={assignStudentId}>
              <Text style={styles.modalButtonText}>학번으로 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={markAsRecruiting}>
              <Text style={styles.modalButtonText}>모집중으로 설정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={closeSessionDetailModal}>
              <Text style={styles.modalButtonText}>취소</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background from index.tsx
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Darker border
    backgroundColor: '#2C2C2E', // Darker header background
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    fontSize: 16,
    color: '#007AFF', // Keep blue for action button
    fontWeight: 'bold',
  },
  // Timetable Styles
  timetableContainer: {
    height: 250, // Fixed height for the timetable section
    backgroundColor: '#2C2C2E', // Dark background from Schedule.tsx
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  timetableHeaderContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Darker border
    backgroundColor: '#3C3C3E', // Slightly lighter dark header for timetable
  },
  dayHeader: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
  },
  dayNameText: {
    color: 'white',
    fontSize: 10,
    marginBottom: 2,
  },
  dayNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  todayText: {
    color: '#E53935', // Red for today
  },
  gridScrollView: {
    flex: 1,
  },
  timeGutter: {
    width: 50, // Slightly smaller time gutter
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#444', // Darker border
  },
  hourCell: {
    height: SLOT_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hourText: {
    color: '#888', // Lighter gray for hour text
    fontSize: 10,
    transform: [{ translateY: -5 }],
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#444', // Darker border
  },
  timeSlot: {
    height: SLOT_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#444', // Darker border
  },
  jamBlockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Form Styles
  formContainer: {
    padding: 20,
    backgroundColor: '#1C1C1E', // Dark background from index.tsx
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 5, // Spacing between start/end time pickers
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white', // White label for dark theme
  },
  input: {
    backgroundColor: '#3C3C3E', // Darker input background
    borderWidth: 1,
    borderColor: '#555', // Darker input border
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'white', // White text in input
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Date/Time Selection Styles
  dateTimeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateTimeButton: {
    backgroundColor: '#3C3C3E',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    color: 'white',
    fontSize: 16,
  },
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    overflow: 'hidden',
  },
  // Sessions Styles
  sessionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  sessionItem: {
    backgroundColor: '#3C3C3E',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSessionItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  recruitingSessionItem: {
    backgroundColor: '#FFC107', // Amber color for recruiting
    borderColor: '#FFC107',
  },
  sessionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedSessionText: {
    color: 'white',
  },
  // Session Detail Modal Styles
  sessionDetailModalContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  sessionDetailModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // Red color for cancel
    marginTop: 20,
  },
});
