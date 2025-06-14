
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'warehouse_keeper' | 'accountant' | 'cashier';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Item {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  unit: string;
  unitPrice: number;
  minQuantity: number;
  maxQuantity?: number;
  description?: string;
  supplier?: string;
  barcode?: string;
  qrCode?: string;
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  manager: string;
  phone?: string;
  email?: string;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  itemId: string;
  warehouseId: string;
  targetWarehouseId?: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  batchNumber?: string;
  expiryDate?: Date;
  reference?: string;
  notes?: string;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  userId?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalItems: number;
  totalWarehouses: number;
  totalValue: number;
  lowStockItems: number;
  expiringItems: number;
  pendingTransactions: number;
  topMovingItems?: Array<{item: Item; totalMovement: number}>;
}

export interface WarehouseState {
  users: User[];
  items: Item[];
  warehouses: Warehouse[];
  transactions: Transaction[];
  notifications: Notification[];
  dashboardStats: DashboardStats | null;
  recentTransactions: Transaction[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export type WarehouseAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_WAREHOUSES'; payload: Warehouse[] }
  | { type: 'ADD_WAREHOUSE'; payload: Warehouse }
  | { type: 'UPDATE_WAREHOUSE'; payload: Warehouse }
  | { type: 'DELETE_WAREHOUSE'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_RECENT_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
