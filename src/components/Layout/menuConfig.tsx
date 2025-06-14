
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
  Archive,
  CreditCard
} from 'lucide-react';

export const menuItems = [
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
    permissions: ['pos_access', 'read']
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

export const systemItems = [
  {
    path: '/users',
    icon: Users,
    label: 'إدارة المستخدمين',
    labelEn: 'Users Management',
    adminOnly: false,
    permissions: ['read']
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
