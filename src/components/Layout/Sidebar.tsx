
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowDownUp,
  FileText,
  Users,
  Settings,
  Bell,
  BarChart3,
  Scan,
  Calendar,
  Archive,
  CreditCard
} from 'lucide-react';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    path: '/',
    icon: LayoutDashboard,
    label: 'لوحة التحكم',
    labelEn: 'Dashboard',
    color: 'from-blue-500 to-purple-600',
    permissions: ['read']
  },
  {
    path: '/pos',
    icon: CreditCard,
    label: 'نقطة البيع',
    labelEn: 'Point of Sale',
    color: 'from-emerald-500 to-teal-600',
    permissions: ['pos_access']
  },
  {
    path: '/items',
    icon: Package,
    label: 'إدارة الأصناف',
    labelEn: 'Items Management',
    color: 'from-green-500 to-teal-600',
    permissions: ['read', 'manage_inventory']
  },
  {
    path: '/warehouses',
    icon: Warehouse,
    label: 'إدارة المخازن',
    labelEn: 'Warehouses',
    color: 'from-orange-500 to-red-600',
    permissions: ['read', 'manage_warehouses']
  },
  {
    path: '/transactions',
    icon: ArrowDownUp,
    label: 'حركات المخزون',
    labelEn: 'Stock Transactions',
    color: 'from-purple-500 to-pink-600',
    permissions: ['read', 'write']
  },
  {
    path: '/reports',
    icon: FileText,
    label: 'التقارير',
    labelEn: 'Reports',
    color: 'from-indigo-500 to-blue-600',
    permissions: ['view_reports']
  },
  {
    path: '/analytics',
    icon: BarChart3,
    label: 'التحليلات',
    labelEn: 'Analytics',
    color: 'from-teal-500 to-green-600',
    permissions: ['view_reports']
  },
  {
    path: '/scanner',
    icon: Scan,
    label: 'ماسح الباركود',
    labelEn: 'Barcode Scanner',
    color: 'from-yellow-500 to-orange-600',
    permissions: ['read']
  },
  {
    path: '/archive',
    icon: Archive,
    label: 'الأرشيف',
    labelEn: 'Archive',
    color: 'from-gray-500 to-gray-600',
    permissions: ['read']
  },
];

const systemItems = [
  {
    path: '/users',
    icon: Users,
    label: 'إدارة المستخدمين',
    labelEn: 'Users Management',
    adminOnly: true,
    permissions: ['manage_users']
  },
  {
    path: '/notifications',
    icon: Bell,
    label: 'الإشعارات',
    labelEn: 'Notifications',
    badge: true,
    permissions: ['read']
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'الإعدادات',
    labelEn: 'Settings',
    permissions: ['read']
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state } = useWarehouse();
  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const isAdmin = state.currentUser?.role === 'admin';
  const userPermissions = state.currentUser?.permissions || [];

  const hasPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  };

  const handleLinkClick = () => {
    // إغلاق القائمة في الجوال عند النقر على رابط
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permissions)
  );

  const filteredSystemItems = systemItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return hasPermission(item.permissions);
  });

  return (
    <>
      {/* خلفية شفافة للجوال */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`
          fixed md:static inset-y-0 right-0 z-50 w-72 bg-white dark:bg-gray-800 
          shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          border-l border-gray-200 dark:border-gray-700
        `}
      >
        {/* رأس الشريط الجانبي */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Warehouse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                نظام المخازن
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                الإصدار 1.0
              </p>
            </div>
          </div>
        </div>

        {/* القائمة الرئيسية */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {filteredMenuItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                  القائمة الرئيسية
                </h3>
                
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isActive
                            ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-[1.02]'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 ml-3 transition-colors ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                          }`} />
                          <div className="flex-1 text-right">
                            <div className={`${isActive ? 'text-white' : ''}`}>
                              {item.label}
                            </div>
                            <div className={`text-xs ${
                              isActive ? 'text-gray-100' : 'text-gray-400'
                            }`}>
                              {item.labelEn}
                            </div>
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}

            {/* قائمة النظام */}
            {filteredSystemItems.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                  النظام
                </h3>
                
                {filteredSystemItems.map((item) => {
                  const Icon = item.icon;
                  const showBadge = item.badge && item.path === '/notifications' && unreadNotifications > 0;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <>
                        <div className="relative">
                          <Icon className="w-5 h-5 ml-3" />
                          {showBadge && (
                            <Badge
                              variant="destructive"
                              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0"
                            >
                              {unreadNotifications}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 text-right">
                          <div>{item.label}</div>
                          <div className="text-xs text-gray-400">{item.labelEn}</div>
                        </div>
                      </>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {/* معلومات المستخدم في أسفل الشريط الجانبي */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {state.currentUser?.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.currentUser?.role === 'admin' ? 'مدير النظام' :
                 state.currentUser?.role === 'manager' ? 'مدير' :
                 state.currentUser?.role === 'warehouse_keeper' ? 'أمين مخزن' :
                 state.currentUser?.role === 'accountant' ? 'محاسب' :
                 state.currentUser?.role === 'cashier' ? 'كاشير' :
                 'مستخدم'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
