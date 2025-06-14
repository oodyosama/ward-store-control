
import { WarehouseState, WarehouseAction } from './types';

export const warehouseReducer = (state: WarehouseState, action: WarehouseAction): WarehouseState => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_WAREHOUSES':
      return { ...state, warehouses: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_SELECTED_WAREHOUSE':
      return { ...state, selectedWarehouse: action.payload };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    case 'SET_STOCKS':
      return { ...state, stocks: action.payload };
    case 'SET_RECENT_TRANSACTIONS':
      return { ...state, recentTransactions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
