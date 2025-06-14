
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
    
    console.log('=== LOGIN ATTEMPT START ===');
    
    if (!loginData.username || !loginData.password) {
      console.log('❌ Validation failed - missing credentials');
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    console.log('🔄 Setting isLoading to TRUE');
    setIsLoading(true);

    try {
      console.log('🔍 Searching for user:', loginData.username);

      const { data: profile, error: profileError } = await supabase
        .from('tenant_profiles')
        .select(`
          *,
          tenants(*)
        `)
        .eq('username', loginData.username)
        .eq('is_tenant_owner', true)
        .single();

      if (profileError || !profile) {
        console.error('❌ Profile not found:', profileError);
        console.log('🔄 Setting isLoading to FALSE (profile not found)');
        setIsLoading(false);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير موجود أو غير صحيح",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Profile found:', profile.username);

      const internalEmail = `${loginData.username}@tenant.local`;
      console.log('🔐 Attempting auth with email:', internalEmail);

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: loginData.password
      });

      if (authError) {
        console.error('❌ Auth error:', authError.message);
        console.log('🔄 Setting isLoading to FALSE (auth error)');
        setIsLoading(false);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: authError.message === 'Invalid login credentials' 
            ? "اسم المستخدم أو كلمة المرور غير صحيحة" 
            : "حدث خطأ في تسجيل الدخول",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Auth successful, user ID:', authData.user?.id);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${profile.username}`,
      });

      console.log('🚀 Navigating to dashboard...');
      console.log('🔄 Setting isLoading to FALSE (success)');
      setIsLoading(false);
      navigate('/dashboard');

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      console.log('🔄 Setting isLoading to FALSE (catch block)');
      setIsLoading(false);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
    
    console.log('=== LOGIN ATTEMPT END ===');
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </Button>
    </form>
  );
}
