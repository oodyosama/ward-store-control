
import React from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, Warehouse, Activity, DollarSign } from 'lucide-react';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const { state } = useWarehouse();

  // بيانات تجريبية للمخططات
  const monthlyData = [
    { month: 'يناير', inbound: 150, outbound: 120, value: 45000 },
    { month: 'فبراير', inbound: 180, outbound: 140, value: 52000 },
    { month: 'مارس', inbound: 220, outbound: 160, value: 61000 },
    { month: 'أبريل', inbound: 200, outbound: 180, value: 58000 },
    { month: 'مايو', inbound: 250, outbound: 200, value: 68000 },
    { month: 'يونيو', inbound: 300, outbound: 220, value: 75000 },
  ];

  const categoryData = [
    { name: 'مواد غذائية', value: 35, color: '#3b82f6' },
    { name: 'إلكترونيات', value: 25, color: '#10b981' },
    { name: 'منظفات', value: 20, color: '#f59e0b' },
    { name: 'أدوية', value: 15, color: '#ef4444' },
    { name: 'أخرى', value: 5, color: '#8b5cf6' },
  ];

  const warehousePerformance = state.warehouses.map((warehouse, index) => ({
    name: warehouse.name,
    efficiency: 75 + (index * 5),
    utilization: 60 + (index * 8),
    transactions: 120 + (index * 30),
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* عنوان الصفحة */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              التحليلات والإحصائيات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              تحليل شامل لأداء المخازن والحركات
            </p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-500" />
        </div>

        {/* المؤشرات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">كفاءة المخزون</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+2.5% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الدوران</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.3</div>
              <p className="text-xs text-muted-foreground">+1.2 من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط وقت التخزين</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18 يوم</div>
              <p className="text-xs text-muted-foreground">-3 أيام من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عائد الاستثمار</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.5%</div>
              <p className="text-xs text-muted-foreground">+4.2% من الشهر الماضي</p>
            </CardContent>
          </Card>
        </div>

        {/* المخططات الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* مخطط الحركات الشهرية */}
          <Card>
            <CardHeader>
              <CardTitle>الحركات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inbound" fill="#3b82f6" name="وارد" />
                  <Bar dataKey="outbound" fill="#ef4444" name="صادر" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* مخطط القيم المالية */}
          <Card>
            <CardHeader>
              <CardTitle>تطور القيم المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="القيمة (ريال)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* المخططات الثانوية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* توزيع الفئات */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع الأصناف حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* أداء المخازن */}
          <Card>
            <CardHeader>
              <CardTitle>أداء المخازن</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={warehousePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#3b82f6" name="الكفاءة %" />
                  <Bar dataKey="utilization" fill="#10b981" name="الاستغلال %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* جدول الأداء التفصيلي */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل أداء المخازن</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 font-medium">اسم المخزن</th>
                    <th className="pb-3 font-medium">الكفاءة</th>
                    <th className="pb-3 font-medium">الاستغلال</th>
                    <th className="pb-3 font-medium">عدد الحركات</th>
                    <th className="pb-3 font-medium">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {warehousePerformance.map((warehouse, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{warehouse.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          warehouse.efficiency >= 85 ? 'bg-green-100 text-green-800' :
                          warehouse.efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {warehouse.efficiency}%
                        </span>
                      </td>
                      <td className="py-3">{warehouse.utilization}%</td>
                      <td className="py-3">{warehouse.transactions}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          warehouse.efficiency >= 85 ? 'bg-green-100 text-green-800' :
                          warehouse.efficiency >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {warehouse.efficiency >= 85 ? 'ممتاز' :
                           warehouse.efficiency >= 70 ? 'جيد' : 'يحتاج تحسين'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
