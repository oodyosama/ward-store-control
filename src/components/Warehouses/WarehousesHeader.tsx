
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WarehousesHeaderProps {
  onAddWarehouse: () => void;
}

export default function WarehousesHeader({ onAddWarehouse }: WarehousesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة المخازن</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          إدارة المخازن والفروع والمواقع
        </p>
      </div>
      
      <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
        <Button onClick={onAddWarehouse} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مخزن جديد
        </Button>
      </div>
    </div>
  );
}
