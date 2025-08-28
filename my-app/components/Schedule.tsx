
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
const SLOT_HEIGHT = 60;

// Helper to check if two dates are the same day
const isSameDay = (d1, d2) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const Schedule = ({ currentDate, events = [] }) => {
  // Generate the days of the week based on the currentDate prop
  const weekDays = React.useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const renderEvents = () => {
    return events.map(event => {
      // Find which date in the current week corresponds to the event's day name
      const eventDayIndex = dayNames.indexOf(event.day);
      if (eventDayIndex === -1) return null;
      
      const eventDate = weekDays[eventDayIndex];

      const startHour = parseInt(event.startTime.split(':')[0]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      
      const top = startHour * SLOT_HEIGHT;
      const height = (endHour - startHour) * SLOT_HEIGHT;
      const left = eventDayIndex * (100 / dayNames.length); // As percentage

      return (
        <View 
          key={event.id}
          style={[
            styles.eventBlock,
            { top, height, left: `${left}%`, width: `${100 / dayNames.length}%` }
          ]}
        >
          <Text style={styles.eventText}>{event.title}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Days Header */}
      <View style={styles.headerContainer}>
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
          {/* Time Gutter */}
          <View style={styles.timeGutter}>
            {hours.map(hour => (
              <View key={hour} style={styles.hourCell}>
                <Text style={styles.hourText}>{hour}</Text>
              </View>
            ))}
          </View>

          {/* Grid Cells & Events */}
          <View style={styles.grid}>
            {weekDays.map((date, index) => (
              <View key={index} style={styles.dayColumn} />
            ))}
            {renderEvents()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 500, backgroundColor: '#2C2C2E', borderRadius: 20, overflow: 'hidden' },
  headerContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#444' },
  dayHeader: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  dayNameText: { color: '#FFF', fontSize: 12, marginBottom: 4 },
  dayNumberText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  todayText: { color: '#E53935' },
  gridScrollView: { flex: 1 },
  timeGutter: { width: 60, paddingHorizontal: 5, borderRightWidth: 1, borderRightColor: '#444' },
  hourCell: { height: SLOT_HEIGHT, justifyContent: 'flex-start', alignItems: 'center' },
  hourText: { color: '#888', fontSize: 12, transform: [{ translateY: -8 }] },
  grid: { flex: 1, flexDirection: 'row', position: 'relative' },
  dayColumn: { flex: 1, borderRightWidth: 1, borderRightColor: '#444' },
  eventBlock: { position: 'absolute', backgroundColor: 'rgba(229, 57, 53, 0.7)', borderRadius: 8, padding: 4, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
  eventText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});

export default Schedule;
