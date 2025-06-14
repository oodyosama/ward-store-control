
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DashboardStats } from '@/types/warehouse';
import { WarehouseState, WarehouseContextType } from './types';
import { warehouseReducer } from './warehouseReducer';
import { mockWarehouses, mockItems, mockStocks, mockTransactions, mockNotifications, mockUser } from '@/data/mockData';
import { calculateDashboardStats } from '@/utils/dashboardUtils';

// تهيئة الحالة الابتدائية مع البيانات الوهمية
const initialState: WarehouseState = {
  currentUser: mockUser,
  warehouses: mockWarehouses,
  items: mockItems,
  transactions: mockTransactions,
  notifications: mockNotifications,
  selectedWarehouse: null,
  dashboardStats: {
    totalItems: mockItems.length,
    totalWarehouses: mockWarehouses.length,
    totalValue: mockStocks.reduce((sum, stock) => sum + stock.totalValue, 0),
    lowStockItems: mockItems.filter(item => {
      const stock = mockStocks.find(s => s.itemId === item.id);
      return stock && stock.quantity <= item.minQuantity;
    }).length,
    expiringItems: 0,
    pendingTransactions: mockTransactions.filter(t => t.status === 'pending').length,
    recentTransactions: mockTransactions.slice(0, 10),
    topMovingItems: mockItems.slice(0, 5).map(item => ({
      item,
      totalMovement: Math.floor(Math.random() * 50) + 10
    }))
  },
  stocks: mockStocks,
  recentTransactions: mockTransactions.slice(0, 10),
  isLoading: false,
  error: null,
};

// إنشاء السياق
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// إنشاء الموفر للسياق
interface WarehouseProviderProps {
  children: ReactNode;
}

export const WarehouseProvider: React.FC<WarehouseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  // تحديث الإحصائيات عند تغيير البيانات
  useEffect(() => {
    const updateDashboardStats = () => {
      const stats = calculateDashboardStats(
        state.items,
        state.warehouses,
        state.stocks,
        state.transactions
      );
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
    };

    // تحديث الإحصائيات عند تغيير البيانات
    if (state.items.length > 0 || state.warehouses.length > 0) {
      updateDashboardStats();
    }
  }, [state.items, state.warehouses, state.stocks, state.transactions]);

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
};

// إنشاء دالة استخدام السياق
export const useWarehouse = (): WarehouseContextType => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
