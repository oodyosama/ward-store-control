
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { useAdminAuth } from './useAdminAuth';

interface User {
  username: string;
  role: 'admin' | 'user';
  permissions: string[];
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
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// تعريف الصلاحيات الافتراضية لكل دور
const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'read', 'write', 'delete', 'manage_users', 'manage_items', 
    'manage_warehouses', 'view_reports', 'manage_transactions', 
    'export_data', 'system_settings', 'pos_access'
  ],
  cashier: ['read', 'pos_access'],
  warehouse_keeper: ['read', 'write', 'manage_items', 'manage_transactions'],
  manager: ['read', 'write', 'view_reports', 'manage_items', 'manage_transactions'],
  accountant: ['read', 'view_reports', 'export_data']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { validateAdminCredentials, updateAdminCredentials: updateAdminCreds, checkIfDefaultCredentials } = useAdminAuth();

  useEffect(() => {
    // التحقق من وجود جلسة مسجلة مسبقاً
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('userRole') as 'admin' | 'user';
    const storedPermissions = localStorage.getItem('userPermissions');
    const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true';

    if (storedAuth === 'true' && storedUsername && storedRole) {
      const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];
      setUser({ 
        username: storedUsername, 
        role: storedRole,
        permissions,
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
          permissions: DEFAULT_PERMISSIONS.admin,
          mustChangePassword: isDefaultCredentials 
        };
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userPermissions', JSON.stringify(DEFAULT_PERMISSIONS.admin));
        localStorage.setItem('mustChangePassword', isDefaultCredentials.toString());
        
        return true;
      } else {
        // تسجيل دخول المستخدم العادي مع صلاحيات محددة
        if (username && password) {
          // تحديد الدور بناءً على اسم المستخدم أو يمكن إضافة منطق أكثر تعقيداً
          let userRole = 'cashier'; // افتراضي
          
          // يمكن إضافة منطق لتحديد الدور بناءً على اسم المستخدم أو قاعدة البيانات
          if (username.includes('manager')) {
            userRole = 'manager';
          } else if (username.includes('warehouse')) {
            userRole = 'warehouse_keeper';
          } else if (username.includes('accountant')) {
            userRole = 'accountant';
          }
          
          const permissions = DEFAULT_PERMISSIONS[userRole] || DEFAULT_PERMISSIONS.cashier;
          
          const newUser = { 
            username, 
            role: 'user' as const,
            permissions,
            mustChangePassword: false 
          };
          
          setUser(newUser);
          setIsAuthenticated(true);
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', username);
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('userPermissions', JSON.stringify(permissions));
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
    localStorage.removeItem('userPermissions');
    localStorage.removeItem('mustChangePassword');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // المدير له كل الصلاحيات
    return user.permissions.includes(permission);
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
      mustChangePassword,
      hasPermission
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
