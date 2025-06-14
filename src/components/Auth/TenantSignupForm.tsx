
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Building, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TenantSignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onSignupSuccess: (username: string) => void;
}

export function TenantSignupForm({ isLoading, setIsLoading, onSignupSuccess }: TenantSignupFormProps) {
  const { toast } = useToast();

  const [signupData, setSignupData] = useState({
    tenantName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate internal email from username
      const internalEmail = `${signupData.username}@tenant.local`;

      // Call the Supabase function to create tenant with owner
      const { data, error } = await supabase.rpc('create_tenant_with_owner', {
        tenant_name: signupData.tenantName,
        owner_email: internalEmail,
        owner_password: signupData.password,
        owner_username: signupData.username
      });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "خطأ في إنشاء الحساب",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "يمكنك الآن تسجيل الدخول باستخدام اسم المستخدم وكلمة المرور",
      });

      // Reset form
      setSignupData({
        tenantName: '',
        username: '',
        password: '',
        confirmPassword: ''
      });

      // Switch to login tab
      onSignupSuccess(signupData.username);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tenantName">اسم المؤسسة</Label>
        <div className="relative">
          <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
        <Label htmlFor="signup-username">اسم المستخدم</Label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="signup-username"
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
        <Label htmlFor="signup-password">كلمة المرور</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="signup-password"
            type="password"
            placeholder="أدخل كلمة المرور"
            className="pr-10"
            value={signupData.password}
            onChange={(e) => setSignupData({...signupData, password: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="confirm-password"
            type="password"
            placeholder="تأكيد كلمة المرور"
            className="pr-10"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
      </Button>
    </form>
  );
}
