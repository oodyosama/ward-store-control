
import React, { useState } from 'react';
import { FileText, Download, Printer, Calendar, TrendingUp, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function ReportsPage() {
  const { state } = useWarehouse();
  const [selectedReport, setSelectedReport] = useState('stock');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // تقارير متاحة
  const reportTypes = [
    {
      id: 'stock',
      name: 'تقرير المخزون الحالي',
      description: 'عرض جميع الأصناف والكميات المتوفرة',
      icon: Package,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'movement',
      name: 'تقرير الحركات',
      description: 'تفاصيل جميع حركات الوارد والصادر',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'low_stock',
      name: 'تقرير الأصناف المنخفضة',
      description: 'الأصناف التي وصلت للحد الأدنى',
      icon: AlertTriangle,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'expiry',
      name: 'تقرير انتهاء الصلاحية',
      description: 'الأصناف القريبة من انتهاء الصلاحية',
      icon: Calendar,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'turnover',
      name: 'تقرير معدل الدوران',
      description: 'معدل دوران الأصناف والأكثر حركة',
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  // بيانات تقرير المخزون الحالي
  const getStockReport = () => {
    return state.items.map(item => {
      const stocks = state.stocks.filter(stock => 
        stock.itemId === item.id && 
        (selectedWarehouse === 'all' || stock.warehouseId === selectedWarehouse)
      );
      
      const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      const availableQuantity = stocks.reduce((sum, stock) => sum + stock.availableQuantity, 0);
      const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);
      
      return {
        item,
        totalQuantity,
        availableQuantity,
        totalValue,
        status: totalQuantity === 0 ? 'نفد' : 
                totalQuantity <= item.minQuantity ? 'منخفض' : 'جيد'
      };
    });
  };

  // بيانات تقرير الحركات
  const getMovementReport = () => {
    return state.transactions.filter(transaction => {
      const matchesWarehouse = selectedWarehouse === 'all' || transaction.warehouseId === selectedWarehouse;
      const matchesDate = (!dateFrom || transaction.createdAt >= new Date(dateFrom)) &&
                         (!dateTo || transaction.createdAt <= new Date(dateTo));
      return matchesWarehouse && matchesDate;
    });
  };

  // بيانات تقرير الأصناف المنخفضة
  const getLowStockReport = () => {
    return getStockReport().filter(data => 
      data.totalQuantity <= data.item.minQuantity && data.totalQuantity > 0
    );
  };

  // بيانات تقرير انتهاء الصلاحية
  const getExpiryReport = () => {
    const today = new Date();
    const warningDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 يوم

    return state.stocks.filter(stock => {
      const matchesWarehouse = selectedWarehouse === 'all' || stock.warehouseId === selectedWarehouse;
      const hasExpiry = stock.expiryDate && stock.expiryDate <= warningDate;
      return matchesWarehouse && hasExpiry;
    }).map(stock => {
      const item = state.items.find(i => i.id === stock.itemId);
      const warehouse = state.warehouses.find(w => w.id === stock.warehouseId);
      return { stock, item, warehouse };
    });
  };

  // تصدير التقرير
  const exportReport = (format: 'excel' | 'pdf') => {
    console.log(`تصدير التقرير بصيغة ${format}`);
    // هنا يمكن إضافة منطق التصدير الفعلي
  };

  // طباعة التقرير
  const printReport = () => {
    window.print();
  };

  // عرض محتوى التقرير حسب النوع المختار
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'stock':
        const stockData = getStockReport();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">رقم الصنف</TableHead>
                <TableHead className="text-right">الكمية الإجمالية</TableHead>
                <TableHead className="text-right">الكمية المتاحة</TableHead>
                <TableHead className="text-right">القيمة الإجمالية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{data.item.name}</TableCell>
                  <TableCell className="text-right font-mono">{data.item.sku}</TableCell>
                  <TableCell className="text-right">{data.totalQuantity} {data.item.unit}</TableCell>
                  <TableCell className="text-right">{data.availableQuantity} {data.item.unit}</TableCell>
                  <TableCell className="text-right">{data.totalValue.toLocaleString()} ريال</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      data.status === 'جيد' ? 'default' :
                      data.status === 'منخفض' ? 'secondary' : 'destructive'
                    }>
                      {data.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'movement':
        const movementData = getMovementReport();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">القيمة</TableHead>
                <TableHead className="text-right">المرجع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movementData.map((transaction) => {
                const item = state.items.find(i => i.id === transaction.itemId);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-right">
                      {format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={
                        transaction.type === 'inbound' ? 'default' : 'destructive'
                      }>
                        {transaction.type === 'inbound' ? 'وارد' :
                         transaction.type === 'outbound' ? 'صادر' : 'تحويل'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item?.name}</TableCell>
                    <TableCell className="text-right">
                      {transaction.quantity} {item?.unit}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.totalValue.toLocaleString()} ريال
                    </TableCell>
                    <TableCell className="text-right">{transaction.reference}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      case 'low_stock':
        const lowStockData = getLowStockReport();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">الكمية الحالية</TableHead>
                <TableHead className="text-right">الحد الأدنى</TableHead>
                <TableHead className="text-right">المطلوب طلبه</TableHead>
                <TableHead className="text-right">الأولوية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{data.item.name}</TableCell>
                  <TableCell className="text-right">{data.totalQuantity} {data.item.unit}</TableCell>
                  <TableCell className="text-right">{data.item.minQuantity} {data.item.unit}</TableCell>
                  <TableCell className="text-right">
                    {Math.max(0, data.item.minQuantity - data.totalQuantity)} {data.item.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={data.totalQuantity === 0 ? 'destructive' : 'secondary'}>
                      {data.totalQuantity === 0 ? 'عاجل' : 'متوسط'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'expiry':
        const expiryData = getExpiryReport();
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">المخزن</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                <TableHead className="text-right">الأيام المتبقية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiryData.map((data, index) => {
                const daysRemaining = data.stock.expiryDate ? 
                  Math.ceil((data.stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="text-right">{data.item?.name}</TableCell>
                    <TableCell className="text-right">{data.warehouse?.name}</TableCell>
                    <TableCell className="text-right">{data.stock.quantity} {data.item?.unit}</TableCell>
                    <TableCell className="text-right">
                      {data.stock.expiryDate ? format(data.stock.expiryDate, 'dd/MM/yyyy', { locale: ar }) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={daysRemaining <= 7 ? 'destructive' : 'secondary'}>
                        {daysRemaining} يوم
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        );

      default:
        return <div className="text-center py-8 text-gray-500">اختر نوع التقرير لعرض البيانات</div>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">التقارير</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              تقارير شاملة حول المخزون والحركات
            </p>
          </div>
        </div>

        {/* أنواع التقارير */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card 
                key={report.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedReport === report.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${report.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-lg">{report.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* إعدادات التقرير */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات التقرير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>المخزن</Label>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المخازن</SelectItem>
                    {state.warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedReport === 'movement' && (
                <>
                  <div>
                    <Label>من تاريخ</Label>
                    <Input 
                      type="date" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>إلى تاريخ</Label>
                    <Input 
                      type="date" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-end space-x-2 rtl:space-x-reverse">
                <Button onClick={() => exportReport('excel')} variant="outline">
                  <Download className="w-4 h-4 ml-2" />
                  Excel
                </Button>
                <Button onClick={() => exportReport('pdf')} variant="outline">
                  <FileText className="w-4 h-4 ml-2" />
                  PDF
                </Button>
                <Button onClick={printReport} variant="outline">
                  <Printer className="w-4 h-4 ml-2" />
                  طباعة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* محتوى التقرير */}
        <Card>
          <CardHeader>
            <CardTitle>
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-table">
              {renderReportContent()}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
