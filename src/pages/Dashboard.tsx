
import React from 'react';
import { Package, Warehouse, TrendingUp, AlertTriangle, DollarSign, Activity, Users, Calendar } from 'lucide-react';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useWarehouse();
  const { user } = useAuth();
  const { dashboardStats, recentTransactions, notifications } = state;
  const navigate = useNavigate();

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

  const statsCards = [
    {
      title: 'إجمالي الأصناف',
      value: dashboardStats.totalItems,
      icon: Package,
      color: 'from-blue-500 to-purple-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'المخازن النشطة',
      value: dashboardStats.totalWarehouses,
      icon: Warehouse,
      color: 'from-green-500 to-teal-600',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'قيمة المخزون',
      value: `${dashboardStats.totalValue.toLocaleString()} ريال`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'أصناف منخفضة',
      value: dashboardStats.lowStockItems,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      change: '+2',
      changeType: 'negative'
    },
    {
      title: 'منتهية الصلاحية',
      value: dashboardStats.expiringItems,
      icon: Calendar,
      color: 'from-purple-500 to-indigo-600',
      change: '0',
      changeType: 'neutral'
    },
    {
      title: 'حركات معلقة',
      value: dashboardStats.pendingTransactions,
      icon: Activity,
      color: 'from-indigo-500 to-blue-600',
      change: '0',
      changeType: 'neutral'
    }
  ];

  // قائمة الإجراءات السريعة مع الروابط
  const quickActions = [
    { label: 'إضافة صنف جديد', icon: Package, path: '/items' },
    { label: 'حركة وارد', icon: TrendingUp, path: '/transactions' },
    { label: 'حركة صادر', icon: Activity, path: '/transactions' },
    { label: 'تقرير المخزون', icon: Package, path: '/reports' },
    { label: 'جرد المخزن', icon: Warehouse, path: '/warehouses' },
    { label: 'ماسح الباركود', icon: Activity, path: '/scanner' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ترحيب */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              مرحباً، {user?.username || 'مستخدم'}
            </h1>
            <p className="text-blue-100 text-sm md:text-base">
              إليك نظرة سريعة على حالة المخازن اليوم
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-sm text-blue-100">اليوم</p>
            <p className="text-lg font-semibold">
              {format(new Date(), 'EEEE، d MMMM yyyy', { locale: ar })}
            </p>
          </div>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge
                    variant={
                      card.changeType === 'positive' ? 'default' :
                      card.changeType === 'negative' ? 'destructive' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {card.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* الحركات الأخيرة */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">الحركات الأخيرة</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
                عرض الكل
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions?.slice(0, 5).map((transaction) => {
                  const item = state.items.find(i => i.id === transaction.itemId);
                  const warehouse = state.warehouses.find(w => w.id === transaction.warehouseId);
                  
                  return (
                    <div key={transaction.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'inbound' ? 'bg-green-100 text-green-600' :
                        transaction.type === 'outbound' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'inbound' ? '+' :
                         transaction.type === 'outbound' ? '-' : '↔'}
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {warehouse?.name} • {transaction.quantity} {item?.unit}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {transaction.totalValue.toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(transaction.createdAt, 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الإشعارات والتنبيهات */}
        <div className="space-y-6">
          {/* الإشعارات */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">الإشعارات الأخيرة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border-r-4 ${
                    notification.priority === 'high' ? 'border-red-500 bg-red-50' :
                    notification.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 text-right">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(notification.createdAt, 'HH:mm')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/notifications')}>
                عرض جميع الإشعارات
              </Button>
            </CardContent>
          </Card>

          {/* الأصناف الأكثر حركة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">الأصناف الأكثر حركة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardStats.topMovingItems?.map((item, index) => (
                  <div key={item.item.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0">
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-sm">{item.item.name}</p>
                      <p className="text-xs text-gray-500">{item.totalMovement} حركة</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* إجراءات سريعة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">إجراءات سريعة</CodeTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-20 hover:shadow-md transition-all duration-200"
                  onClick={() => navigate(action.path)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
