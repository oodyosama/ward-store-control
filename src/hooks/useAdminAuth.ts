
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminCredentials {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export function useAdminAuth() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const validateAdminCredentials = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // استعلام للتحقق من بيانات المدير
      const { data, error } = await supabase.rpc('validate_admin_login', {
        input_username: username,
        input_password: password
      });

      if (error) {
        console.error('Error validating admin credentials:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error validating admin credentials:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdminCredentials = async (newUsername: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('update_admin_credentials', {
        new_username: newUsername,
        new_password: newPassword
      });

      if (error) {
        console.error('Error updating admin credentials:', error);
        toast({
          title: "خطأ في تحديث البيانات",
          description: "حدث خطأ أثناء تحديث بيانات المدير",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "تم تحديث البيانات بنجاح",
        description: "تم تحديث اسم المستخدم وكلمة المرور بنجاح",
      });

      return true;
    } catch (error) {
      console.error('Error updating admin credentials:', error);
      toast({
        title: "خطأ في تحديث البيانات",
        description: "حدث خطأ أثناء تحديث بيانات المدير",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfDefaultCredentials = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_credentials')
        .select('username')
        .eq('username', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking default credentials:', error);
        return false;
      }

      // إذا كان اسم المستخدم المدخل هو admin وما زال موجود في قاعدة البيانات
      return username === 'admin' && !!data;
    } catch (error) {
      console.error('Error checking default credentials:', error);
      return false;
    }
  };

  return {
    validateAdminCredentials,
    updateAdminCredentials,
    checkIfDefaultCredentials,
    isLoading
  };
}
