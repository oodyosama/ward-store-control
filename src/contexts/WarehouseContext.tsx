import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Item, Warehouse, Stock, Transaction, Notification, DashboardStats } from '@/types/warehouse';

export interface WarehouseState {
  currentUser: User | null;
  items: Item[];
  warehouses: Warehouse[];
  stocks: Stock[];
  transactions: Transaction[];
  recentTransactions: Transaction[];
  notifications: Notification[];
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

type WarehouseAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DATA'; payload: Partial<WarehouseState> }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_WAREHOUSE'; payload: Warehouse }
  | { type: 'UPDATE_WAREHOUSE'; payload: Warehouse }
  | { type: 'DELETE_WAREHOUSE'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_STOCK'; payload: Stock[] };

const warehouseReducer = (state: WarehouseState, action: WarehouseAction): WarehouseState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DATA':
      return { ...state, ...action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'ADD_WAREHOUSE':
      return { ...state, warehouses: [...state.warehouses, action.payload] };
    case 'UPDATE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.map(warehouse => 
          warehouse.id === action.payload.id ? action.payload : warehouse
        )
      };
    case 'DELETE_WAREHOUSE':
      return {
        ...state,
        warehouses: state.warehouses.filter(warehouse => warehouse.id !== action.payload)
      };
    case 'ADD_TRANSACTION':
      return { 
        ...state, 
        transactions: [...state.transactions, action.payload],
        recentTransactions: [action.payload, ...state.recentTransactions].slice(0, 10)
      };
    case 'UPDATE_STOCK':
      return { ...state, stocks: action.payload };
    default:
      return state;
  }
};

