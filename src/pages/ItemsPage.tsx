import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, QrCode, MoreHorizontal } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QRCodeSVG } from 'qrcode.react';

export default function ItemsPage() {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // تصفية الأصناف
  const filteredItems = state.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // الحصول على كمية المخزون لكل صنف
  const getItemStock = (itemId: string) => {
    return state.stocks
      .filter(stock => stock.itemId === itemId)
      .reduce((total, stock) => total + stock.availableQuantity, 0);
  };

  // تحديد حالة المخزون
  const getStockStatus = (item: any) => {
    const totalStock = getItemStock(item.id);
    if (totalStock === 0) return { status: 'out', label: 'نفد', color: 'bg-red-500' };
    if (totalStock <= item.minQuantity) return { status: 'low', label: 'منخفض', color: 'bg-yellow-500' };
    return { status: 'good', label: 'جيد', color: 'bg-green-500' };
  };

  const showQRCode = (item: any) => {
    setSelectedItem(item);
    setIsQRDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">إدارة الأصناف</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة وتتبع جميع الأصناف في المخازن
            </p>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة صنف جديد
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{state.items.length}</p>
                  <p className="text-sm text-gray-600">إجمالي الأصناف</p>
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
                    {state.items.filter(item => getStockStatus(item).status === 'good').length}
                  </p>
                  <p className="text-sm text-gray-600">أصناف متوفرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <span className="w-6 h-6 block">⚠</span>
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">
                    {state.items.filter(item => getStockStatus(item).status === 'low').length}
                  </p>
                  <p className="text-sm text-gray-600">أصناف منخفضة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <span className="w-6 h-6 block">✗</span>
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">
                    {state.items.filter(item => getStockStatus(item).status === 'out').length}
                  </p>
                  <p className="text-sm text-gray-600">أصناف نافدة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* أدوات البحث والتصفية */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="ابحث عن الأصناف بالاسم أو رقم الصنف..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 text-right"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="تصفية حسب الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  <SelectItem value="cat1">مواد خام</SelectItem>
                  <SelectItem value="cat2">منتج نهائي</SelectItem>
                  <SelectItem value="cat3">مواد تغليف</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* جدول الأصناف */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الأصناف ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-table">
              <Table>
                <TableHeader className="table-header">
                  <TableRow>
                    <TableHead className="text-right">الصنف</TableHead>
                    <TableHead className="text-right">رقم الصنف</TableHead>
                    <TableHead className="text-right">الفئة</TableHead>
                    <TableHead className="text-right">الوحدة</TableHead>
                    <TableHead className="text-right">المخزون المتاح</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item);
                    const totalStock = getItemStock(item.id);
                    
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div className="text-right">
                            <p className="font-medium">{item.name}</p>
                            {item.nameEn && (
                              <p className="text-sm text-gray-500">{item.nameEn}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{item.sku}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {item.categoryId === 'cat1' ? 'مواد خام' :
                             item.categoryId === 'cat2' ? 'منتج نهائي' : 'مواد تغليف'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.unit}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{totalStock}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={`text-white ${stockStatus.color}`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toLocaleString()} ريال
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                تعديل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => showQRCode(item)}>
                                <QrCode className="w-4 h-4 mr-2" />
                                عرض QR Code
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* نافذة إضافة صنف جديد */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة صنف جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-right">
              <div>
                <Label htmlFor="name">اسم الصنف</Label>
                <Input id="name" placeholder="أدخل اسم الصنف" className="text-right" />
              </div>
              <div>
                <Label htmlFor="nameEn">الاسم بالإنجليزية</Label>
                <Input id="nameEn" placeholder="Enter item name in English" />
              </div>
              <div>
                <Label htmlFor="sku">رقم الصنف</Label>
                <Input id="sku" placeholder="SKU-001" className="text-right font-mono" />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat1">مواد خام</SelectItem>
                    <SelectItem value="cat2">منتج نهائي</SelectItem>
                    <SelectItem value="cat3">مواد تغليف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">الوحدة</Label>
                  <Input id="unit" placeholder="قطعة، كيلو، متر..." className="text-right" />
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input id="price" type="number" placeholder="0.00" className="text-right" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minQty">الحد الأدنى</Label>
                  <Input id="minQty" type="number" placeholder="10" className="text-right" />
                </div>
                <div>
                  <Label htmlFor="maxQty">الحد الأقصى</Label>
                  <Input id="maxQty" type="number" placeholder="100" className="text-right" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  إضافة الصنف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* نافذة عرض QR Code */}
        <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">QR Code للصنف</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={`${selectedItem.sku}|${selectedItem.name}|${selectedItem.id}`}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-500">رقم الصنف: {selectedItem.sku}</p>
                </div>
                <Button className="w-full" onClick={() => window.print()}>
                  طباعة QR Code
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
