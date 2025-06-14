
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { TenantLoginHeader } from '@/components/Auth/TenantLoginHeader';
import { TenantLoginForm } from '@/components/Auth/TenantLoginForm';
import { TenantSignupForm } from '@/components/Auth/TenantSignupForm';

export default function TenantLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSuccess = (username: string) => {
    // Switch to login tab
    const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
    loginTab?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <TenantLoginHeader />

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup">إنشاء حساب جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <TenantLoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </TabsContent>

            <TabsContent value="signup">
              <TenantSignupForm 
                isLoading={isLoading} 
                setIsLoading={setIsLoading}
                onSignupSuccess={handleSignupSuccess}
              />
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
