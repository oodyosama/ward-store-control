
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X,
  Check,
  Archive,
  Trash2,
  Filter
} from 'lucide-react';
import { Notification } from '@/contexts/types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function NotificationsPage() {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const notifications = state.notifications || [];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    
    return matchesSearch && matchesType && matchesPriority && matchesReadStatus;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return AlertTriangle;
      case 'expiry_warning':
        return AlertTriangle;
      case 'negative_stock':
        return AlertTriangle;
      case 'system':
        return Info;
      case 'user_action':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadgeVariant = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
        return 'مخزون منخفض';
      case 'expiry_warning':
        return 'تحذير انتهاء صلاحية';
      case 'negative_stock':
        return 'مخزون سالب';
      case 'system':
        return 'النظام';
      case 'user_action':
        return 'إجراء مستخدم';
      default:
        return type;
    }
  };

  const getPriorityLabel = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'حرج';
      case 'high':
        return 'عالي';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return priority;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Marking notification as read:', notificationId);
    // In real app, this would update the notification in the context/API
  };

  const handleMarkAllAsRead = () => {
    console.log('Marking all notifications as read');
    // In real app, this would update all notifications
  };

  const handleDeleteNotification = (notificationId: string) => {
    console.log('Deleting notification:', notificationId);
    // In real app, this would delete the notification
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              الإشعارات
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              إدارة وعرض جميع الإشعارات والتنبيهات
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-4 h-4 mr-2" />
              تسمية الكل كمقروء
            </Button>
          </div>
        </div>

        {/* إحصائيات الإشعارات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإشعارات</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">غير المقروءة</CardTitle>
              <Bell className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حرجة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عالية الأولوية</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{highPriorityCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* عوامل التصفية والبحث */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الإشعارات</CardTitle>
            <CardDescription>
              عرض وإدارة جميع الإشعارات والتنبيهات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ابحث في الإشعارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="نوع الإشعار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="low_stock">مخزون منخفض</SelectItem>
                  <SelectItem value="expiry_warning">تحذير انتهاء صلاحية</SelectItem>
                  <SelectItem value="negative_stock">مخزون سالب</SelectItem>
                  <SelectItem value="system">النظام</SelectItem>
                  <SelectItem value="user_action">إجراء مستخدم</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأولويات</SelectItem>
                  <SelectItem value="critical">حرج</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showUnreadOnly ? "default" : "outline"}
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                غير المقروءة فقط
              </Button>
            </div>

            {/* قائمة الإشعارات */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    لا توجد إشعارات
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    لم يتم العثور على إشعارات تطابق المعايير المحددة
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const colorClass = getNotificationColor(notification.priority);
                  
                  return (
                    <Card key={notification.id} className={`${colorClass} ${!notification.isRead ? 'border-l-4' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 rtl:space-x-reverse flex-1">
                            <div className="flex-shrink-0">
                              <Icon className="w-5 h-5 mt-1" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                                    {getPriorityLabel(notification.priority)}
                                  </Badge>
                                  <Badge variant="outline">
                                    {getTypeLabel(notification.type)}
                                  </Badge>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {!notification.isRead && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>
                                  {format(notification.createdAt, 'EEEE، d MMMM yyyy - HH:mm', { locale: ar })}
                                </span>
                                {notification.isRead && notification.readAt && (
                                  <span>
                                    قُرئ في: {format(notification.readAt, 'HH:mm')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
