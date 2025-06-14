
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isAdminLogin) {
        // Admin login
        if (username === 'admin' && password === 'admin') {
          login('admin', 'admin');
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك مدير النظام",
          });
          
          navigate('/');
        } else {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: "اسم المستخدم أو كلمة المرور غير صحيحة",
            variant: "destructive",
          });
        }
      } else {
        // User login - check against database
        // For now, we'll use simple validation
        // In a real app, this would check against Supabase auth
        if (username && password) {
          login(username, 'user');
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: `مرحباً بك ${username}`,
          });
          
          navigate('/');
        } else {
          toast({
            title: "خطأ في البيانات",
            description: "يرجى إدخال اسم المستخدم وكلمة المرور",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">م</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            نظام إدارة المخازن
          </CardTitle>
          <p className="text-gray-500 mt-2">
            {isAdminLogin ? 'تسجيل دخول المدير' : 'تسجيل دخول المستخدم'}
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Toggle buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                !isAdminLogin 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              مستخدم
            </button>
            <button
              type="button"
              onClick={() => setIsAdminLogin(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors ${
                isAdminLogin 
                  ? 'bg-white shadow-sm text-red-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              مدير
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-right block mb-2">
                اسم المستخدم
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isAdminLogin ? "admin" : "أدخل اسم المستخدم"}
                className="text-right"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-right block mb-2">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAdminLogin ? "admin" : "أدخل كلمة المرور"}
                className="text-right"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>

          {isAdminLogin && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                <strong>للمدير:</strong> اسم المستخدم: admin، كلمة المرور: admin
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
