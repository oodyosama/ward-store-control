
import React from 'react';
import { TrendingUp, TrendingDown, ArrowRightLeft, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/types/warehouse';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  const totalInbound = transactions
    .filter(t => t.type === 'inbound')
    .reduce((sum, t) => sum + t.totalValue, 0);
  
  const totalOutbound = transactions
    .filter(t => t.type === 'outbound')
    .reduce((sum, t) => sum + t.totalValue, 0);
  
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{totalInbound.toLocaleString()}</p>
              <p className="text-sm text-gray-600">إجمالي الوارد</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{totalOutbound.toLocaleString()}</p>
              <p className="text-sm text-gray-600">إجمالي الصادر</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{transactions.length}</p>
              <p className="text-sm text-gray-600">إجمالي الحركات</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{pendingTransactions}</p>
              <p className="text-sm text-gray-600">حركات معلقة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
