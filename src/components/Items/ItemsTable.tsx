
import React from 'react';
import { Edit, Trash2, Eye, QrCode, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface ItemsTableProps {
  filteredItems: any[];
  getItemStock: (itemId: string) => number;
  getStockStatus: (item: any) => { status: string; label: string; color: string };
  showQRCode: (item: any) => void;
}

export default function ItemsTable({ 
  filteredItems, 
  getItemStock, 
  getStockStatus, 
  showQRCode 
}: ItemsTableProps) {
  return (
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
  );
}
