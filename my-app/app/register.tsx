import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, useColorScheme, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '../constants/Colors';

// Updated sessions to match backend enum (merged guitars)
const SESSIONS = ['보컬', '기타', '베이스', '드럼', '키보드'];

const SESSION_MAP = {
  '보컬': 'VOCAL',
  '기타': 'GUITAR',
  '베이스': 'BASS',
  '드럼': 'DRUM',
  '키보드': 'KEYBOARD',
};

export default function RegisterScreen() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('');
  // Changed state to hold a single session string or null
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionPickerVisible, setSessionPickerVisible] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleStudentIdChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setStudentId(numericText);
  };

  const handleBatchChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setBatch(numericText);
  };

  // Renamed and simplified to handle single session selection
  const handleSessionSelect = (session: string) => {
    setSelectedSession(session);
  };

  const handleRegister = async () => {
    // Keep this for debugging, can be removed later
    console.log("Register button clicked");

    if (!studentId) {
      Alert.alert('입력 오류', '학번을 입력해주세요.');
      return;
    }
    if (!/^\d{8}$/.test(studentId)) {
      Alert.alert('입력 오류', '학번은 8자리 숫자로 입력해주세요.');
      return;
    }

    if (!username) {
        Alert.alert('입력 오류', '이름을 입력해주세요.');
        return;
    }

    if (!email) {
        Alert.alert('입력 오류', '이메일을 입력해주세요.');
        return;
    }
    if (!/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email)) {
      Alert.alert('입력 오류', '이메일 형식이 올바르지 않습니다.');
      return;
    }
    
    if (!password) {
        Alert.alert('입력 오류', '비밀번호를 입력해주세요.');
        return;
    }

    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!batch) {
        Alert.alert('입력 오류', '기수를 입력해주세요.');
        return;
    }
    if (!/^\d+$/.test(batch)) {
      Alert.alert('입력 오류', '기수는 숫자만 입력해주세요.');
      return;
    }

    if (!selectedSession) {
      Alert.alert('입력 오류', '세션을 선택해주세요.');
      return;
    }

    const sessionToSend = SESSION_MAP[selectedSession];

    if (isLoading) return;
    setIsLoading(true);
    try {
      // Pass the single selected session string to the signUp function
      await signUp(studentId, username, password, confirmPassword, email, phone, parseInt(batch), sessionToSend);
      Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('회원가입 실패', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>NLHEAM CHORUS</Text>
      <Text style={[styles.subtitle, { color: theme.subtitleText }]}>회원가입하여 늘혬의 일원이 되어보세요</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="학번"
          placeholderTextColor={theme.subtitleText}
          value={studentId}
          onChangeText={handleStudentIdChange}
          autoCapitalize="none"
          keyboardType="numeric"
          maxLength={8}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="이름"
          placeholderTextColor={theme.subtitleText}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="비밀번호"
          placeholderTextColor={theme.subtitleText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="비밀번호 확인"
          placeholderTextColor={theme.subtitleText}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="이메일"
          placeholderTextColor={theme.subtitleText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="전화번호"
          placeholderTextColor={theme.subtitleText}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputTextColor }]} 
          placeholder="기수"
          placeholderTextColor={theme.subtitleText}
          value={batch}
          onChangeText={handleBatchChange}
          keyboardType="numeric"
          maxLength={2}
        />
        <TouchableOpacity style={[styles.input, { backgroundColor: theme.inputBackground }]} onPress={() => setSessionPickerVisible(true)}>
          <Text style={{ color: selectedSession ? theme.inputTextColor : theme.subtitleText }}>
            {selectedSession ?? '세션 선택'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isSessionPickerVisible}
        onRequestClose={() => setSessionPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {SESSIONS.map(session => (
              <TouchableOpacity key={session} onPress={() => handleSessionSelect(session)} style={styles.sessionOption}>
                <Text style={{ color: theme.text }}>{session}</Text>
                {selectedSession === session && <Text>✅</Text>}
              </TouchableOpacity>
            ))}
            <Pressable style={[styles.modalCloseButton, { backgroundColor: theme.buttonBackground }]} onPress={() => setSessionPickerVisible(false)}>
              <Text style={[styles.registerButtonText, { color: theme.buttonTextColor }]}>선택 완료</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable style={[styles.registerButton, { backgroundColor: theme.buttonBackground }]} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={theme.buttonTextColor} />
        ) : (
          <Text style={[styles.registerButtonText, { color: theme.buttonTextColor }]}>회원가입</Text>
        )}
      </Pressable>
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, { color: theme.subtitleText }]}>이미 계정이 있으신가요? </Text>
        <Link href="/login" asChild>
          <Pressable>
            <Text style={[styles.loginText, styles.loginLink]}>로그인</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    justifyContent: 'center',
  },
  registerButton: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    color: '#E53935',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  sessionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  modalCloseButton: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});