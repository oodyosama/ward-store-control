
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useAdminAuth } from './useAdminAuth';

interface User {
  username: string;
  role: 'admin' | 'user';
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  updateAdminCredentials: (newUsername: string, newPassword: string) => Promise<boolean>;
  mustChangePassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { validateAdminCredentials, updateAdminCredentials: updateAdminCreds, checkIfDefaultCredentials } = useAdminAuth();

  useEffect(() => {
    // التحقق من وجود جلسة مسجلة مسبقاً
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

  const login = async (username: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    try {
      if (role === 'admin') {
        // التحقق من بيانات المدير من قاعدة البيانات
        const isValid = await validateAdminCredentials(username, password);
        
        if (!isValid) {
          return false;
        }

        // التحقق من استخدام البيانات الافتراضية
        const isDefaultCredentials = await checkIfDefaultCredentials(username);
        
        const newUser = { 
          username, 
          role: 'admin' as const,
          mustChangePassword: isDefaultCredentials 
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('mustChangePassword', isDefaultCredentials.toString());
        
        return true;
      } else {
        // تسجيل دخول المستخدم العادي (يمكن تطويره لاحقاً)
        if (username && password) {
          const newUser = { 
            username, 
            role: 'user' as const,
            mustChangePassword: false 
          };
          
          setUser(newUser);
          setIsAuthenticated(true);
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', username);
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('mustChangePassword', 'false');
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    if (user?.role === 'admin') {
      const success = await updateAdminCreds(newUsername, newPassword);
      
      if (success) {
        const updatedUser = {
          ...user,
          username: newUsername,
          mustChangePassword: false
        };
        
        setUser(updatedUser);
        
        // تحديث localStorage
        localStorage.setItem('username', newUsername);
        localStorage.setItem('mustChangePassword', 'false');
        
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('mustChangePassword');
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
