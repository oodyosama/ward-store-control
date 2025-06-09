
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import ItemsStats from '@/components/Items/ItemsStats';
import ItemsSearchFilter from '@/components/Items/ItemsSearchFilter';
import ItemsTable from '@/components/Items/ItemsTable';
import AddItemDialog from '@/components/Items/AddItemDialog';
import QRCodeDialog from '@/components/Items/QRCodeDialog';

export default function ItemsPage() {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // تصفية الأصناف
  const filteredItems = state.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // الحصول على كمية المخزون لكل صنف
  const getItemStock = (itemId: string) => {
    return state.stocks
      .filter(stock => stock.itemId === itemId)
      .reduce((total, stock) => total + stock.availableQuantity, 0);
  };

  // تحديد حالة المخزون
  const getStockStatus = (item: any) => {
    const totalStock = getItemStock(item.id);
    if (totalStock === 0) return { status: 'out', label: 'نفد', color: 'bg-red-500' };
    if (totalStock <= item.minQuantity) return { status: 'low', label: 'منخفض', color: 'bg-yellow-500' };
    return { status: 'good', label: 'جيد', color: 'bg-green-500' };
  };

  const showQRCode = (item: any) => {
    setSelectedItem(item);
    setIsQRDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الأصناف</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة وتتبع جميع الأصناف في المخازن
            </p>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة صنف جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <ItemsStats getItemStock={getItemStock} getStockStatus={getStockStatus} />

        {/* أدوات البحث والتصفية */}
        <ItemsSearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* جدول الأصناف */}
        <ItemsTable
          filteredItems={filteredItems}
          getItemStock={getItemStock}
          getStockStatus={getStockStatus}
          showQRCode={showQRCode}
        />

        {/* نافذة إضافة صنف جديد */}
        <AddItemDialog
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />

        {/* نافذة عرض QR Code */}
        <QRCodeDialog
          isQRDialogOpen={isQRDialogOpen}
          setIsQRDialogOpen={setIsQRDialogOpen}
          selectedItem={selectedItem}
        />
      </div>
    </Layout>
  );
}
