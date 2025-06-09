
// أنواع البيانات الأساسية لنظام إدارة المخازن

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'warehouse_keeper' | 'accountant';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface ItemCategory {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  type: 'raw_material' | 'finished_product' | 'packaging' | 'consumable';
  parentId?: string;
}

export interface Item {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  sku: string;
  barcode?: string;
  qrCode?: string;
  categoryId: string;
  unit: string;
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  expiryDate?: Date;
  batchNumber?: string;
  supplier?: string;
  location?: string;
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  address: string;
  manager: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  capacity?: number;
  zones?: WarehouseZone[];
  createdAt: Date;
}

export interface WarehouseZone {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  description?: string;
  capacity?: number;
}

export interface Stock {
  id: string;
  itemId: string;
  warehouseId: string;
  zoneId?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  unitPrice: number;
  totalValue: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return';
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
  type: 'low_stock' | 'expiry_warning' | 'negative_stock' | 'system' | 'user_action';
  title: string;
  message: string;
  itemId?: string;
  warehouseId?: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface Report {
  id: string;
  type: 'stock_report' | 'movement_report' | 'expiry_report' | 'turnover_report' | 'custom';
  title: string;
  filters: any;
  data: any;
  generatedBy: string;
  createdAt: Date;
}

export interface SystemSettings {
  id: string;
  companyName: string;
  companyLogo?: string;
  currency: string;
  language: 'ar' | 'en' | 'both';
  timezone: string;
  lowStockThreshold: number;
  expiryWarningDays: number;
  autoBackup: boolean;
  enableNotifications: boolean;
  enableBarcodeScanning: boolean;
  defaultWarehouseId?: string;
}

// أنواع الاستعلامات والتصفية
export interface FilterOptions {
  search?: string;
  category?: string;
  warehouse?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalItems: number;
  totalWarehouses: number;
  lowStockItems: number;
  expiringItems: number;
  totalValue: number;
  pendingTransactions: number;
  recentTransactions: Transaction[];
  topMovingItems: Array<{
    item: Item;
    totalMovement: number;
  }>;
}
