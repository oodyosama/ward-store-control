
import React from 'react';
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Notification, DashboardStats } from '@/types/warehouse';

interface NotificationsPanelProps {
  notifications: Notification[];
  dashboardStats: DashboardStats;
}

export default function NotificationsPanel({ notifications, dashboardStats }: NotificationsPanelProps) {
  const navigate = useNavigate();

  return (
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
  );
}
