
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
  try {
    const doc = new (jsPDF as any)({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add title
    doc.setFontSize(16);
    doc.text(reportName, 20, 20);
    doc.setFontSize(12);
    doc.text(`Report Date: ${format(new Date(), 'dd/MM/yyyy')}`, 20, 35);

    let tableData: any[] = [];
    let headers: string[] = [];

    switch (reportType) {
      case 'stock':
        headers = ['Item', 'SKU', 'Total Qty', 'Available Qty', 'Total Value', 'Status'];
        tableData = data.map(item => [
          item.item.name,
          item.item.sku,
          `${item.totalQuantity} ${item.item.unit}`,
          `${item.availableQuantity} ${item.item.unit}`,
          `${item.totalValue.toLocaleString()} SAR`,
          item.status
        ]);
        break;
        
      case 'movement':
        headers = ['Date', 'Type', 'Item', 'Quantity', 'Value', 'Reference'];
        tableData = data.map(transaction => [
          format(transaction.createdAt, 'dd/MM/yyyy'),
          transaction.type === 'inbound' ? 'In' : transaction.type === 'outbound' ? 'Out' : 'Transfer',
          transaction.itemName || '',
          `${transaction.quantity} ${transaction.itemUnit || ''}`,
          `${transaction.totalValue.toLocaleString()} SAR`,
          transaction.reference
        ]);
        break;
        
      case 'low_stock':
        headers = ['Item', 'Current Qty', 'Min Qty', 'To Order', 'Priority'];
        tableData = data.map(item => [
          item.item.name,
          `${item.totalQuantity} ${item.item.unit}`,
          `${item.item.minQuantity} ${item.item.unit}`,
          `${Math.max(0, item.item.minQuantity - item.totalQuantity)} ${item.item.unit}`,
          item.totalQuantity === 0 ? 'Urgent' : 'Medium'
        ]);
        break;
        
      case 'expiry':
        headers = ['Item', 'Warehouse', 'Quantity', 'Expiry Date', 'Days Left'];
        tableData = data.map(item => {
          const daysRemaining = item.stock.expiryDate ? 
            Math.ceil((item.stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
          return [
            item.item?.name || '',
            item.warehouse?.name || '',
            `${item.stock.quantity} ${item.item?.unit || ''}`,
            item.stock.expiryDate ? format(item.stock.expiryDate, 'dd/MM/yyyy') : '-',
            `${daysRemaining} days`
          ];
        });
        break;
    }

    // Use autoTable plugin
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 50, left: 10, right: 10 }
    });

    doc.save(`${reportName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};
