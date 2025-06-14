
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Transaction, Item, Warehouse } from '@/types/warehouse';

interface RecentTransactionsProps {
  transactions: Transaction[];
  items: Item[];
  warehouses: Warehouse[];
}

export default function RecentTransactions({ transactions, items, warehouses }: RecentTransactionsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">الحركات الأخيرة</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
          عرض الكل
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions?.slice(0, 5).map((transaction) => {
            const item = items.find(i => i.id === transaction.itemId);
            const warehouse = warehouses.find(w => w.id === transaction.warehouseId);
            
            return (
              <div key={transaction.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'inbound' ? 'bg-green-100 text-green-600' :
                  transaction.type === 'outbound' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {transaction.type === 'inbound' ? '+' :
                   transaction.type === 'outbound' ? '-' : '↔'}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {warehouse?.name} • {transaction.quantity} {item?.unit}
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transaction.totalValue.toLocaleString()} ريال
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(transaction.createdAt, 'HH:mm')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
