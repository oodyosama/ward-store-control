
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export const exportToExcel = (data: any[], reportName: string, reportType: string) => {
  let worksheetData: any[] = [];
  
  switch (reportType) {
    case 'stock':
      worksheetData = data.map(item => ({
        'الصنف': item.item.name,
        'رقم الصنف': item.item.sku,
        'الكمية الإجمالية': `${item.totalQuantity} ${item.item.unit}`,
        'الكمية المتاحة': `${item.availableQuantity} ${item.item.unit}`,
        'القيمة الإجمالية': `${item.totalValue.toLocaleString()} ريال`,
        'الحالة': item.status
      }));
      break;
      
    case 'movement':
      worksheetData = data.map(transaction => ({
        'التاريخ': format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar }),
        'النوع': transaction.type === 'inbound' ? 'وارد' : transaction.type === 'outbound' ? 'صادر' : 'تحويل',
        'الصنف': transaction.itemName || '',
        'الكمية': `${transaction.quantity} ${transaction.itemUnit || ''}`,
        'القيمة': `${transaction.totalValue.toLocaleString()} ريال`,
        'المرجع': transaction.reference
      }));
      break;
      
    case 'low_stock':
      worksheetData = data.map(item => ({
        'الصنف': item.item.name,
        'الكمية الحالية': `${item.totalQuantity} ${item.item.unit}`,
        'الحد الأدنى': `${item.item.minQuantity} ${item.item.unit}`,
        'المطلوب طلبه': `${Math.max(0, item.item.minQuantity - item.totalQuantity)} ${item.item.unit}`,
        'الأولوية': item.totalQuantity === 0 ? 'عاجل' : 'متوسط'
      }));
      break;
      
    case 'expiry':
      worksheetData = data.map(item => {
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
  
  XLSX.utils.book_append_sheet(workbook, worksheet, reportName);
  XLSX.writeFile(workbook, `${reportName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export const exportToPDF = (data: any[], reportName: string, reportType: string) => {
  const doc = new jsPDF();
  
  // Set font for Arabic support
  doc.setFontSize(16);
  doc.text(reportName, 20, 20);
  doc.setFontSize(12);
  doc.text(`تاريخ التقرير: ${format(new Date(), 'dd/MM/yyyy', { locale: ar })}`, 20, 35);

  let tableData: any[] = [];
  let headers: string[] = [];

  switch (reportType) {
    case 'stock':
      headers = ['الصنف', 'رقم الصنف', 'الكمية الإجمالية', 'الكمية المتاحة', 'القيمة الإجمالية', 'الحالة'];
      tableData = data.map(item => [
        item.item.name,
        item.item.sku,
        `${item.totalQuantity} ${item.item.unit}`,
        `${item.availableQuantity} ${item.item.unit}`,
        `${item.totalValue.toLocaleString()} ريال`,
        item.status
      ]);
      break;
      
    case 'movement':
      headers = ['التاريخ', 'النوع', 'الصنف', 'الكمية', 'القيمة', 'المرجع'];
      tableData = data.map(transaction => [
        format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar }),
        transaction.type === 'inbound' ? 'وارد' : transaction.type === 'outbound' ? 'صادر' : 'تحويل',
        transaction.itemName || '',
        `${transaction.quantity} ${transaction.itemUnit || ''}`,
        `${transaction.totalValue.toLocaleString()} ريال`,
        transaction.reference
      ]);
      break;
      
    case 'low_stock':
      headers = ['الصنف', 'الكمية الحالية', 'الحد الأدنى', 'المطلوب طلبه', 'الأولوية'];
      tableData = data.map(item => [
        item.item.name,
        `${item.totalQuantity} ${item.item.unit}`,
        `${item.item.minQuantity} ${item.item.unit}`,
        `${Math.max(0, item.item.minQuantity - item.totalQuantity)} ${item.item.unit}`,
        item.totalQuantity === 0 ? 'عاجل' : 'متوسط'
      ]);
      break;
      
    case 'expiry':
      headers = ['الصنف', 'المخزن', 'الكمية', 'تاريخ الانتهاء', 'الأيام المتبقية'];
      tableData = data.map(item => {
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

  doc.autoTable({
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
};
