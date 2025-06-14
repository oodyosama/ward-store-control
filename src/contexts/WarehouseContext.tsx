
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { warehouseReducer, initialState } from './warehouseReducer';
import { WarehouseState, WarehouseAction } from './types';

interface WarehouseContextType {
  state: WarehouseState;
  dispatch: React.Dispatch<WarehouseAction>;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  useEffect(() => {
    // Initialize with mock data or fetch from API
    dispatch({
      type: 'SET_DASHBOARD_STATS',
      payload: {
        totalItems: 150,
        totalWarehouses: 3,
        totalValue: 125000,
        lowStockItems: 5,
        expiringItems: 2,
        pendingTransactions: 0,
        topMovingItems: []
      }
    });

    dispatch({
      type: 'SET_CURRENT_USER',
      payload: {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        permissions: [],
        isActive: true,
        createdAt: new Date(),
      }
    });
  }, []);

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}
