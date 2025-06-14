
import React from 'react';
import { Users } from 'lucide-react';
import { useWarehouse } from '@/contexts/WarehouseContext';

export default function SidebarFooter() {
  const { state } = useWarehouse();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير النظام';
      case 'manager': return 'مدير';
      case 'warehouse_keeper': return 'أمين مخزن';
      case 'accountant': return 'محاسب';
      case 'cashier': return 'كاشير';
      default: return 'مستخدم';
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {state.currentUser?.username || 'مستخدم'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getRoleLabel(state.currentUser?.role || 'user')}
          </p>
        </div>
      </div>
    </div>
  );
}
