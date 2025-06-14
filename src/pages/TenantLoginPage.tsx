
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { TenantLoginHeader } from '@/components/Auth/TenantLoginHeader';
import { TenantLoginForm } from '@/components/Auth/TenantLoginForm';

export default function TenantLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <TenantLoginHeader />

        <CardContent>
          <TenantLoginForm isLoading={isLoading} setIsLoading={setIsLoading} />

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/user-login')}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
              >
                <Users className="w-4 h-4" />
                تسجيل دخول الموظفين والمستخدمين
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب مؤسسة؟ 
                <Button 
                  variant="link" 
                  onClick={() => navigate('/tenant-signup')}
                  className="text-sm text-blue-600 hover:text-blue-800 p-0 ml-1"
                >
                  إنشاء حساب جديد
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
