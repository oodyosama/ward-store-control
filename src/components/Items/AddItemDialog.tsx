
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddItem } from '@/hooks/useItems';
import { useCategories } from '@/hooks/useCategories';

interface AddItemDialogProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

interface AddItemFormData {
  name: string;
  nameEn: string;
  sku: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  minQuantity: number;
  maxQuantity: number;
  description?: string;
}

export default function AddItemDialog({ isAddDialogOpen, setIsAddDialogOpen }: AddItemDialogProps) {
  const addItemMutation = useAddItem();
  const { data: categories } = useCategories();

  const form = useForm<AddItemFormData>({
    defaultValues: {
      name: '',
      nameEn: '',
      sku: '',
      categoryId: '',
      unit: '',
      unitPrice: 0,
      minQuantity: 0,
      maxQuantity: 0,
      description: ''
    }
  });

  const onSubmit = (data: AddItemFormData) => {
    const newItem = {
      name: data.name,
      nameEn: data.nameEn,
      description: data.description,
      sku: data.sku,
      categoryId: data.categoryId,
      unit: data.unit,
      minQuantity: data.minQuantity,
      maxQuantity: data.maxQuantity,
      unitPrice: data.unitPrice,
      isActive: true,
    };

    addItemMutation.mutate(newItem, {
      onSuccess: () => {
        form.reset();
        setIsAddDialogOpen(false);
      }
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsAddDialogOpen(false);
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">إضافة صنف جديد</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-right">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "اسم الصنف مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الصنف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الصنف" className="text-right" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم بالإنجليزية</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              rules={{ required: "رقم الصنف مطلوب" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الصنف</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU-001" className="text-right font-mono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              rules={{ required: "الفئة مطلوبة" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit"
                rules={{ required: "الوحدة مطلوبة" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوحدة</FormLabel>
                    <FormControl>
                      <Input placeholder="قطعة، كيلو، متر..." className="text-right" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                rules={{ 
                  required: "السعر مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون أكبر من صفر" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="text-right" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minQuantity"
                rules={{ 
                  required: "الحد الأدنى مطلوب",
                  min: { value: 0, message: "الحد الأدنى يجب أن يكون أكبر من أو يساوي صفر" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحد الأدنى</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        className="text-right" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxQuantity"
                rules={{ 
                  min: { value: 0, message: "الحد الأقصى يجب أن يكون أكبر من أو يساوي صفر" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحد الأقصى</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        className="text-right" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف الصنف..." className="text-right" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={addItemMutation.isPending}>
                إلغاء
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={addItemMutation.isPending}>
                {addItemMutation.isPending ? "جاري الإضافة..." : "إضافة الصنف"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
