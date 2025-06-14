
import { DashboardStats, Item, Transaction } from '@/types/warehouse';

export const calculateDashboardStats = (
  items: Item[],
  warehouses: any[],
  stocks: any[],
  transactions: Transaction[]
): DashboardStats => {
  return {
    totalItems: items.length,
    totalWarehouses: warehouses.filter(w => w.isActive).length,
    totalValue: stocks.reduce((sum, stock) => sum + stock.totalValue, 0),
    lowStockItems: items.filter(item => {
      const stock = stocks.find(s => s.itemId === item.id);
      return stock && stock.quantity <= item.minQuantity;
    }).length,
    expiringItems: stocks.filter(stock => {
      if (!stock.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((stock.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    recentTransactions: transactions.slice(0, 10),
    topMovingItems: items.slice(0, 5).map(item => {
      const movements = transactions.filter(t => t.itemId === item.id).length;
      return {
        item,
        totalMovement: movements
      };
    })
  };
};
