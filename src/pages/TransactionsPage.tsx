
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useTransactions, useAddTransaction } from '@/hooks/useTransactions';
import { useItems } from '@/hooks/useItems';
import { useWarehouses } from '@/hooks/useWarehouses';
import { Transaction } from '@/types/warehouse';
import { TransactionsHeader } from '@/components/Transactions/TransactionsHeader';
import { TransactionStats } from '@/components/Transactions/TransactionStats';
import { TransactionFilters } from '@/components/Transactions/TransactionFilters';
import { TransactionsTable } from '@/components/Transactions/TransactionsTable';
import { AddTransactionDialog } from '@/components/Transactions/AddTransactionDialog';

export default function TransactionsPage() {
  const { state } = useWarehouse();
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: items = [] } = useItems();
  const { data: warehouses = [] } = useWarehouses();
  const { mutate: addTransaction, isPending } = useAddTransaction();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<Transaction['type']>('inbound');

  // تصفية الحركات
  const filteredTransactions = transactions.filter(transaction => {
    const item = items.find(i => i.id === transaction.itemId);
    const warehouse = warehouses.find(w => w.id === transaction.warehouseId);
    
    const matchesSearch = item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesWarehouse = selectedWarehouse === 'all' || transaction.warehouseId === selectedWarehouse;
    
    return matchesSearch && matchesType && matchesWarehouse;
  });

  const handleAddTransaction = (type: Transaction['type']) => {
    setTransactionType(type);
    setIsAddDialogOpen(true);
  };

  const handleTransactionSubmit = (newTransaction: Omit<Transaction, 'id' | 'createdAt' | 'completedAt'>) => {
    addTransaction(newTransaction, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      }
    });
  };

  if (isLoading) {
    return <Layout><div>جاري التحميل...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <TransactionsHeader onAddTransaction={handleAddTransaction} />
        
        <TransactionStats transactions={transactions} />

        <TransactionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
          warehouses={warehouses}
        />

        <TransactionsTable
          transactions={filteredTransactions}
          items={items}
          warehouses={warehouses}
        />

        <AddTransactionDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleTransactionSubmit}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          items={items}
          warehouses={warehouses}
          isPending={isPending}
        />
      </div>
    </Layout>
  );
}
