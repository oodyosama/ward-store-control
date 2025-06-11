
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Button } from '@/components/ui/button';
import WarehousesHeader from '@/components/Warehouses/WarehousesHeader';
import WarehouseStats from '@/components/Warehouses/WarehouseStats';
import WarehouseCard from '@/components/Warehouses/WarehouseCard';
import AddWarehouseDialog from '@/components/Warehouses/AddWarehouseDialog';

export default function WarehousesPage() {
  const { state } = useWarehouse();
  const { data: warehouses = [], isLoading } = useWarehouses();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // حساب إحصائيات المخازن
  const getWarehouseStats = (warehouseId: string) => {
    const warehouseStocks = state.stocks.filter(stock => stock.warehouseId === warehouseId);
    const totalItems = warehouseStocks.length;
    const totalValue = warehouseStocks.reduce((sum, stock) => sum + stock.totalValue, 0);
    const totalQuantity = warehouseStocks.reduce((sum, stock) => sum + stock.quantity, 0);
    
    return { totalItems, totalValue, totalQuantity };
  };

  // حساب إجمالي المخزون والقيمة
  const totalStockQuantity = state.stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const totalStockValue = state.stocks.reduce((sum, stock) => sum + stock.totalValue, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل المخازن...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <WarehousesHeader onAddWarehouse={() => setIsAddDialogOpen(true)} />

        {/* إحصائيات المخازن */}
        <WarehouseStats 
          warehouses={warehouses}
          totalStockQuantity={totalStockQuantity}
          totalStockValue={totalStockValue}
        />

        {/* قائمة المخازن */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => {
            const stats = getWarehouseStats(warehouse.id);
            
            return (
              <WarehouseCard 
                key={warehouse.id}
                warehouse={warehouse}
                stats={stats}
              />
            );
          })}
        </div>

        {warehouses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">لا توجد مخازن مضافة بعد</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4 bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول مخزن
            </Button>
          </div>
        )}

        {/* نافذة إضافة مخزن جديد */}
        <AddWarehouseDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </Layout>
  );
}
