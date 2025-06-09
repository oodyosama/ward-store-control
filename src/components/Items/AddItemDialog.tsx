
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddItemDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

export default function AddItemDialog({ isAddDialogOpen, setIsAddDialogOpen }: AddItemDialogProps) {
  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة صنف جديد</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          <div>
            <Label htmlFor="name">اسم الصنف</Label>
            <Input id="name" placeholder="أدخل اسم الصنف" className="text-right" />
          </div>
          <div>
            <Label htmlFor="nameEn">الاسم بالإنجليزية</Label>
            <Input id="nameEn" placeholder="Enter item name in English" />
          </div>
          <div>
            <Label htmlFor="sku">رقم الصنف</Label>
            <Input id="sku" placeholder="SKU-001" className="text-right font-mono" />
          </div>
          <div>
            <Label htmlFor="category">الفئة</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cat1">مواد خام</SelectItem>
                <SelectItem value="cat2">منتج نهائي</SelectItem>
                <SelectItem value="cat3">مواد تغليف</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">الوحدة</Label>
              <Input id="unit" placeholder="قطعة، كيلو، متر..." className="text-right" />
            </div>
            <div>
              <Label htmlFor="price">السعر</Label>
              <Input id="price" type="number" placeholder="0.00" className="text-right" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minQty">الحد الأدنى</Label>
              <Input id="minQty" type="number" placeholder="10" className="text-right" />
            </div>
            <div>
              <Label htmlFor="maxQty">الحد الأقصى</Label>
              <Input id="maxQty" type="number" placeholder="100" className="text-right" />
            </div>
          </div>
          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              إلغاء
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              إضافة الصنف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
