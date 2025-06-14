
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TenantLoginHeader } from '@/components/Auth/TenantLoginHeader';
import { TenantSignupForm } from '@/components/Auth/TenantSignupForm';

export default function TenantSignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignupSuccess = (username: string) => {
    // التوجه إلى صفحة تسجيل الدخول مع رسالة نجاح
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <TenantLoginHeader />

        <CardContent>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              إنشاء حساب مؤسسة جديد
            </h2>
            <p className="text-sm text-center text-gray-600">
              قم بإنشاء حساب مؤسسة جديد لإدارة المخازن
            </p>
          </div>

          <TenantSignupForm 
            isLoading={isLoading} 
            setIsLoading={setIsLoading}
            onSignupSuccess={handleSignupSuccess}
          />

          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة إلى تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
