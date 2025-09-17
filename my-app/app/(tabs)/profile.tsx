import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

// Placeholder data
const user = {
  name: '최종연',
  age: 25,
  gender: '남',
  introduction: '나다. 최종연',
  genres: ['JAZZ', 'FUSION JAZZ'],
  availableSessions: ['보컬', '기타', '베이스', '드럼', '키보드'],
  favoriteMusicians: ['최규민', '김승영', '초록불꽃소년단'],
};

// Tag component for skills, genres, etc.
const Tag = ({ label, theme }) => (
  <View style={getStyles(theme).tagContainer}>
    <Text style={getStyles(theme).tagText}>{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* --- Profile Header --- */}
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/images/react-logo.png')} // Placeholder banner image
            style={styles.bannerImage} 
          />
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('../../assets/images/react-logo.png')} // Placeholder profile image
              style={styles.profileImage} 
            />
          </View>
        </View>

        {/* --- User Info --- */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userAgeGender}>{`${user.age}대, ${user.gender}`}</Text>
        </View>

        {/* --- Introduction Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>자기 소개</Text>
          <Text style={styles.cardContent}>{user.introduction}</Text>
        </View>

        {/* --- Available Sessions Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>가능한 세션</Text>
          <View style={styles.tagRow}>{user.availableSessions.map(s => <Tag key={s} label={s} theme={theme} />)}</View>
        </View>

        {/* --- Details Cards --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>관심있는 장르</Text>
          <View style={styles.tagRow}>{user.genres.map(g => <Tag key={g} label={g} theme={theme} />)}</View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>좋아하는 뮤지션</Text>
          {user.favoriteMusicians.map(m => <Text key={m} style={styles.musicianText}>{m}</Text>)}
        </View>

        {/* --- Logout Button (kept from original) --- */}
        <Pressable style={styles.logoutButton} onPress={() => signOut()}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  // Header Styles
  headerContainer: {
    marginBottom: 60, // Space for the overlapping profile picture
  },
  bannerImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.scheduleBackground, // Placeholder color
  },
  profileImageContainer: {
    position: 'absolute',
    top: 140, // Position it to overlap the banner
    left: '50%',
    marginLeft: -60, // Half of the profile image width to center it
    borderWidth: 4,
    borderColor: theme.background,
    borderRadius: 64, // Make it circular
    backgroundColor: theme.background,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it circular
    backgroundColor: theme.scheduleBackground, // Placeholder color
  },
  // User Info Styles
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  userAgeGender: {
    fontSize: 16,
    color: theme.subtitleText,
    marginTop: 4,
  },
  // Card Styles
  card: {
    backgroundColor: theme.scheduleBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  },
  // Tag Styles
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    backgroundColor: theme.background,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.borderColor,
  },
  tagText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  // Musician Styles
  musicianText: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 26,
  },
  // Logout Button Styles
  logoutButton: {
    backgroundColor: theme.buttonBackground,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40, // Add some space at the bottom
  },
  logoutButtonText: {
    color: theme.buttonTextColor,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
