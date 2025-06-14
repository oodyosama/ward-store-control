
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* الشريط الجانبي الثابت */}
      <Sidebar />
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* الرأس */}
        <Header />
        
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
