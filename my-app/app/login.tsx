import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

export default function LoginScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // The API expects an 'identifier', so we pass studentId as the identifier.
      await signIn(studentId, password);
      // The auth logic in the root layout will handle the redirect automatically.
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>NLHEAM CHORUS</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleText }]}>로그인하여 합주에 참여하세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]}
          placeholder="학번 또는 이메일"
          placeholderTextColor={theme.subtitleText}
          value={studentId}
          onChangeText={setStudentId}
          autoCapitalize="none"
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
      <Pressable style={[styles.loginButton, { backgroundColor: theme.buttonBackground }]} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={theme.buttonTextColor} />
        ) : (
          <Text style={[styles.loginButtonText, { color: theme.buttonTextColor }]}>로그인</Text>
        )}
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
    color: '#E53935',
    textDecorationLine: 'underline',
  },
});