const initialState: WarehouseState = {
  currentUser: {
    id: '1',
    username: 'admin',
    email: 'admin@warehouse.com',
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  items: [],
  warehouses: [],
  stocks: [],
  transactions: [],
  recentTransactions: [],
  notifications: [],
  dashboardStats: null,
  isLoading: false,
  error: null
};

interface WarehouseContextType {
  state: WarehouseState;
  dispatch: React.Dispatch<WarehouseAction>;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(warehouseReducer, initialState);

  // تحميل البيانات التجريبية
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // بيانات تجريبية للمخازن
        const sampleWarehouses: Warehouse[] = [
          {
            id: 'wh1',
            name: 'المخزن الرئيسي',
            nameEn: 'Main Warehouse',
            code: 'WH001',
            address: 'الرياض، حي الصناعية',
            manager: 'أحمد محمد',
            phone: '0501234567',
            email: 'main@warehouse.com',
            isActive: true,
            capacity: 10000,
            createdAt: new Date()
          },
          {
            id: 'wh2',
            name: 'مخزن الفرع الثاني',
            nameEn: 'Branch 2 Warehouse',
            code: 'WH002',
            address: 'جدة، حي الفيصلية',
            manager: 'فاطمة أحمد',
            phone: '0507654321',
            email: 'branch2@warehouse.com',
            isActive: true,
            capacity: 5000,
            createdAt: new Date()
          }
        ];

        // بيانات تجريبية للأصناف
        const sampleItems: Item[] = [
          {
            id: 'item1',
            name: 'صندوق كرتون كبير',
            nameEn: 'Large Cardboard Box',
            description: 'صندوق كرتون للتغليف الكبير',
            sku: 'BOX-L-001',
            barcode: '1234567890123',
            categoryId: 'cat3',
            unit: 'قطعة',
            minQuantity: 50,
            maxQuantity: 500,
            unitPrice: 5.50,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'item2',
            name: 'مادة خام A',
            nameEn: 'Raw Material A',
            description: 'مادة خام أساسية للإنتاج',
            sku: 'RAW-A-001',
            barcode: '2345678901234',
            categoryId: 'cat1',
            unit: 'كيلو',
            minQuantity: 100,
            maxQuantity: 1000,
            unitPrice: 25.00,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'item3',
            name: 'منتج نهائي X',
            nameEn: 'Final Product X',
            description: 'منتج نهائي جاهز للبيع',
            sku: 'FIN-X-001',
            barcode: '3456789012345',
            categoryId: 'cat2',
            unit: 'قطعة',
            minQuantity: 20,
            maxQuantity: 200,
            unitPrice: 150.00,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        // بيانات تجريبية للمخزون
        const sampleStocks: Stock[] = [
          {
            id: 'stock1',
            itemId: 'item1',
            warehouseId: 'wh1',
            quantity: 150,
            reservedQuantity: 10,
            availableQuantity: 140,
            unitPrice: 5.50,
            totalValue: 825,
            lastUpdated: new Date()
          },
          {
            id: 'stock2',
            itemId: 'item2',
            warehouseId: 'wh1',
            quantity: 500,
            reservedQuantity: 50,
            availableQuantity: 450,
            unitPrice: 25.00,
            totalValue: 12500,
            lastUpdated: new Date()
          },
          {
            id: 'stock3',
            itemId: 'item3',
            warehouseId: 'wh2',
            quantity: 75,
            reservedQuantity: 5,
            availableQuantity: 70,
            unitPrice: 150.00,
            totalValue: 11250,
            lastUpdated: new Date()
          }
        ];

        // بيانات تجريبية للحركات
        const sampleTransactions: Transaction[] = [
          {
            id: 'trans1',
            type: 'inbound',
            itemId: 'item1',
            warehouseId: 'wh1',
            quantity: 100,
            unitPrice: 5.50,
            totalValue: 550,
            reference: 'PO-001',
            notes: 'استلام دفعة جديدة من الصناديق',
            userId: '1',
            status: 'completed',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // أمس
            completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            id: 'trans2',
            type: 'outbound',
            itemId: 'item2',
            warehouseId: 'wh1',
            quantity: 50,
            unitPrice: 25.00,
            totalValue: 1250,
            reference: 'SO-001',
            notes: 'إرسال للإنتاج',
            userId: '1',
            status: 'completed',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // قبل 12 ساعة
            completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
          },
          {
            id: 'trans3',
            type: 'transfer',
            itemId: 'item3',
            warehouseId: 'wh1',
            targetWarehouseId: 'wh2',
            quantity: 25,
            unitPrice: 150.00,
            totalValue: 3750,
            reference: 'TR-001',
            notes: 'نقل للفرع الثاني',
            userId: '1',
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // قبل ساعتين
          }
        ];

        // بيانات تجريبية للإشعارات
        const sampleNotifications: Notification[] = [
          {
            id: 'notif1',
            type: 'low_stock',
            title: 'مخزون منخفض',
            message: 'الصنف "صندوق كرتون كبير" أصبح أقل من الحد الأدنى',
            itemId: 'item1',
            warehouseId: 'wh1',
            priority: 'medium',
            isRead: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000) // قبل 30 دقيقة
          },
          {
            id: 'notif2',
            type: 'system',
            title: 'تم إكمال النقل',
            message: 'تم نقل المنتج X بنجاح إلى الفرع الثاني',
            priority: 'low',
            isRead: true,
            createdAt: new Date(Date.now() - 60 * 60 * 1000), // قبل ساعة
            readAt: new Date(Date.now() - 45 * 60 * 1000)
          }
        ];

        // إحصائيات لوحة التحكم
        const dashboardStats: DashboardStats = {
          totalItems: sampleItems.length,
          totalWarehouses: sampleWarehouses.length,
          lowStockItems: 1,
          expiringItems: 0,
          totalValue: sampleStocks.reduce((sum, stock) => sum + stock.totalValue, 0),
          pendingTransactions: sampleTransactions.filter(t => t.status === 'pending').length,
          recentTransactions: sampleTransactions,
          topMovingItems: [
            { item: sampleItems[0], totalMovement: 150 },
            { item: sampleItems[1], totalMovement: 100 },
            { item: sampleItems[2], totalMovement: 75 }
          ]
        };

        // تحديث الحالة
        dispatch({
          type: 'SET_DATA',
          payload: {
            items: sampleItems,
            warehouses: sampleWarehouses,
            stocks: sampleStocks,
            transactions: sampleTransactions,
            recentTransactions: sampleTransactions.slice(0, 5),
            notifications: sampleNotifications,
            dashboardStats,
            isLoading: false
          }
        });

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'فشل في تحميل البيانات' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
};
