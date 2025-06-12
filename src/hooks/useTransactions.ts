
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(transaction => ({
        id: transaction.id,
        type: transaction.type as Transaction['type'],
        itemId: transaction.item_id,
        warehouseId: transaction.warehouse_id,
        targetWarehouseId: transaction.target_warehouse_id,
        quantity: transaction.quantity,
        unitPrice: transaction.unit_price,
        totalValue: transaction.total_value,
        batchNumber: transaction.batch_number,
        expiryDate: transaction.expiry_date ? new Date(transaction.expiry_date) : undefined,
        reference: transaction.reference,
        notes: transaction.notes,
        userId: transaction.user_id,
        status: transaction.status as Transaction['status'],
        createdAt: new Date(transaction.created_at),
        completedAt: transaction.completed_at ? new Date(transaction.completed_at) : undefined,
      })) as Transaction[];
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'>) => {
      const transactionData = {
        id: `trans_${Date.now()}`,
        type: newTransaction.type,
        item_id: newTransaction.itemId,
        warehouse_id: newTransaction.warehouseId,
        target_warehouse_id: newTransaction.targetWarehouseId,
        quantity: newTransaction.quantity,
        unit_price: newTransaction.unitPrice,
        total_value: newTransaction.totalValue,
        batch_number: newTransaction.batchNumber,
        expiry_date: newTransaction.expiryDate?.toISOString(),
        reference: newTransaction.reference,
        notes: newTransaction.notes,
        user_id: 'user_demo', // Default user for demo
        status: newTransaction.status,
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      toast({
        title: "تم إضافة الحركة بنجاح",
        description: `تم إضافة حركة ${data.type === 'inbound' ? 'الوارد' : 'الصادر'} بنجاح`,
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ في إضافة الحركة",
        description: "حدث خطأ أثناء إضافة الحركة، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error('Error adding transaction:', error);
    },
  });
};
