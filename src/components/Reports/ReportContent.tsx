
import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ReportContentProps {
  reportType: string;
  data: any[];
  items: any[];
}

export default function ReportContent({ reportType, data, items }: ReportContentProps) {
  const renderContent = () => {
    switch (reportType) {
      case 'stock':
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
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{item.item.name}</TableCell>
                  <TableCell className="text-right font-mono">{item.item.sku}</TableCell>
                  <TableCell className="text-right">{item.totalQuantity} {item.item.unit}</TableCell>
                  <TableCell className="text-right">{item.availableQuantity} {item.item.unit}</TableCell>
                  <TableCell className="text-right">{item.totalValue.toLocaleString()} ريال</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      item.status === 'جيد' ? 'default' :
                      item.status === 'منخفض' ? 'secondary' : 'destructive'
                    }>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'movement':
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
              {data.map((transaction) => {
                const item = items.find(i => i.id === transaction.itemId);
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
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-right">{item.item.name}</TableCell>
                  <TableCell className="text-right">{item.totalQuantity} {item.item.unit}</TableCell>
                  <TableCell className="text-right">{item.item.minQuantity} {item.item.unit}</TableCell>
                  <TableCell className="text-right">
                    {Math.max(0, item.item.minQuantity - item.totalQuantity)} {item.item.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.totalQuantity === 0 ? 'destructive' : 'secondary'}>
                      {item.totalQuantity === 0 ? 'عاجل' : 'متوسط'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );

      case 'expiry':
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
              {data.map((item, index) => {
                const daysRemaining = item.stock.expiryDate ? 
                  Math.ceil((item.stock.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="text-right">{item.item?.name}</TableCell>
                    <TableCell className="text-right">{item.warehouse?.name}</TableCell>
                    <TableCell className="text-right">{item.stock.quantity} {item.item?.unit}</TableCell>
                    <TableCell className="text-right">
                      {item.stock.expiryDate ? format(item.stock.expiryDate, 'dd/MM/yyyy', { locale: ar }) : '-'}
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
    <div className="responsive-table">
      {renderContent()}
    </div>
  );
}
