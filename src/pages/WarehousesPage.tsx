
import React, { useState } from 'react';
import { Plus, MapPin, Phone, Mail, Users, Package, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WarehousesPage() {
  const { state } = useWarehouse();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // حساب إحصائيات المخازن
  const getWarehouseStats = (warehouseId: string) => {
    const warehouseStocks = state.stocks.filter(stock => stock.warehouseId === warehouseId);
    const totalItems = warehouseStocks.length;
    const totalValue = warehouseStocks.reduce((sum, stock) => sum + stock.totalValue, 0);
    const totalQuantity = warehouseStocks.reduce((sum, stock) => sum + stock.quantity, 0);
    
    return { totalItems, totalValue, totalQuantity };
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة المخازن</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة المخازن والفروع والمواقع
            </p>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة مخزن جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات المخازن */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Package className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{state.warehouses.length}</p>
                  <p className="text-sm text-gray-600">إجمالي المخازن</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <span className="w-6 h-6 block">✓</span>
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">
                    {state.warehouses.filter(w => w.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">مخازن نشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Package className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">
                    {state.stocks.reduce((sum, stock) => sum + stock.quantity, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">إجمالي المخزون</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <span className="w-6 h-6 block">₪</span>
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">
                    {state.stocks.reduce((sum, stock) => sum + stock.totalValue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة المخازن */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {state.warehouses.map((warehouse) => {
            const stats = getWarehouseStats(warehouse.id);
            
            return (
              <Card key={warehouse.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-right flex-1">
                      <CardTitle className="text-lg mb-1">{warehouse.name}</CardTitle>
                      {warehouse.nameEn && (
                        <p className="text-sm text-gray-500">{warehouse.nameEn}</p>
                      )}
                      <div className="flex items-center mt-2">
                        <Badge variant={warehouse.isActive ? "default" : "secondary"}>
                          {warehouse.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          {warehouse.code}
                        </Badge>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          إدارة المناطق
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* معلومات الاتصال */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      <span className="text-right">{warehouse.address}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 ml-2" />
                      <span className="text-right">{warehouse.manager}</span>
                    </div>
                    
                    {warehouse.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 ml-2" />
                        <span className="text-right direction-ltr">{warehouse.phone}</span>
                      </div>
                    )}
                    
                    {warehouse.email && (
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 ml-2" />
                        <span className="text-right">{warehouse.email}</span>
                      </div>
                    )}
                  </div>

                  {/* إحصائيات المخزن */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-3 text-right">إحصائيات المخزن</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{stats.totalItems}</p>
                        <p className="text-xs text-gray-500">الأصناف</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{stats.totalQuantity.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">الكمية</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">{(stats.totalValue / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">القيمة</p>
                      </div>
                    </div>
                  </div>

                  {/* السعة */}
                  {warehouse.capacity && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">السعة التخزينية</span>
                        <span className="text-sm text-blue-600">{warehouse.capacity.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${Math.min((stats.totalQuantity / warehouse.capacity) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((stats.totalQuantity / warehouse.capacity) * 100).toFixed(1)}% مستخدم
                      </p>
                    </div>
                  )}

                  {/* أزرار الإجراءات */}
                  <div className="flex space-x-2 rtl:space-x-reverse pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      عرض المخزون
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      جرد المخزن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* نافذة إضافة مخزن جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة مخزن جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-right">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم المخزن</Label>
                  <Input id="name" placeholder="المخزن الرئيسي" className="text-right" />
                </div>
                <div>
                  <Label htmlFor="nameEn">الاسم بالإنجليزية</Label>
                  <Input id="nameEn" placeholder="Main Warehouse" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">رمز المخزن</Label>
                  <Input id="code" placeholder="WH001" className="text-right font-mono" />
                </div>
                <div>
                  <Label htmlFor="capacity">السعة التخزينية</Label>
                  <Input id="capacity" type="number" placeholder="10000" className="text-right" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">العنوان</Label>
                <Textarea id="address" placeholder="أدخل العنوان الكامل للمخزن" className="text-right" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager">مدير المخزن</Label>
                  <Input id="manager" placeholder="أحمد محمد" className="text-right" />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" placeholder="+966501234567" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" placeholder="warehouse@company.com" />
              </div>
              
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  إضافة المخزن
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
