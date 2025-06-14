
import React from 'react';
import { Package, Warehouse, DollarSign, AlertTriangle, Calendar, Activity, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats as DashboardStatsType } from '@/types/warehouse';

interface StatsCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

interface DashboardStatsProps {
  dashboardStats: DashboardStatsType;
}

export default function DashboardStats({ dashboardStats }: DashboardStatsProps) {
  const statsCards: StatsCard[] = [
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

  return (
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
  );
}
