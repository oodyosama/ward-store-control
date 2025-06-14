
import { useState } from 'react';
import { User } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useUserActions() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const updateUser = async (userId: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          is_active: userData.isActive,
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: string[]) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ permissions })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user permissions:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        console.error('Error deactivating user:', error);
        throw error;
      }

      toast({
        title: "تم إلغاء تفعيل المستخدم",
        description: "تم إلغاء تفعيل المستخدم بنجاح",
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "خطأ في إلغاء تفعيل المستخدم",
        description: "حدث خطأ أثناء إلغاء تفعيل المستخدم",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    updateUserPermissions,
    deleteUser,
    isLoading,
  };
}
