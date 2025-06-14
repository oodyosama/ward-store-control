
import { useWarehouse } from '@/contexts/WarehouseContext';

export function useReportData() {
  const { state } = useWarehouse();

  const getStockReport = (selectedWarehouse: string) => {
    return state.items.map(item => {
      const stocks = state.stocks.filter(stock => 
        stock.itemId === item.id && 
        (selectedWarehouse === 'all' || stock.warehouseId === selectedWarehouse)
      );
      
      const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
      const availableQuantity = stocks.reduce((sum, stock) => sum + stock.availableQuantity, 0);
      const totalValue = stocks.reduce((sum, stock) => sum + stock.totalValue, 0);
      
      return {
        item,
        totalQuantity,
        availableQuantity,
        totalValue,
        status: totalQuantity === 0 ? 'نفد' : 
                totalQuantity <= item.minQuantity ? 'منخفض' : 'جيد'
      };
    });
  };

  const getMovementReport = (selectedWarehouse: string, dateFrom: string, dateTo: string) => {
    return state.transactions.filter(transaction => {
      const matchesWarehouse = selectedWarehouse === 'all' || transaction.warehouseId === selectedWarehouse;
      const matchesDate = (!dateFrom || transaction.createdAt >= new Date(dateFrom)) &&
                         (!dateTo || transaction.createdAt <= new Date(dateTo));
      return matchesWarehouse && matchesDate;
    });
  };

  const getLowStockReport = (selectedWarehouse: string) => {
    return getStockReport(selectedWarehouse).filter(data => 
      data.totalQuantity <= data.item.minQuantity && data.totalQuantity > 0
    );
  };

  const getExpiryReport = (selectedWarehouse: string) => {
    const today = new Date();
    const warningDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return state.stocks.filter(stock => {
      const matchesWarehouse = selectedWarehouse === 'all' || stock.warehouseId === selectedWarehouse;
      const hasExpiry = stock.expiryDate && stock.expiryDate <= warningDate;
      return matchesWarehouse && hasExpiry;
    }).map(stock => {
      const item = state.items.find(i => i.id === stock.itemId);
      const warehouse = state.warehouses.find(w => w.id === stock.warehouseId);
      return { stock, item, warehouse };
    });
  };

  const getCurrentReportData = (reportType: string, selectedWarehouse: string, dateFrom: string, dateTo: string) => {
    switch (reportType) {
      case 'stock':
        return getStockReport(selectedWarehouse);
      case 'movement':
        return getMovementReport(selectedWarehouse, dateFrom, dateTo);
      case 'low_stock':
        return getLowStockReport(selectedWarehouse);
      case 'expiry':
        return getExpiryReport(selectedWarehouse);
      default:
        return [];
    }
  };

  return {
    getCurrentReportData,
    state
  };
}
