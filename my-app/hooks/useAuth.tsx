import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<{
  signIn: (identifier, password) => Promise<void>;
  signOut: () => void;
  user: any;
  loading: boolean;
} | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would check for a stored token here
    setLoading(false);
  }, []);

  const signIn = async (identifier: any, password: any) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || '로그인에 실패했습니다.');
      }

      // On success, store the content of the 'data' field
      if (responseData.data) {
        setAuth(responseData.data);
      } else {
        throw new Error('서버 응답에 사용자 데이터가 없습니다.');
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut: () => setAuth(null),
        user,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}