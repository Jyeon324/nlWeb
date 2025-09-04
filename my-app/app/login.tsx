import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleLogin = () => {
    if (studentId === 'root' && password === '1234') {
      signIn();
      router.replace('/(tabs)');
    } else {
      Alert.alert('로그인 실패', '학번 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>NLHEAM CHORUS</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleText }]}>로그인하여 합주에 참여하세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]}
          placeholder="학번"
          placeholderTextColor={theme.subtitleText}
          value={studentId}
          onChangeText={setStudentId}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]}
          placeholder="비밀번호"
          placeholderTextColor={theme.subtitleText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable style={[styles.loginButton, { backgroundColor: theme.buttonBackground }]} onPress={handleLogin}>
        <Text style={[styles.loginButtonText, { color: theme.buttonTextColor }]}>로그인</Text>
      </Pressable>
      <View style={styles.signupContainer}>
        <Text style={[styles.signupText, { color: theme.subtitleText }]}>계정이 없으신가요? </Text>
        <Pressable onPress={() => Alert.alert('알림', '회원가입 기능은 아직 준비중입니다.')}>
          <Text style={[styles.signupText, styles.signupLink]}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    color: '#E53935', // This color is the same in both themes, so I can leave it.
    textDecorationLine: 'underline',
  },
});