
import React, { useState } from 'react';
import { FileText, Calendar, TrendingUp, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useReportData } from '@/hooks/useReportData';
import { exportToExcel, exportToPDF } from '@/utils/reportExports';
import ReportTypeCard from '@/components/Reports/ReportTypeCard';
import ReportFilters from '@/components/Reports/ReportFilters';
import ReportContent from '@/components/Reports/ReportContent';

export default function ReportsPage() {
  const { getCurrentReportData, state } = useReportData();
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

  const handleExportExcel = () => {
    try {
      const data = getCurrentReportData(selectedReport, selectedWarehouse, dateFrom, dateTo);
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'تقرير';
      
      exportToExcel(data, reportName, selectedReport);
      
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

  const handleExportPDF = () => {
    try {
      const data = getCurrentReportData(selectedReport, selectedWarehouse, dateFrom, dateTo);
      const reportName = reportTypes.find(r => r.id === selectedReport)?.name || 'تقرير';
      
      exportToPDF(data, reportName, selectedReport);
      
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

  const handlePrint = () => {
    window.print();
  };

  const reportData = getCurrentReportData(selectedReport, selectedWarehouse, dateFrom, dateTo);

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
          {reportTypes.map((report) => (
            <ReportTypeCard
              key={report.id}
              report={report}
              isSelected={selectedReport === report.id}
              onClick={() => setSelectedReport(report.id)}
            />
          ))}
        </div>

        {/* إعدادات التقرير */}
        <ReportFilters
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
          warehouses={state.warehouses}
          selectedReport={selectedReport}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          onPrint={handlePrint}
        />

        {/* محتوى التقرير */}
        <Card>
          <CardHeader>
            <CardTitle>
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReportContent
              reportType={selectedReport}
              data={reportData}
              items={state.items}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
