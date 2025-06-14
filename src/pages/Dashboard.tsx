
import React from 'react';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useAuth } from '@/hooks/useAuth';
import DashboardWelcome from '@/components/Dashboard/DashboardWelcome';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import NotificationsPanel from '@/components/Dashboard/NotificationsPanel';
import QuickActions from '@/components/Dashboard/QuickActions';

export default function Dashboard() {
  const { state } = useWarehouse();
  const { user } = useAuth();
  const { dashboardStats, recentTransactions, notifications } = state;

  if (!dashboardStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ترحيب */}
      <DashboardWelcome username={user?.username || 'مستخدم'} />

      {/* الإحصائيات الرئيسية */}
      <DashboardStats dashboardStats={dashboardStats} />

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الحركات الأخيرة */}
        <div className="lg:col-span-2">
          <RecentTransactions 
            transactions={recentTransactions} 
            items={state.items} 
            warehouses={state.warehouses} 
          />
        </div>

        {/* الإشعارات والتنبيهات */}
        <NotificationsPanel 
          notifications={notifications} 
          dashboardStats={dashboardStats} 
        />
      </div>

      {/* إجراءات سريعة */}
      <QuickActions />
    </div>
  );
}
