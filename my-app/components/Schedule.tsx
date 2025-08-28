import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const days = ['일', '월', '화', '수', '목', '금', '토'];
const SLOT_HEIGHT = 60;

const Schedule = ({ events = [] }) => {
  const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.

  const renderEvents = () => {
    return events.map(event => {
      const dayIndex = days.indexOf(event.day);
      if (dayIndex === -1) return null;

      const startHour = parseInt(event.startTime.split(':')[0]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      
      const top = startHour * SLOT_HEIGHT;
      const height = (endHour - startHour) * SLOT_HEIGHT;
      const left = dayIndex * (100 / days.length); // As percentage

      return (
        <View 
          key={event.id}
          style={[
            styles.eventBlock,
            { top, height, left: `${left}%`, width: `${100 / days.length}%` }
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
        {days.map((day, index) => (
          <View key={day} style={styles.dayHeader}>
            <Text style={[styles.dayText, index === today && styles.todayText]}>{day}</Text>
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
            {days.map(day => (
              <View key={day} style={styles.dayColumn}>
                {hours.map(hour => (
                  <View key={`${day}-${hour}`} style={styles.timeSlot} />
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

const styles = StyleSheet.create({
  container: {
    height: 500, // Give a fixed height to the container
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  dayHeader: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  dayText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#E53935', // Highlight color for today
  },
  gridScrollView: {
    flex: 1,
  },
  timeGutter: {
    width: 60,
    paddingHorizontal: 5,
    borderRightWidth: 1,
    borderRightColor: '#444',
  },
  hourCell: {
    height: SLOT_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hourText: {
    color: '#888',
    fontSize: 12,
    transform: [{ translateY: -8 }], // Position text on the line
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative', // Needed for absolute positioning of events
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#444',
  },
  timeSlot: {
    height: SLOT_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  eventBlock: {
    position: 'absolute',
    backgroundColor: 'rgba(229, 57, 53, 0.7)',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Schedule;