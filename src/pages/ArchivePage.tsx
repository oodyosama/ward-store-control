
import React, { useState } from 'react';
import { Archive, Search, Filter, Package, Calendar, User, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useWarehouse } from '@/contexts/WarehouseContext';

export default function ArchivePage() {
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock archived data - in a real app this would come from the database
  const archivedItems = [
    {
      id: '1',
      type: 'item',
      name: 'جهاز كمبيوتر قديم',
      description: 'جهاز كمبيوتر تم إيقافه من الخدمة',
      archivedDate: '2024-01-15',
      archivedBy: 'أحمد محمد',
      reason: 'انتهاء العمر الافتراضي'
    },
    {
      id: '2',
      type: 'transaction',
      name: 'حركة نقل مخزون',
      description: 'نقل أصناف من مخزن القاهرة إلى الإسكندرية',
      archivedDate: '2024-02-10',
      archivedBy: 'سارة أحمد',
      reason: 'اكتمال العملية'
    },
    {
      id: '3',
      type: 'item',
      name: 'طابعة HP LaserJet',
      description: 'طابعة ليزر تالفة',
      archivedDate: '2024-02-20',
      archivedBy: 'محمد علي',
      reason: 'عطل غير قابل للإصلاح'
    }
  ];

  const filteredItems = archivedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'item':
        return Package;
      case 'transaction':
        return RotateCcw;
      default:
        return Archive;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'item':
        return <Badge variant="secondary">صنف</Badge>;
      case 'transaction':
        return <Badge variant="outline">معاملة</Badge>;
      default:
        return <Badge>أخرى</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الأرشيف</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              إدارة العناصر والمعاملات المؤرشفة
            </p>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse mt-4 sm:mt-0">
            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              تصدير الأرشيف
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Archive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {archivedItems.length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">إجمالي المؤرشف</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {archivedItems.filter(item => item.type === 'item').length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">أصناف مؤرشفة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="mr-4 text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {archivedItems.filter(item => item.type === 'transaction').length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">معاملات مؤرشفة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* البحث والتصفية */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end">
              <Search className="w-5 h-5 ml-2" />
              البحث والتصفية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ابحث في الأرشيف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-right"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="نوع العنصر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="item">الأصناف</SelectItem>
                  <SelectItem value="transaction">المعاملات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* جدول الأرشيف */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">العناصر المؤرشفة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">تاريخ الأرشفة</TableHead>
                  <TableHead className="text-right">بواسطة</TableHead>
                  <TableHead className="text-right">السبب</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <TypeIcon className="w-4 h-4 ml-2" />
                          {getTypeBadge(item.type)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-right text-gray-600">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Calendar className="w-4 h-4 ml-2" />
                          {item.archivedDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <User className="w-4 h-4 ml-2" />
                          {item.archivedBy}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.reason}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                          <Button size="sm" variant="outline">
                            عرض التفاصيل
                          </Button>
                          <Button size="sm" variant="outline">
                            استعادة
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <Archive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  لا توجد عناصر مؤرشفة
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery || filterType !== 'all' 
                    ? 'لم يتم العثور على نتائج تطابق البحث'
                    : 'لا توجد عناصر مؤرشفة حالياً'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
