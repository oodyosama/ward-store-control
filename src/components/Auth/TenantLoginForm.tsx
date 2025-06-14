
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface TenantLoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function TenantLoginForm({ isLoading, setIsLoading }: TenantLoginFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, get the email associated with this username
      const { data: profile, error: profileError } = await supabase
        .from('tenant_profiles')
        .select('*, tenants(*)')
        .eq('username', loginData.username)
        .eq('is_tenant_owner', true)
        .single();

      if (profileError || !profile) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير موجود",
          variant: "destructive",
        });
        return;
      }

      // Get the user's email from the tenants table
      const userEmail = profile.tenants?.email;
      if (!userEmail) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "لم يتم العثور على البريد الإلكتروني المرتبط بهذا الحساب",
          variant: "destructive",
        });
        return;
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: loginData.password
      });

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message === 'Invalid login credentials' 
            ? "اسم المستخدم أو كلمة المرور غير صحيحة" 
            : error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${profile.username}`,
      });

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="username"
            type="text"
            placeholder="أدخل اسم المستخدم"
            className="pr-10"
            value={loginData.username}
            onChange={(e) => setLoginData({...loginData, username: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type="password"
            placeholder="أدخل كلمة المرور"
            className="pr-10"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
}
