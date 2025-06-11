
import React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Warehouse } from '@/types/warehouse';

interface WarehouseStatsProps {
  warehouses: Warehouse[];
  totalStockQuantity: number;
  totalStockValue: number;
}

export default function WarehouseStats({ warehouses, totalStockQuantity, totalStockValue }: WarehouseStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">{warehouses.length}</p>
              <p className="text-sm text-gray-600">إجمالي المخازن</p>
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
                {warehouses.filter(w => w.isActive).length}
              </p>
              <p className="text-sm text-gray-600">مخازن نشطة</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Package className="w-6 h-6" />
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">
                {totalStockQuantity.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">إجمالي المخزون</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <span className="w-6 h-6 block">₪</span>
            </div>
            <div className="mr-4 text-right">
              <p className="text-2xl font-bold">
                {totalStockValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">القيمة الإجمالية</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
