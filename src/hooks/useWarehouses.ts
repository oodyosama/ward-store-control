
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Warehouse } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

export const useWarehouses = () => {
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(warehouse => ({
        id: warehouse.id,
        name: warehouse.name,
        nameEn: warehouse.name_en,
        code: warehouse.code,
        address: warehouse.address,
        manager: warehouse.manager,
        phone: warehouse.phone,
        email: warehouse.email,
        isActive: warehouse.is_active,
        capacity: warehouse.capacity,
        createdAt: new Date(warehouse.created_at),
      })) as Warehouse[];
    },
  });
};

export const useAddWarehouse = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newWarehouse: Omit<Warehouse, 'id' | 'createdAt'>) => {
      const warehouseData = {
        id: `wh_${Date.now()}`,
        name: newWarehouse.name,
        name_en: newWarehouse.nameEn,
        code: newWarehouse.code,
        address: newWarehouse.address,
        manager: newWarehouse.manager,
        phone: newWarehouse.phone,
        email: newWarehouse.email,
        is_active: newWarehouse.isActive,
        capacity: newWarehouse.capacity,
      };

      const { data, error } = await supabase
        .from('warehouses')
        .insert([warehouseData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({
        title: "تم إضافة المخزن بنجاح",
        description: `تم إضافة المخزن "${data.name}" بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إضافة المخزن",
        description: "حدث خطأ أثناء إضافة المخزن، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error('Error adding warehouse:', error);
    },
  });
};
