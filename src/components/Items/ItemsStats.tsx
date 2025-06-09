
import React from 'react';
import { QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useWarehouse } from '@/contexts/WarehouseContext';

interface ItemsStatsProps {
  getItemStock: (itemId: string) => number;
  getStockStatus: (item: any) => { status: string; label: string; color: string };
}

export default function ItemsStats({ getItemStock, getStockStatus }: ItemsStatsProps) {
  const { state } = useWarehouse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{state.items.length}</p>
              <p className="text-sm text-gray-600">إجمالي الأصناف</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="w-6 h-6 block">✓</span>
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">
                {state.items.filter(item => getStockStatus(item).status === 'good').length}
              </p>
              <p className="text-sm text-gray-600">أصناف متوفرة</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <span className="w-6 h-6 block">⚠</span>
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">
                {state.items.filter(item => getStockStatus(item).status === 'low').length}
              </p>
              <p className="text-sm text-gray-600">أصناف منخفضة</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <span className="w-6 h-6 block">✗</span>
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">
                {state.items.filter(item => getStockStatus(item).status === 'out').length}
              </p>
              <p className="text-sm text-gray-600">أصناف نافدة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
