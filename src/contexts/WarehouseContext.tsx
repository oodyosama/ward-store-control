import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
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
  stocks: any[]; // Add missing stocks property
  recentTransactions: Transaction[]; // Add missing recentTransactions property
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
  | { type: 'SET_STOCKS'; payload: any[] }
  | { type: 'SET_RECENT_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// تهيئة بيانات وهمية للتجربة
const mockWarehouses: Warehouse[] = [
  {
    id: 'warehouse-1',
    name: 'المخزن الرئيسي',
    name_en: 'Main Warehouse',
    code: 'WH001',
    address: 'الرياض - حي الملك فهد',
    manager: 'أحمد محمد',
    phone: '+966501234567',
    email: 'main@warehouse.com',
    capacity: 1000,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: 'warehouse-2', 
    name: 'مخزن الفرع الثاني',
    name_en: 'Branch Warehouse',
    code: 'WH002',
    address: 'جدة - حي الحمراء',
    manager: 'سعد العلي',
    phone: '+966509876543',
    email: 'branch@warehouse.com',
    capacity: 500,
    isActive: true,
    createdAt: new Date(),
  }
];

const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'جهاز كمبيوتر محمول',
    name_en: 'Laptop Computer',
    sku: 'LAPTOP001',
    description: 'جهاز كمبيوتر محمول عالي الأداء',
    categoryId: 'cat-1',
    unit: 'قطعة',
    unitPrice: 2500,
    minQuantity: 5,
    maxQuantity: 50,
    location: 'الرف أ-1',
    supplier: 'شركة التقنية المتقدمة',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'item-2',
    name: 'طابعة ليزر',
    name_en: 'Laser Printer',
    sku: 'PRINTER001',
    description: 'طابعة ليزر سريعة وموفرة',
    categoryId: 'cat-1',
    unit: 'قطعة',
    unitPrice: 800,
    minQuantity: 3,
    maxQuantity: 20,
    location: 'الرف ب-2',
    supplier: 'مؤسسة الطباعة الحديثة',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const mockStocks = [
  {
    id: 'stock-1',
    itemId: 'item-1',
    warehouseId: 'warehouse-1',
    quantity: 15,
    availableQuantity: 12,
    reservedQuantity: 3,
    unitPrice: 2500,
    totalValue: 37500,
    lastUpdated: new Date(),
  },
  {
    id: 'stock-2',
    itemId: 'item-2',
    warehouseId: 'warehouse-1',
    quantity: 8,
    availableQuantity: 8,
    reservedQuantity: 0,
    unitPrice: 800,
    totalValue: 6400,
    lastUpdated: new Date(),
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    type: 'inbound',
    itemId: 'item-1',
    warehouseId: 'warehouse-1',
    quantity: 10,
    unitPrice: 2500,
    totalValue: 25000,
    reference: 'PO-2024-001',
    notes: 'استلام دفعة جديدة من أجهزة الكمبيوتر',
    userId: 'default-user',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000), // أمس
    completedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'trans-2',
    type: 'outbound',
    itemId: 'item-2',
    warehouseId: 'warehouse-1',
    quantity: 2,
    unitPrice: 800,
    totalValue: 1600,
    reference: 'SO-2024-001',
    notes: 'صرف طابعات للقسم الإداري',
    userId: 'default-user',
    status: 'completed',
    createdAt: new Date(Date.now() - 43200000), // قبل 12 ساعة
    completedAt: new Date(Date.now() - 43200000),
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'مستوى مخزون منخفض',
    message: 'مستوى مخزون طابعة ليزر أقل من الحد الأدنى',
    type: 'warning',
    priority: 'medium',
    isRead: false,
    userId: 'default-user',
    createdAt: new Date(Date.now() - 3600000), // قبل ساعة
  },
  {
    id: 'notif-2',
    title: 'حركة وارد جديدة',
    message: 'تم استلام دفعة جديدة من أجهزة الكمبيوتر المحمولة',
    type: 'success',
    priority: 'low',
    isRead: false,
    userId: 'default-user',
    createdAt: new Date(Date.now() - 7200000), // قبل ساعتين
  }
];

// تهيئة الحالة الابتدائية مع البيانات الوهمية
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

// إنشاء الموفر للسياق
interface WarehouseProviderProps {
  children: ReactNode;
}

export const WarehouseProvider: React.FC<WarehouseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  // تحديث الإحصائيات عند تغيير البيانات
  useEffect(() => {
    const updateDashboardStats = () => {
      const stats: DashboardStats = {
        totalItems: state.items.length,
        totalWarehouses: state.warehouses.filter(w => w.isActive).length,
        totalValue: state.stocks.reduce((sum, stock) => sum + stock.totalValue, 0),
        lowStockItems: state.items.filter(item => {
          const stock = state.stocks.find(s => s.itemId === item.id);
          return stock && stock.quantity <= item.minQuantity;
        }).length,
        expiringItems: state.stocks.filter(stock => {
          if (!stock.expiryDate) return false;
          const daysUntilExpiry = Math.ceil((stock.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length,
        pendingTransactions: state.transactions.filter(t => t.status === 'pending').length,
        topMovingItems: state.items.slice(0, 5).map(item => {
          const movements = state.transactions.filter(t => t.itemId === item.id).length;
          return {
            item,
            totalMovement: movements
          };
        })
      };

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
