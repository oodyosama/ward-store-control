
import { useState } from 'react';
import { User } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

// Mock users data - in a real app this would come from a database
const mockUsers: User[] = [
  {
    id: '1',
    username: 'أحمد محمد',
    email: 'ahmed@warehouse.com',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_users'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-06-10')
  },
  {
    id: '2',
    username: 'فاطمة علي',
    email: 'fatima@warehouse.com',
    role: 'manager',
    permissions: ['read', 'write', 'manage_inventory'],
    isActive: true,
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date('2024-06-09')
  },
  {
    id: '3',
    username: 'محمد حسن',
    email: 'mohammed@warehouse.com',
    role: 'warehouse_keeper',
    permissions: ['read', 'write'],
    isActive: true,
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-06-08')
  },
  {
    id: '4',
    username: 'سارة أحمد',
    email: 'sara@warehouse.com',
    role: 'accountant',
    permissions: ['read'],
    isActive: false,
    createdAt: new Date('2024-04-05'),
    lastLogin: new Date('2024-05-15')
  }
];

let usersState = [...mockUsers];

export function useUsers() {
  const [users] = useState<User[]>(usersState);
  return { users };
}

export function useAddUser() {
  const { toast } = useToast();

  const addUser = async (userData: {
    username: string;
    email: string;
    role: User['role'];
    isActive: boolean;
  }) => {
    try {
      // Generate permissions based on role
      const getPermissionsByRole = (role: User['role']): string[] => {
        switch (role) {
          case 'admin':
            return ['read', 'write', 'delete', 'manage_users', 'manage_inventory'];
          case 'manager':
            return ['read', 'write', 'manage_inventory'];
          case 'warehouse_keeper':
            return ['read', 'write'];
          case 'accountant':
            return ['read'];
          default:
            return ['read'];
        }
      };

      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        permissions: getPermissionsByRole(userData.role),
        isActive: userData.isActive,
        createdAt: new Date(),
        lastLogin: undefined
      };

      // Add to mock data
      usersState.unshift(newUser);

      toast({
        title: "تم إنشاء المستخدم بنجاح",
        description: `تم إضافة المستخدم ${userData.username} بنجاح`,
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "خطأ في إضافة المستخدم",
        description: "حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return { addUser };
}
