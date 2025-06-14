import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Warehouse, Item, Transaction, Notification, DashboardStats } from '@/types/warehouse';

// أنواع البيانات للسياق
interface WarehouseState {
  currentUser: User | null;
  warehouses: Warehouse[];
  items: Item[];
  transactions: Transaction[];
  notifications: Notification[];
  selectedWarehouse: Warehouse | null;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

interface WarehouseContextType {
  state: WarehouseState;
  dispatch: React.Dispatch<WarehouseAction>;
}

// أنواع الإجراءات المتاحة لتحديث الحالة
type WarehouseAction =
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_WAREHOUSES'; payload: Warehouse[] }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_SELECTED_WAREHOUSE'; payload: Warehouse | null }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// تهيئة الحالة الابتدائية
const initialState: WarehouseState = {
  currentUser: {
    id: 'default-user',
    username: 'مستخدم تجريبي',
    email: 'demo@example.com',
    role: 'admin',
    permissions: ['read', 'write', 'manage_users', 'manage_inventory', 'manage_warehouses', 'view_reports', 'pos_access'],
    isActive: true,
    createdAt: new Date(),
  },
  warehouses: [],
  items: [],
  transactions: [],
  notifications: [],
  selectedWarehouse: null,
  dashboardStats: null,
  isLoading: false,
  error: null,
};

// إنشاء السياق
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// دالة لتحديث الحالة بناءً على الإجراء
const warehouseReducer = (state: WarehouseState, action: WarehouseAction): WarehouseState => {
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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// إنشاء الموفر للسياق
interface WarehouseProviderProps {
  children: ReactNode;
}

export const WarehouseProvider: React.FC<WarehouseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

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
