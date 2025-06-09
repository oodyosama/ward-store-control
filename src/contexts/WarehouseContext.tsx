
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Item, Warehouse, Stock, Transaction, Notification, DashboardStats } from '@/types/warehouse';

interface WarehouseState {
  currentUser: User | null;
  items: Item[];
  warehouses: Warehouse[];
  stocks: Stock[];
  transactions: Transaction[];
  notifications: Notification[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

type WarehouseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_WAREHOUSES'; payload: Warehouse[] }
  | { type: 'ADD_WAREHOUSE'; payload: Warehouse }
  | { type: 'UPDATE_WAREHOUSE'; payload: Warehouse }
  | { type: 'SET_STOCKS'; payload: Stock[] }
  | { type: 'UPDATE_STOCK'; payload: Stock }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: WarehouseState = {
  currentUser: null,
  items: [],
  warehouses: [],
  stocks: [],
  transactions: [],
  notifications: [],
  dashboardStats: null,
  loading: false,
  error: null,
};

function warehouseReducer(state: WarehouseState, action: WarehouseAction): WarehouseState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'SET_WAREHOUSES':
      return { ...state, warehouses: action.payload };
    case 'ADD_WAREHOUSE':
      return { ...state, warehouses: [...state.warehouses, action.payload] };
    case 'UPDATE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.map(warehouse =>
          warehouse.id === action.payload.id ? action.payload : warehouse
        ),
      };
    case 'SET_STOCKS':
      return { ...state, stocks: action.payload };
    case 'UPDATE_STOCK':
      return {
        ...state,
        stocks: state.stocks.map(stock =>
          stock.id === action.payload.id ? action.payload : stock
        ),
      };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        ),
      };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
}

const WarehouseContext = createContext<{
  state: WarehouseState;
  dispatch: React.Dispatch<WarehouseAction>;
} | null>(null);

export function WarehouseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  // تحميل البيانات التجريبية عند بدء التطبيق
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // بيانات تجريبية للمستخدم
    const sampleUser: User = {
      id: '1',
      username: 'admin',
      email: 'admin@warehouse.com',
      role: 'admin',
      permissions: ['all'],
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    // بيانات تجريبية للمخازن
    const sampleWarehouses: Warehouse[] = [
      {
        id: '1',
        name: 'المخزن الرئيسي',
        nameEn: 'Main Warehouse',
        code: 'WH001',
        address: 'الرياض، المملكة العربية السعودية',
        manager: 'محمد أحمد',
        phone: '+966501234567',
        email: 'main@warehouse.com',
        isActive: true,
        capacity: 10000,
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'مخزن الفرع',
        nameEn: 'Branch Warehouse',
        code: 'WH002',
        address: 'جدة، المملكة العربية السعودية',
        manager: 'سارة علي',
        phone: '+966507654321',
        email: 'branch@warehouse.com',
        isActive: true,
        capacity: 5000,
        createdAt: new Date(),
      },
    ];

    // بيانات تجريبية للأصناف
    const sampleItems: Item[] = [
      {
        id: '1',
        name: 'مواد خام - حديد',
        nameEn: 'Raw Material - Steel',
        description: 'حديد خام للإنتاج',
        sku: 'RM001',
        barcode: '1234567890123',
        categoryId: 'cat1',
        unit: 'طن',
        minQuantity: 10,
        maxQuantity: 100,
        unitPrice: 2500,
        supplier: 'شركة الحديد السعودية',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'منتج نهائي - مكتب',
        nameEn: 'Finished Product - Desk',
        description: 'مكتب مكتبي خشبي',
        sku: 'FP001',
        barcode: '1234567890124',
        categoryId: 'cat2',
        unit: 'قطعة',
        minQuantity: 5,
        maxQuantity: 50,
        unitPrice: 1200,
        supplier: 'مصنع الأثاث الحديث',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'مواد تغليف - كرتون',
        nameEn: 'Packaging - Cardboard',
        description: 'صناديق كرتونية للتغليف',
        sku: 'PK001',
        barcode: '1234567890125',
        categoryId: 'cat3',
        unit: 'صندوق',
        minQuantity: 100,
        maxQuantity: 1000,
        unitPrice: 15,
        supplier: 'مصنع الكرتون',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // بيانات تجريبية للمخزون
    const sampleStocks: Stock[] = [
      {
        id: '1',
        itemId: '1',
        warehouseId: '1',
        quantity: 50,
        reservedQuantity: 5,
        availableQuantity: 45,
        unitPrice: 2500,
        totalValue: 125000,
        lastUpdated: new Date(),
      },
      {
        id: '2',
        itemId: '2',
        warehouseId: '1',
        quantity: 25,
        reservedQuantity: 2,
        availableQuantity: 23,
        unitPrice: 1200,
        totalValue: 30000,
        lastUpdated: new Date(),
      },
      {
        id: '3',
        itemId: '3',
        warehouseId: '1',
        quantity: 500,
        reservedQuantity: 50,
        availableQuantity: 450,
        unitPrice: 15,
        totalValue: 7500,
        lastUpdated: new Date(),
      },
    ];

    // بيانات تجريبية للحركات
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        type: 'inbound',
        itemId: '1',
        warehouseId: '1',
        quantity: 20,
        unitPrice: 2500,
        totalValue: 50000,
        reference: 'PO-001',
        notes: 'شراء من المورد الرئيسي',
        userId: '1',
        status: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        type: 'outbound',
        itemId: '2',
        warehouseId: '1',
        quantity: 5,
        unitPrice: 1200,
        totalValue: 6000,
        reference: 'SO-001',
        notes: 'بيع للعميل',
        userId: '1',
        status: 'completed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    // بيانات تجريبية للإشعارات
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'low_stock',
        title: 'تحذير مخزون منخفض',
        message: 'الصنف "منتج نهائي - مكتب" أقل من الحد الأدنى',
        itemId: '2',
        warehouseId: '1',
        priority: 'high',
        isRead: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'system',
        title: 'مرحباً بك في النظام',
        message: 'تم تسجيل الدخول بنجاح',
        userId: '1',
        priority: 'low',
        isRead: false,
        createdAt: new Date(),
      },
    ];

    // إحصائيات لوحة التحكم
    const dashboardStats: DashboardStats = {
      totalItems: sampleItems.length,
      totalWarehouses: sampleWarehouses.length,
      lowStockItems: 1,
      expiringItems: 0,
      totalValue: 162500,
      pendingTransactions: 0,
      recentTransactions: sampleTransactions.slice(0, 5),
      topMovingItems: [
        { item: sampleItems[0], totalMovement: 100 },
        { item: sampleItems[1], totalMovement: 50 },
      ],
    };

    // تحديث الحالة
    dispatch({ type: 'SET_USER', payload: sampleUser });
    dispatch({ type: 'SET_WAREHOUSES', payload: sampleWarehouses });
    dispatch({ type: 'SET_ITEMS', payload: sampleItems });
    dispatch({ type: 'SET_STOCKS', payload: sampleStocks });
    dispatch({ type: 'SET_TRANSACTIONS', payload: sampleTransactions });
    dispatch({ type: 'SET_NOTIFICATIONS', payload: sampleNotifications });
    dispatch({ type: 'SET_DASHBOARD_STATS', payload: dashboardStats });
  };

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
}
