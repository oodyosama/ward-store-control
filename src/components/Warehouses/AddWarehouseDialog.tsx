
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAddWarehouse } from '@/hooks/useWarehouses';

interface AddWarehouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddWarehouseDialog({ isOpen, onOpenChange }: AddWarehouseDialogProps) {
  const addWarehouse = useAddWarehouse();
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    code: '',
    capacity: '',
    address: '',
    manager: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.address || !formData.manager) {
      return;
    }

    await addWarehouse.mutateAsync({
      name: formData.name,
      nameEn: formData.nameEn || undefined,
      code: formData.code,
      address: formData.address,
      manager: formData.manager,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      isActive: true,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
    });

    setFormData({
      name: '',
      nameEn: '',
      code: '',
      capacity: '',
      address: '',
      manager: '',
      phone: '',
      email: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة مخزن جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">اسم المخزن</Label>
              <Input 
                id="name" 
                placeholder="المخزن الرئيسي" 
                className="text-right"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nameEn">الاسم بالإنجليزية</Label>
              <Input 
                id="nameEn" 
                placeholder="Main Warehouse"
                value={formData.nameEn}
                onChange={(e) => handleInputChange('nameEn', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">رمز المخزن</Label>
              <Input 
                id="code" 
                placeholder="WH001" 
                className="text-right font-mono"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="capacity">السعة التخزينية</Label>
              <Input 
                id="capacity" 
                type="number" 
                placeholder="10000" 
                className="text-right"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Textarea 
              id="address" 
              placeholder="أدخل العنوان الكامل للمخزن" 
              className="text-right"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager">مدير المخزن</Label>
              <Input 
                id="manager" 
                placeholder="أحمد محمد" 
                className="text-right"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input 
                id="phone" 
                placeholder="+966501234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="warehouse@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleSubmit}
              disabled={addWarehouse.isPending}
            >
              {addWarehouse.isPending ? 'جاري الإضافة...' : 'إضافة المخزن'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
