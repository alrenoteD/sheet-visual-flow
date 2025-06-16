
import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  username: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Parse users from environment variable
  // Format: "user1:pass1:DisplayName1,user2:pass2:DisplayName2"
  const parseUsers = () => {
    const usersEnv = import.meta.env.VITE_DASHBOARD_USERS || 'admin:admin123:Administrador';
    const users: Record<string, { password: string; displayName: string }> = {};
    
    usersEnv.split(',').forEach(userStr => {
      const [username, password, displayName] = userStr.split(':');
      if (username && password && displayName) {
        users[username] = { password, displayName };
      }
    });
    
    return users;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('dashboard-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = parseUsers();
    const userConfig = users[username];
    
    if (userConfig && userConfig.password === password) {
      const user = { username, displayName: userConfig.displayName };
      setUser(user);
      localStorage.setItem('dashboard-user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dashboard-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
