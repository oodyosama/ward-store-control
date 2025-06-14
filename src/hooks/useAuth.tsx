
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface User {
  username: string;
  role: 'admin' | 'user';
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, role: 'admin' | 'user') => void;
  logout: () => void;
  isAdmin: boolean;
  updateAdminCredentials: (newUsername: string, newPassword: string) => void;
  mustChangePassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'user';
    const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';

    if (storedAuth === 'true' && storedUsername && storedRole) {
      setUser({ 
        username: storedUsername, 
        role: storedRole,
        mustChangePassword 
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, role: 'admin' | 'user') => {
    // Check if admin is using default credentials
    const isDefaultAdmin = role === 'admin' && username === 'admin';
    const mustChangePassword = isDefaultAdmin;

    const newUser = { 
      username, 
      role,
      mustChangePassword 
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('mustChangePassword', mustChangePassword.toString());
  };

  const updateAdminCredentials = (newUsername: string, newPassword: string) => {
    if (user?.role === 'admin') {
      const updatedUser = {
        ...user,
        username: newUsername,
        mustChangePassword: false
      };
      
      setUser(updatedUser);
      
      // Update localStorage with new credentials
      localStorage.setItem('username', newUsername);
      localStorage.setItem('adminPassword', newPassword);
      localStorage.setItem('mustChangePassword', 'false');
      
      console.log('Admin credentials updated successfully');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('mustChangePassword');
    localStorage.removeItem('adminPassword');
  };

  const isAdmin = user?.role === 'admin';
  const mustChangePassword = user?.mustChangePassword || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      isAdmin,
      updateAdminCredentials,
      mustChangePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
