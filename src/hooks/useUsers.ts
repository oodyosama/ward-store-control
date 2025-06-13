
import { useState, useEffect } from 'react';
import { User } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Transform Supabase data to match our User type
      const transformedUsers: User[] = (data || []).map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role as User['role'],
        permissions: user.permissions || [],
        isActive: user.is_active,
        createdAt: new Date(user.created_at),
        lastLogin: user.last_login ? new Date(user.last_login) : undefined
      }));

      setUsers(transformedUsers);
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

      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          email: userData.email,
          role: userData.role,
          permissions: getPermissionsByRole(userData.role),
          is_active: userData.isActive,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        toast({
          title: "خطأ في إضافة المستخدم",
          description: error.message === 'duplicate key value violates unique constraint "users_email_key"' 
            ? "البريد الإلكتروني مستخدم بالفعل" 
            : "حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        return { success: false };
      }

      toast({
        title: "تم إنشاء المستخدم بنجاح",
        description: `تم إضافة المستخدم ${userData.username} بنجاح`,
      });

      return { success: true, data };
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
