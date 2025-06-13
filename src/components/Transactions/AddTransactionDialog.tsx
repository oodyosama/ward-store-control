
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction, Item, Warehouse } from '@/types/warehouse';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'>) => void;
  transactionType: Transaction['type'];
  setTransactionType: (type: Transaction['type']) => void;
  items: Item[];
  warehouses: Warehouse[];
  isPending: boolean;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  transactionType,
  setTransactionType,
  items,
  warehouses,
  isPending
}) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [selectedTargetWarehouse, setSelectedTargetWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

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

  const handleAddTransaction = () => {
    if (!selectedItem || !selectedWarehouseId || !quantity || !price) {
      return;
    }

    const quantityNum = parseInt(quantity);
    const priceNum = parseFloat(price);
    
    const newTransaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'> = {
      type: transactionType,
      itemId: selectedItem,
      warehouseId: selectedWarehouseId,
      targetWarehouseId: transactionType === 'transfer' ? selectedTargetWarehouse : undefined,
      quantity: quantityNum,
      unitPrice: priceNum,
      totalValue: quantityNum * priceNum,
      reference,
      notes,
      userId: 'user_demo',
      status: 'completed',
    };

    onAdd(newTransaction);
    
    // Reset form
    setSelectedItem('');
    setSelectedWarehouseId('');
    setSelectedTargetWarehouse('');
    setQuantity('');
    setPrice('');
    setReference('');
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right">
            إضافة حركة {getTransactionTypeLabel(transactionType)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          <div>
            <Label htmlFor="transactionType">نوع الحركة</Label>
            <Select value={transactionType} onValueChange={(value) => setTransactionType(value as Transaction['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbound">وارد</SelectItem>
                <SelectItem value="outbound">صادر</SelectItem>
                <SelectItem value="transfer">تحويل</SelectItem>
                <SelectItem value="adjustment">تسوية</SelectItem>
                <SelectItem value="return">مرتجع</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="item">الصنف</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الصنف" />
              </SelectTrigger>
              <SelectContent>
                {items.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="warehouse">المخزن</Label>
            <Select value={selectedWarehouseId} onValueChange={setSelectedWarehouseId}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المخزن" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {transactionType === 'transfer' && (
            <div>
              <Label htmlFor="targetWarehouse">إلى المخزن</Label>
              <Select value={selectedTargetWarehouse} onValueChange={setSelectedTargetWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المخزن المستهدف" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">الكمية</Label>
              <Input 
                id="quantity" 
                type="number" 
                placeholder="0" 
                className="text-right" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="price">السعر</Label>
              <Input 
                id="price" 
                type="number" 
                placeholder="0.00" 
                className="text-right" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="reference">المرجع</Label>
            <Input 
              id="reference" 
              placeholder="PO-001, SO-001..." 
              className="text-right" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea 
              id="notes" 
              placeholder="ملاحظات إضافية..." 
              className="text-right" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              onClick={handleAddTransaction}
              disabled={isPending}
              className={`${
                transactionType === 'inbound' ? 'bg-green-600 hover:bg-green-700' :
                transactionType === 'outbound' ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isPending ? 'جاري الإضافة...' : 'إضافة الحركة'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
