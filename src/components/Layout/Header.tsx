
import React, { useState } from 'react';
import { Bell, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* شعار النظام وزر القائمة */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  نظام إدارة المخازن
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Warehouse Management System
                </p>
              </div>
            </div>
          </div>

          {/* شريط البحث */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ابحث عن الأصناف، المخازن، أو الحركات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
          </div>

          {/* الإجراءات */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* الإشعارات */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                  <h3 className="font-medium text-right">الإشعارات</h3>
                  <p className="text-sm text-gray-500 text-right">
                    لديك {unreadNotifications} إشعار غير مقروء
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {state.notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                      <div className="w-full text-right">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs ${
                            notification.priority === 'high' ? 'text-red-500' :
                            notification.priority === 'medium' ? 'text-yellow-500' :
                            'text-gray-500'
                          }`}>
                            {notification.priority === 'high' ? 'عالي' :
                             notification.priority === 'medium' ? 'متوسط' : 'منخفض'}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    عرض جميع الإشعارات
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ملف المستخدم */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{state.currentUser?.username}</p>
                    <p className="text-xs text-gray-500">
                      {state.currentUser?.role === 'admin' ? 'مدير النظام' :
                       state.currentUser?.role === 'manager' ? 'مدير' :
                       state.currentUser?.role === 'warehouse_keeper' ? 'أمين مخزن' :
                       'محاسب'}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-right">
                  <User className="mr-2 h-4 w-4" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem className="text-right">
                  إعدادات النظام
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-right text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* شريط البحث للجوال */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
