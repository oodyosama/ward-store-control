
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
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => {
    try {
      // Generate a default email based on username
      const defaultEmail = `${userData.username.toLowerCase().replace(/\s+/g, '')}@warehouse.local`;
      
      // Create user with generated email and password in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: defaultEmail,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            role: userData.role
          }
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        toast({
          title: "خطأ في إنشاء المستخدم",
          description: "حدث خطأ أثناء إنشاء حساب المستخدم.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Insert user data into our users table
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: authData.user?.id,
          username: userData.username,
          email: defaultEmail,
          role: userData.role,
          permissions: userData.permissions,
          is_active: userData.isActive,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding user to database:', error);
        
        // If database insert fails, we should clean up the auth user
        if (authData.user) {
          // Note: In production, you might want to handle this differently
          console.warn('Auth user created but database insert failed. Manual cleanup may be needed.');
        }
        
        toast({
          title: "خطأ في حفظ بيانات المستخدم",
          description: "تم إنشاء الحساب ولكن فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.",
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
