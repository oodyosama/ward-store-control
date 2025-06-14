
import { User, Warehouse, Item, Transaction, Notification, DashboardStats } from '@/types/warehouse';

export interface WarehouseState {
  currentUser: User | null;
  warehouses: Warehouse[];
  items: Item[];
  transactions: Transaction[];
  notifications: Notification[];
  selectedWarehouse: Warehouse | null;
  dashboardStats: DashboardStats | null;
  stocks: any[];
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export interface WarehouseContextType {
  state: WarehouseState;
  dispatch: React.Dispatch<WarehouseAction>;
}

export type WarehouseAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_WAREHOUSES'; payload: Warehouse[] }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_SELECTED_WAREHOUSE'; payload: Warehouse | null }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_STOCKS'; payload: any[] }
  | { type: 'SET_RECENT_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
