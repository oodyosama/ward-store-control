
import React from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/warehouse';

interface TransactionsHeaderProps {
  onAddTransaction: (type: Transaction['type']) => void;
}

export const TransactionsHeader: React.FC<TransactionsHeaderProps> = ({ onAddTransaction }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">حركات المخزون</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          تتبع جميع حركات الوارد والصادر والتحويلات
        </p>
      </div>
      
      <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
        <Button onClick={() => onAddTransaction('inbound')} 
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
          <TrendingUp className="w-4 h-4 ml-2" />
          حركة وارد
        </Button>
        <Button onClick={() => onAddTransaction('outbound')} 
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
          <TrendingDown className="w-4 h-4 ml-2" />
          حركة صادر
        </Button>
        <Button onClick={() => onAddTransaction('transfer')} 
                variant="outline">
          <ArrowRightLeft className="w-4 h-4 ml-2" />
          تحويل
        </Button>
      </div>
    </div>
  );
};
