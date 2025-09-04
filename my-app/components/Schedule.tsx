import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
const SLOT_HEIGHT = 60;

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

// Schedule component now accepts a theme prop
const Schedule = ({ currentDate, events = [], theme }) => {
  // Dynamic styles that depend on the theme
  const styles = getStyles(theme);

  const weekDays = React.useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - startOfWeek.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const renderEvents = () => {
    return events.map(event => {
      const eventDayIndex = dayNames.indexOf(event.day);
      if (eventDayIndex === -1) return null;

      const startHour = parseInt(event.startTime.split(':')[0]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      
      const top = startHour * SLOT_HEIGHT;
      const height = (endHour - startHour) * SLOT_HEIGHT;
      const left = eventDayIndex * (100 / dayNames.length);

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
          <View style={styles.timeGutter}>
            {hours.map(hour => (
              <View key={hour} style={styles.hourCell}>
                <Text style={styles.hourText}>{hour}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {weekDays.map((date, index) => (
              <View key={index} style={styles.dayColumn}>
                {hours.map(hour => (
                  <View key={hour} style={styles.timeSlot} />
                ))}
              </View>
            ))}
            {renderEvents()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles are now a function that returns a StyleSheet object based on the theme
const getStyles = (theme) => StyleSheet.create({
  container: { height: 500, backgroundColor: theme.scheduleBackground, borderRadius: 20, overflow: 'hidden' },
  headerContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.borderColor },
  dayHeader: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  dayNameText: { color: theme.text, fontSize: 12, marginBottom: 4 },
  dayNumberText: { color: theme.text, fontWeight: 'bold', fontSize: 16 },
  todayText: { color: '#E53935' }, // Specific highlight color, remains unchanged
  gridScrollView: { flex: 1 },
  timeGutter: { width: 60, paddingHorizontal: 5, borderRightWidth: 1, borderRightColor: theme.borderColor },
  hourCell: { height: SLOT_HEIGHT, justifyContent: 'flex-start', alignItems: 'center' },
  hourText: { color: theme.subtitleText, fontSize: 12, transform: [{ translateY: -8 }] },
  grid: { flex: 1, flexDirection: 'row', position: 'relative' },
  dayColumn: { flex: 1, borderRightWidth: 1, borderRightColor: theme.borderColor },
  timeSlot: {
    height: SLOT_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColor,
  },
  eventBlock: { position: 'absolute', backgroundColor: 'rgba(229, 57, 53, 0.7)', borderRadius: 8, padding: 4, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
  eventText: { color: 'white', fontSize: 12, fontWeight: 'bold' }, // Event text color on a colored background, remains white
});

export default Schedule;