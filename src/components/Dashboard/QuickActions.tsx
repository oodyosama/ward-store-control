
import React from 'react';
import { Package, TrendingUp, Activity, Warehouse, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  path: string;
}

export default function QuickActions() {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    { label: 'إضافة صنف جديد', icon: Package, path: '/items' },
    { label: 'حركة وارد', icon: TrendingUp, path: '/transactions' },
    { label: 'حركة صادر', icon: Activity, path: '/transactions' },
    { label: 'تقرير المخزون', icon: Package, path: '/reports' },
    { label: 'جرد المخزن', icon: Warehouse, path: '/warehouses' },
    { label: 'ماسح الباركود', icon: Activity, path: '/scanner' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">إجراءات سريعة</CardTitle>
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
  );
}
