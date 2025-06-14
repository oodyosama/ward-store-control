
import { User, Warehouse, Item, Transaction, Notification, DashboardStats } from '@/types/warehouse';

export const mockWarehouses: Warehouse[] = [
  {
    id: 'warehouse-1',
    name: 'المخزن الرئيسي',
    nameEn: 'Main Warehouse',
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
    nameEn: 'Branch Warehouse',
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

export const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'جهاز كمبيوتر محمول',
    nameEn: 'Laptop Computer',
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
    nameEn: 'Laser Printer',
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

export const mockStocks = [
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

export const mockTransactions: Transaction[] = [
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

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'مستوى مخزون منخفض',
    message: 'مستوى مخزون طابعة ليزر أقل من الحد الأدنى',
    type: 'low_stock',
    priority: 'medium',
    isRead: false,
    userId: 'default-user',
    createdAt: new Date(Date.now() - 3600000), // قبل ساعة
  },
  {
    id: 'notif-2',
    title: 'حركة وارد جديدة',
    message: 'تم استلام دفعة جديدة من أجهزة الكمبيوتر المحمولة',
    type: 'system',
    priority: 'low',
    isRead: false,
    userId: 'default-user',
    createdAt: new Date(Date.now() - 7200000), // قبل ساعتين
  }
];

export const mockUser: User = {
  id: 'default-user',
  username: 'مستخدم تجريبي',
  email: 'demo@example.com',
  role: 'admin',
  permissions: ['read', 'write', 'manage_users', 'manage_inventory', 'manage_warehouses', 'view_reports', 'pos_access'],
  isActive: true,
  createdAt: new Date(),
};
