
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Item } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        expiryDate: item.expiry_date ? new Date(item.expiry_date) : undefined,
      })) as Item[];
    },
  });
};

export const useAddItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
      const itemData = {
        id: `item_${Date.now()}`,
        name: newItem.name,
        name_en: newItem.nameEn,
        description: newItem.description,
        sku: newItem.sku,
        barcode: newItem.barcode,
        qr_code: newItem.qrCode,
        category_id: newItem.categoryId,
        unit: newItem.unit,
        min_quantity: newItem.minQuantity,
        max_quantity: newItem.maxQuantity,
        unit_price: newItem.unitPrice,
        expiry_date: newItem.expiryDate?.toISOString(),
        batch_number: newItem.batchNumber,
        supplier: newItem.supplier,
        location: newItem.location,
        images: newItem.images,
        is_active: newItem.isActive,
      };

      const { data, error } = await supabase
        .from('items')
        .insert([itemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "تم إضافة الصنف بنجاح",
        description: `تم إضافة الصنف "${data.name}" بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إضافة الصنف",
        description: "حدث خطأ أثناء إضافة الصنف، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error('Error adding item:', error);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updatedItem: Item) => {
      const { data, error } = await supabase
        .from('items')
        .update({
          name: updatedItem.name,
          name_en: updatedItem.nameEn,
          description: updatedItem.description,
          sku: updatedItem.sku,
          barcode: updatedItem.barcode,
          qr_code: updatedItem.qrCode,
          category_id: updatedItem.categoryId,
          unit: updatedItem.unit,
          min_quantity: updatedItem.minQuantity,
          max_quantity: updatedItem.maxQuantity,
          unit_price: updatedItem.unitPrice,
          expiry_date: updatedItem.expiryDate?.toISOString(),
          batch_number: updatedItem.batchNumber,
          supplier: updatedItem.supplier,
          location: updatedItem.location,
          images: updatedItem.images,
          is_active: updatedItem.isActive,
        })
        .eq('id', updatedItem.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "تم تحديث الصنف بنجاح",
        description: "تم حفظ التغييرات بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في تحديث الصنف",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
      console.error('Error updating item:', error);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items')
        .update({ is_active: false })
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "تم حذف الصنف بنجاح",
        description: "تم حذف الصنف من النظام",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حذف الصنف",
        description: "حدث خطأ أثناء حذف الصنف",
        variant: "destructive"
      });
      console.error('Error deleting item:', error);
    },
  });
};
