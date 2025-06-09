
import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowRightLeft, Filter, Calendar, Search } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function TransactionsPage() {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('inbound');

  // تصفية الحركات
  const filteredTransactions = state.transactions.filter(transaction => {
    const item = state.items.find(i => i.id === transaction.itemId);
    const warehouse = state.warehouses.find(w => w.id === transaction.warehouseId);
    
    const matchesSearch = item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesWarehouse = selectedWarehouse === 'all' || transaction.warehouseId === selectedWarehouse;
    
    return matchesSearch && matchesType && matchesWarehouse;
  });

  // حساب الإحصائيات
  const totalInbound = state.transactions
    .filter(t => t.type === 'inbound')
    .reduce((sum, t) => sum + t.totalValue, 0);
  
  const totalOutbound = state.transactions
    .filter(t => t.type === 'outbound')
    .reduce((sum, t) => sum + t.totalValue, 0);
  
  const pendingTransactions = state.transactions.filter(t => t.status === 'pending').length;

  // دالة لترجمة نوع الحركة
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'inbound': return 'وارد';
      case 'outbound': return 'صادر';
      case 'transfer': return 'تحويل';
      case 'adjustment': return 'تسوية';
      case 'return': return 'مرتجع';
      default: return type;
    }
  };

  // دالة للحصول على لون نوع الحركة
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'inbound': return 'bg-green-500';
      case 'outbound': return 'bg-red-500';
      case 'transfer': return 'bg-blue-500';
      case 'adjustment': return 'bg-yellow-500';
      case 'return': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">حركات المخزون</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              تتبع جميع حركات الوارد والصادر والتحويلات
            </p>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse mt-4 sm:mt-0">
            <Button onClick={() => { setTransactionType('inbound'); setIsAddDialogOpen(true); }} 
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700">
              <TrendingUp className="w-4 h-4 ml-2" />
              حركة وارد
            </Button>
            <Button onClick={() => { setTransactionType('outbound'); setIsAddDialogOpen(true); }} 
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
              <TrendingDown className="w-4 h-4 ml-2" />
              حركة صادر
            </Button>
            <Button onClick={() => { setTransactionType('transfer'); setIsAddDialogOpen(true); }} 
                    variant="outline">
              <ArrowRightLeft className="w-4 h-4 ml-2" />
              تحويل
            </Button>
          </div>
        </div>

        {/* إحصائيات الحركات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{totalInbound.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">إجمالي الوارد</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{totalOutbound.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">إجمالي الصادر</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{state.transactions.length}</p>
                  <p className="text-sm text-gray-600">إجمالي الحركات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold">{pendingTransactions}</p>
                  <p className="text-sm text-gray-600">حركات معلقة</p>
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
                    placeholder="ابحث عن الحركات بالصنف أو المرجع..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 text-right"
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="نوع الحركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="inbound">وارد</SelectItem>
                  <SelectItem value="outbound">صادر</SelectItem>
                  <SelectItem value="transfer">تحويل</SelectItem>
                  <SelectItem value="adjustment">تسوية</SelectItem>
                  <SelectItem value="return">مرتجع</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="المخزن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المخازن</SelectItem>
                  {state.warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Filter className="w-4 h-4 ml-2" />
                تصفية متقدمة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* جدول الحركات */}
        <Card>
          <CardHeader>
            <CardTitle>سجل الحركات ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="responsive-table">
              <Table>
                <TableHeader className="table-header">
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الصنف</TableHead>
                    <TableHead className="text-right">المخزن</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">القيمة الإجمالية</TableHead>
                    <TableHead className="text-right">المرجع</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => {
                    const item = state.items.find(i => i.id === transaction.itemId);
                    const warehouse = state.warehouses.find(w => w.id === transaction.warehouseId);
                    
                    return (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">
                              {format(transaction.createdAt, 'dd/MM/yyyy', { locale: ar })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(transaction.createdAt, 'HH:mm')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={`text-white ${getTransactionTypeColor(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">{item?.name}</p>
                            <p className="text-sm text-gray-500">{item?.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{warehouse?.name}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-medium ${
                            transaction.type === 'inbound' ? 'text-green-600' : 
                            transaction.type === 'outbound' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {transaction.type === 'inbound' ? '+' : 
                             transaction.type === 'outbound' ? '-' : ''}
                            {transaction.quantity} {item?.unit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.unitPrice.toLocaleString()} ريال
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.totalValue.toLocaleString()} ريال
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.reference && (
                            <Badge variant="outline">{transaction.reference}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            transaction.status === 'completed' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {transaction.status === 'completed' ? 'مكتملة' :
                             transaction.status === 'pending' ? 'معلقة' : 'ملغية'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* نافذة إضافة حركة جديدة */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-right">
                إضافة حركة {getTransactionTypeLabel(transactionType)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-right">
              <div>
                <Label htmlFor="transactionType">نوع الحركة</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">وارد</SelectItem>
                    <SelectItem value="outbound">صادر</SelectItem>
                    <SelectItem value="transfer">تحويل</SelectItem>
                    <SelectItem value="adjustment">تسوية</SelectItem>
                    <SelectItem value="return">مرتجع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="item">الصنف</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصنف" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.items.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="warehouse">المخزن</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {transactionType === 'transfer' && (
                <div>
                  <Label htmlFor="targetWarehouse">إلى المخزن</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المخزن المستهدف" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">الكمية</Label>
                  <Input id="quantity" type="number" placeholder="0" className="text-right" />
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input id="price" type="number" placeholder="0.00" className="text-right" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reference">المرجع</Label>
                <Input id="reference" placeholder="PO-001, SO-001..." className="text-right" />
              </div>
              
              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea id="notes" placeholder="ملاحظات إضافية..." className="text-right" />
              </div>
              
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button className={`${
                  transactionType === 'inbound' ? 'bg-green-600 hover:bg-green-700' :
                  transactionType === 'outbound' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}>
                  إضافة الحركة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
