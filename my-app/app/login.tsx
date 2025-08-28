
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = () => {
    if (studentId === 'root' && password === '1234') {
      signIn();
      router.replace('/(tabs)');
    } else {
      Alert.alert('로그인 실패', '학번 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NLHEAM CHORUS</Text>
      <Text style={styles.subtitle}>로그인하여 합주에 참여하세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="학번"
          placeholderTextColor="#888"
          value={studentId}
          onChangeText={setStudentId}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </Pressable>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>계정이 없으신가요? </Text>
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
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#E53935',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#888',
    fontSize: 16,
  },
  signupLink: {
    color: '#E53935',
    textDecorationLine: 'underline',
  },
});
