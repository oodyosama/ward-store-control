
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Lock, User, ArrowLeft, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function UserLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== USER LOGIN ATTEMPT START ===');
    console.log('Current isLoading state:', isLoading);
    
    if (!loginData.username || !loginData.password) {
      console.log('❌ UserLogin validation failed - missing credentials');
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    console.log('🔄 UserLogin setting isLoading to TRUE');
    setIsLoading(true);

    try {
      console.log('🔍 Searching for user:', loginData.username);

      const { data: profile, error: profileError } = await supabase
        .from('tenant_profiles')
        .select(`
          *,
          tenants(*),
          tenant_users(*)
        `)
        .eq('username', loginData.username)
        .eq('is_tenant_owner', false)
        .single();

      if (profileError || !profile) {
        console.error('❌ UserLogin profile not found:', profileError);
        setIsLoading(false);
        console.log('🔄 UserLogin setting isLoading to FALSE (profile not found)');
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير موجود",
          variant: "destructive",
        });
        return;
      }

      const userEmail = profile.tenants?.email;
      if (!userEmail) {
        console.log('❌ UserLogin no email found');
        setIsLoading(false);
        console.log('🔄 UserLogin setting isLoading to FALSE (no email)');
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "البريد الإلكتروني غير موجود",
          variant: "destructive",
        });
        return;
      }

      console.log('🔐 UserLogin attempting auth with email:', userEmail);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: loginData.password
      });

      if (error) {
        console.error('❌ UserLogin auth error:', error.message);
        setIsLoading(false);
        console.log('🔄 UserLogin setting isLoading to FALSE (auth error)');
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message === 'Invalid login credentials' 
            ? "اسم المستخدم أو كلمة المرور غير صحيحة" 
            : error.message,
          variant: "destructive",
        });
        return;
      }

      const tenantUser = Array.isArray(profile.tenant_users) ? profile.tenant_users[0] : null;
      if (!tenantUser || !tenantUser.is_active) {
        console.log('❌ UserLogin inactive user');
        setIsLoading(false);
        console.log('🔄 UserLogin setting isLoading to FALSE (inactive user)');
        toast({
          title: "حساب معطل",
          description: "تم تعطيل حسابك. يرجى مراجعة المسؤول",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        return;
      }

      console.log('✅ UserLogin successful for user:', profile.username);

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${profile.username}`,
      });

      console.log('🚀 UserLogin navigating to dashboard...');
      
      // تأخير بسيط للتأكد من اكتمال العملية
      setTimeout(() => {
        setIsLoading(false);
        console.log('🔄 UserLogin setting isLoading to FALSE (success)');
        navigate('/dashboard');
      }, 100);

    } catch (error) {
      console.error('❌ UserLogin unexpected error:', error);
      setIsLoading(false);
      console.log('🔄 UserLogin setting isLoading to FALSE (catch block)');
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
    
    console.log('=== USER LOGIN ATTEMPT END ===');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            دخول المستخدمين
          </CardTitle>
          <p className="text-gray-600 mt-2">
            تسجيل دخول الموظفين والمدراء التابعين للمؤسسة
          </p>
        </CardHeader>

        <CardContent>
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

          <div className="mt-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              دخول المؤسسات
            </Button>
            
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟ تواصل مع المسؤول
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
