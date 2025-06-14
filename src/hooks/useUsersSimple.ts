
import { useState, useEffect } from 'react';
import { User } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

// بيانات تجريبية للمستخدمين
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['manage_users', 'manage_warehouses', 'manage_items'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-06-14')
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager1@example.com',
    role: 'manager',
    permissions: ['manage_warehouses', 'manage_items'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-06-13')
  },
  {
    id: '3',
    username: 'keeper1',
    email: 'keeper1@example.com',
    role: 'warehouse_keeper',
    permissions: ['manage_items'],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date('2024-06-12')
  },
  {
    id: '4',
    username: 'accountant1',
    email: 'accountant1@example.com',
    role: 'accountant',
    permissions: ['view_reports'],
    isActive: false,
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date('2024-06-10')
  }
];

export function useUsersSimple() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // محاكاة التأخير
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, isLoading, refetch: fetchUsers };
}

export function useAddUserSimple() {
  const { toast } = useToast();

  const addUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => {
    try {
      // محاكاة إضافة المستخدم
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        permissions: userData.permissions,
        isActive: userData.isActive,
        createdAt: new Date(),
        lastLogin: undefined
      };

      // إضافة المستخدم للقائمة (هذا مؤقت)
      mockUsers.push(newUser);

      toast({
        title: "تم إنشاء المستخدم بنجاح",
        description: `تم إضافة المستخدم ${userData.username} بنجاح`,
      });

      return { success: true, data: newUser };
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
