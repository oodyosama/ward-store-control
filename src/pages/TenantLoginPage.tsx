
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Lock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function TenantLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    tenantName: '',
    username: '',
    password: '',
    confirmPassword: ''
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيدها غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    const { data: existingProfile } = await supabase
      .from('tenant_profiles')
      .select('username')
      .eq('username', signupData.username)
      .single();

    if (existingProfile) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "اسم المستخدم مستخدم بالفعل",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting tenant signup process...');

      // Generate a unique email based on username
      const generatedEmail = `${signupData.username}@tenant.local`;

      // Create the auth user without email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: generatedEmail,
        password: signupData.password,
        options: {
          data: {
            username: signupData.username,
            tenant_name: signupData.tenantName
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        toast({
          title: "خطأ في إنشاء الحساب",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: "فشل في إنشاء المستخدم",
          variant: "destructive",
        });
        return;
      }

      console.log('Auth user created:', authData.user.id);

      // Wait a moment for auth to be established
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create tenant first
      console.log('Creating tenant...');
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert([{
          name: signupData.tenantName,
          email: generatedEmail,
        }])
        .select()
        .single();

      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
        toast({
          title: "خطأ في إنشاء المؤسسة",
          description: tenantError.message || "فشل في إنشاء بيانات المؤسسة",
          variant: "destructive",
        });
        return;
      }

      console.log('Tenant created:', tenantData.id);

      // Create tenant profile
      console.log('Creating tenant profile...');
      const { error: profileError } = await supabase
        .from('tenant_profiles')
        .insert([{
          user_id: authData.user.id,
          tenant_id: tenantData.id,
          username: signupData.username,
          is_tenant_owner: true,
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: "خطأ في إنشاء الملف الشخصي",
          description: profileError.message || "فشل في إنشاء الملف الشخصي",
          variant: "destructive",
        });
        return;
      }

      console.log('Profile created successfully');

      // Create tenant user record
      const { error: tenantUserError } = await supabase
        .from('tenant_users')
        .insert([{
          tenant_id: tenantData.id,
          user_id: authData.user.id,
          role: 'admin',
          permissions: ['read', 'write', 'delete', 'manage_users'],
        }]);

      if (tenantUserError) {
        console.error('Tenant user creation error:', tenantUserError);
        console.log('Warning: Failed to create tenant user record, but continuing...');
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام اسم المستخدم وكلمة المرور",
      });

      // Switch to login tab
      const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
      loginTab?.click();

      // Clear signup form and set login username
      setSignupData({
        tenantName: '',
        username: '',
        password: '',
        confirmPassword: ''
      });

      // Pre-fill login username
      setLoginData({
        username: signupData.username,
        password: ''
      });

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ غير متوقع أثناء إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            نظام إدارة المخازن
          </CardTitle>
          <p className="text-gray-600 mt-2">
            دخول المؤسسات الرئيسية
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">اسم المؤسسة</Label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="tenantName"
                      type="text"
                      placeholder="أدخل اسم المؤسسة"
                      className="pr-10"
                      value={signupData.tenantName}
                      onChange={(e) => setSignupData({...signupData, tenantName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupUsername">اسم المستخدم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signupUsername"
                      type="text"
                      placeholder="أدخل اسم المستخدم"
                      className="pr-10"
                      value={signupData.username}
                      onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                      className="pr-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="أعد إدخال كلمة المرور"
                      className="pr-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/user-login')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              تسجيل دخول الموظفين والمستخدمين
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
