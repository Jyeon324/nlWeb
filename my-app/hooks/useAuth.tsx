import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext<{
  signIn: () => void;
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
    // For now, we'll just simulate that check
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => setAuth({ faked: true }), // In a real app, you'd fetch user data here
        signOut: () => setAuth(null),
        user,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
