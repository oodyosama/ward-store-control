
import React from 'react';
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
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Transaction, Item, Warehouse } from '@/types/warehouse';

interface TransactionsTableProps {
  transactions: Transaction[];
  items: Item[];
  warehouses: Warehouse[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  items,
  warehouses
}) => {
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'inbound': return 'وارد';
      case 'outbound': return 'صادر';
      case 'transfer': return 'تحويل';
      case 'adjustment': return 'تسوية';
      case 'return': return 'مرتجع';
      default: return type;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'inbound': return 'bg-green-500';
      case 'outbound': return 'bg-red-500';
      case 'transfer': return 'bg-blue-500';
      case 'adjustment': return 'bg-yellow-500';
      case 'return': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>سجل الحركات ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="responsive-table">
          <Table>
            <TableHeader className="table-header">
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الصنف</TableHead>
                <TableHead className="text-right">المخزن</TableHead>
                <TableHead className="text-right">الكمية</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">القيمة الإجمالية</TableHead>
                <TableHead className="text-right">المرجع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const item = items.find(i => i.id === transaction.itemId);
                const warehouse = warehouses.find(w => w.id === transaction.warehouseId);
                
                return (
                  <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">
                          {format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(transaction.createdAt, 'HH:mm')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={`text-white ${getTransactionTypeColor(transaction.type)}`}>
                        {getTransactionTypeLabel(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p className="font-medium">{item?.name || 'غير معروف'}</p>
                        <p className="text-sm text-gray-500">{item?.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{warehouse?.name || 'غير معروف'}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${
                        transaction.type === 'inbound' ? 'text-green-600' : 
                        transaction.type === 'outbound' ? 'text-red-600' : 
                        'text-blue-600'
                      }`}>
                        {transaction.type === 'inbound' ? '+' : 
                         transaction.type === 'outbound' ? '-' : ''}
                        {transaction.quantity} {item?.unit || 'قطعة'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.unitPrice.toLocaleString()} ريال
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.totalValue.toLocaleString()} ريال
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.reference && (
                        <Badge variant="outline">{transaction.reference}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status === 'completed' ? 'مكتملة' :
                         transaction.status === 'pending' ? 'معلقة' : 'ملغية'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
