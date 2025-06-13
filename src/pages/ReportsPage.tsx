
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
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { state } = useWarehouse();
  const { toast } = useToast();
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

  const getMovementReport = () => {
    return state.transactions.filter(transaction => {
      const matchesWarehouse = selectedWarehouse === 'all' || transaction.warehouseId === selectedWarehouse;
      const matchesDate = (!dateFrom || transaction.createdAt >= new Date(dateFrom)) &&
                         (!dateTo || transaction.createdAt <= new Date(dateTo));
      return matchesWarehouse && matchesDate;
    });
  };

  const getLowStockReport = () => {
    return getStockReport().filter(data => 
      data.totalQuantity <= data.item.minQuantity && data.totalQuantity > 0
    );
  };

  const getExpiryReport = () => {
    const today = new Date();
    const warningDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

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

  // Get current report data
  const getCurrentReportData = () => {
    switch (selectedReport) {
      case 'stock':
        return getStockReport();
      case 'movement':
        return getMovementReport();
      case 'low_stock':
        return getLowStockReport();
      case 'expiry':
        return getExpiryReport();
      default:
        return [];
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const data = getCurrentReportData();
      let worksheetData: any[] = [];
      
      switch (selectedReport) {
        case 'stock':
          const stockData = data as ReturnType<typeof getStockReport>;
          worksheetData = stockData.map(item => ({
            'الصنف': item.item.name,
            'رقم الصنف': item.item.sku,
            'الكمية الإجمالية': `${item.totalQuantity} ${item.item.unit}`,
            'الكمية المتاحة': `${item.availableQuantity} ${item.item.unit}`,
            'القيمة الإجمالية': `${item.totalValue.toLocaleString()} ريال`,
            'الحالة': item.status
          }));
          break;
          
        case 'movement':
          const movementData = data as ReturnType<typeof getMovementReport>;
          worksheetData = movementData.map(transaction => {
            const item = state.items.find(i => i.id === transaction.itemId);
            return {
              'التاريخ': format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar }),
              'النوع': transaction.type === 'inbound' ? 'وارد' : transaction.type === 'outbound' ? 'صادر' : 'تحويل',
              'الصنف': item?.name || '',
              'الكمية': `${transaction.quantity} ${item?.unit || ''}`,
              'القيمة': `${transaction.totalValue.toLocaleString()} ريال`,
              'المرجع': transaction.reference
            };
          });
          break;
          
        case 'low_stock':
          const lowStockData = data as ReturnType<typeof getLowStockReport>;
          worksheetData = lowStockData.map(item => ({
            'الصنف': item.item.name,
            'الكمية الحالية': `${item.totalQuantity} ${item.item.unit}`,
            'الحد الأدنى': `${item.item.minQuantity} ${item.item.unit}`,
            'المطلوب طلبه': `${Math.max(0, item.item.minQuantity - item.totalQuantity)} ${item.item.unit}`,
            'الأولوية': item.totalQuantity === 0 ? 'عاجل' : 'متوسط'
          }));
          break;
          
        case 'expiry':
          const expiryData = data as ReturnType<typeof getExpiryReport>;
          worksheetData = expiryData.map(item => {
            const daysRemaining = item.stock.expiryDate ? 
              Math.ceil((item.stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
            return {
              'الصنف': item.item?.name || '',
              'المخزن': item.warehouse?.name || '',
              'الكمية': `${item.stock.quantity} ${item.item?.unit || ''}`,
              'تاريخ الانتهاء': item.stock.expiryDate ? format(item.stock.expiryDate, 'dd/MM/yyyy', { locale: ar }) : '-',
              'الأيام المتبقية': `${daysRemaining} يوم`
            };
          });
          break;
      }

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'تقرير';
      
      XLSX.utils.book_append_sheet(workbook, worksheet, reportName);
      XLSX.writeFile(workbook, `${reportName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast({
        title: "تم تصدير التقرير بنجاح",
        description: "تم تنزيل ملف Excel بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تصدير التقرير",
        description: "حدث خطأ أثناء تصدير التقرير إلى Excel",
        variant: "destructive"
      });
      console.error('Excel export error:', error);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const data = getCurrentReportData();
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'تقرير';
      
      // Set font for Arabic support (you might need to add Arabic font)
      doc.setFontSize(16);
      doc.text(reportName, 20, 20);
      doc.setFontSize(12);
      doc.text(`تاريخ التقرير: ${format(new Date(), 'dd/MM/yyyy', { locale: ar })}`, 20, 35);

      let tableData: any[] = [];
      let headers: string[] = [];

      switch (selectedReport) {
        case 'stock':
          const stockData = data as ReturnType<typeof getStockReport>;
          headers = ['الصنف', 'رقم الصنف', 'الكمية الإجمالية', 'الكمية المتاحة', 'القيمة الإجمالية', 'الحالة'];
          tableData = stockData.map(item => [
            item.item.name,
            item.item.sku,
            `${item.totalQuantity} ${item.item.unit}`,
            `${item.availableQuantity} ${item.item.unit}`,
            `${item.totalValue.toLocaleString()} ريال`,
            item.status
          ]);
          break;
          
        case 'movement':
          const movementData = data as ReturnType<typeof getMovementReport>;
          headers = ['التاريخ', 'النوع', 'الصنف', 'الكمية', 'القيمة', 'المرجع'];
          tableData = movementData.map(transaction => {
            const item = state.items.find(i => i.id === transaction.itemId);
            return [
              format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar }),
              transaction.type === 'inbound' ? 'وارد' : transaction.type === 'outbound' ? 'صادر' : 'تحويل',
              item?.name || '',
              `${transaction.quantity} ${item?.unit || ''}`,
              `${transaction.totalValue.toLocaleString()} ريال`,
              transaction.reference
            ];
          });
          break;
          
        case 'low_stock':
          const lowStockData = data as ReturnType<typeof getLowStockReport>;
          headers = ['الصنف', 'الكمية الحالية', 'الحد الأدنى', 'المطلوب طلبه', 'الأولوية'];
          tableData = lowStockData.map(item => [
            item.item.name,
            `${item.totalQuantity} ${item.item.unit}`,
            `${item.item.minQuantity} ${item.item.unit}`,
            `${Math.max(0, item.item.minQuantity - item.totalQuantity)} ${item.item.unit}`,
            item.totalQuantity === 0 ? 'عاجل' : 'متوسط'
          ]);
          break;
          
        case 'expiry':
          const expiryData = data as ReturnType<typeof getExpiryReport>;
          headers = ['الصنف', 'المخزن', 'الكمية', 'تاريخ الانتهاء', 'الأيام المتبقية'];
          tableData = expiryData.map(item => {
            const daysRemaining = item.stock.expiryDate ? 
              Math.ceil((item.stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
            return [
              item.item?.name || '',
              item.warehouse?.name || '',
              `${item.stock.quantity} ${item.item?.unit || ''}`,
              item.stock.expiryDate ? format(item.stock.expiryDate, 'dd/MM/yyyy', { locale: ar }) : '-',
              `${daysRemaining} يوم`
            ];
          });
          break;
      }

      (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: 50,
        styles: {
          font: 'helvetica',
          fontSize: 10,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
        },
      });

      doc.save(`${reportName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "تم تصدير التقرير بنجاح",
        description: "تم تنزيل ملف PDF بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في تصدير التقرير",
        description: "حدث خطأ أثناء تصدير التقرير إلى PDF",
        variant: "destructive"
      });
      console.error('PDF export error:', error);
    }
  };

  // Updated export function
  const exportReport = (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      exportToExcel();
    } else if (format === 'pdf') {
      exportToPDF();
    }
  };

  // Print report
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
