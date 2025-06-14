
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, signOut } = useTenant();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* الشريط الجانبي */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* الرأس */}
        <Header onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
        
        {/* شريط معلومات المستخدم */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  مرحباً، {profile.username}
                </span>
                {profile.tenants && (
                  <span className="text-blue-600 dark:text-blue-400">
                    {profile.tenants.name}
                  </span>
                )}
                {profile.tenant_users?.[0] && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {profile.tenant_users[0].role === 'admin' ? 'مدير' :
                     profile.tenant_users[0].role === 'manager' ? 'مدير فرع' :
                     profile.tenant_users[0].role === 'warehouse_keeper' ? 'أمين مخزن' :
                     profile.tenant_users[0].role === 'accountant' ? 'محاسب' :
                     profile.tenant_users[0].role === 'cashier' ? 'كاشير' : 
                     profile.tenant_users[0].role}
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        )}
        
        {/* المحتوى */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
        
        {/* التذييل */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="text-center sm:text-right mb-2 sm:mb-0">
                © 2024 نظام إدارة المخازن. جميع الحقوق محفوظة.
              </div>
              <div className="text-center sm:text-left">
                الإصدار 1.0.0 | تم التطوير بواسطة فريق التقنية
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
