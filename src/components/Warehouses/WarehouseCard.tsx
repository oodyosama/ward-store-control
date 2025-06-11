
import React from 'react';
import { MapPin, Phone, Mail, Users, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Warehouse } from '@/types/warehouse';

interface WarehouseCardProps {
  warehouse: Warehouse;
  stats: {
    totalItems: number;
    totalValue: number;
    totalQuantity: number;
  };
}

export default function WarehouseCard({ warehouse, stats }: WarehouseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
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
}
