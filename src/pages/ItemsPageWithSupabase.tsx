
import React, { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddItemDialog from "@/components/Items/AddItemDialog";
import { useItems } from "@/hooks/useItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ItemsPageWithSupabase() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: items, isLoading, error } = useItems();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل الأصناف...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">خطأ في تحميل الأصناف</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأصناف</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة صنف جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-right flex justify-between items-start">
                  <span>{item.name}</span>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "نشط" : "غير نشط"}
                  </Badge>
                </CardTitle>
                {item.nameEn && (
                  <p className="text-sm text-gray-600">{item.nameEn}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="font-semibold">رقم الصنف:</span>
                  <span className="font-mono">{item.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">الوحدة:</span>
                  <span>{item.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">السعر:</span>
                  <span>{item.unitPrice} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">الحد الأدنى:</span>
                  <span>{item.minQuantity}</span>
                </div>
                {item.maxQuantity && (
                  <div className="flex justify-between">
                    <span className="font-semibold">الحد الأقصى:</span>
                    <span>{item.maxQuantity}</span>
                  </div>
                )}
                {item.description && (
                  <div className="mt-2">
                    <span className="font-semibold">الوصف:</span>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {items && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">لا توجد أصناف مضافة بعد</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول صنف
            </Button>
          </div>
        )}

        <AddItemDialog 
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
        />
      </div>
    </Layout>
  );
}
