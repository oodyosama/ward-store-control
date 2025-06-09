
import React from 'react';
import { CheckCircle, Copy, Search, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWarehouse } from '@/contexts/WarehouseContext';

interface ScanResultsProps {
  scannedData: string;
}

export default function ScanResults({ scannedData }: ScanResultsProps) {
  const { toast } = useToast();
  const { state } = useWarehouse();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scannedData);
      toast({
        title: "تم النسخ",
        description: "تم نسخ البيانات إلى الحافظة",
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "فشل في نسخ البيانات",
        variant: "destructive",
      });
    }
  };

  // البحث عن الصنف في قاعدة البيانات
  const findItem = () => {
    const parts = scannedData.split('|');
    const sku = parts[0];
    
    const item = state.items.find(item => 
      item.sku === sku || 
      item.id === sku ||
      item.name.includes(sku)
    );

    return item;
  };

  const foundItem = findItem();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-end">
          <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
          نتيجة المسح
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* البيانات المُمسوحة */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-right mb-2">البيانات المُمسوحة:</h3>
          <p className="text-sm font-mono bg-white dark:bg-gray-900 p-2 rounded border break-all text-right">
            {scannedData}
          </p>
        </div>

        {/* معلومات الصنف إذا وُجد */}
        {foundItem && (
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <div className="flex items-center justify-end mb-2">
              <Package className="w-5 h-5 ml-2 text-blue-600" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                تم العثور على الصنف
              </h3>
            </div>
            <div className="space-y-2 text-right">
              <p><span className="font-medium">الاسم:</span> {foundItem.name}</p>
              <p><span className="font-medium">رقم الصنف:</span> {foundItem.sku}</p>
              <p><span className="font-medium">الفئة:</span> {foundItem.categoryId}</p>
              <p><span className="font-medium">الوحدة:</span> {foundItem.unit}</p>
            </div>
          </div>
        )}

        {/* لم يتم العثور على الصنف */}
        {!foundItem && (
          <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 text-right mb-2">
              لم يتم العثور على الصنف
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 text-right">
              البيانات المُمسوحة غير مطابقة لأي صنف في قاعدة البيانات
            </p>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
          >
            <Copy className="w-4 h-4 ml-2" />
            نسخ البيانات
          </Button>
          
          {foundItem && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // هنا يمكن إضافة منطق للانتقال إلى صفحة تفاصيل الصنف
                toast({
                  title: "عرض تفاصيل الصنف",
                  description: `عرض تفاصيل ${foundItem.name}`,
                });
              }}
            >
              <Search className="w-4 h-4 ml-2" />
              عرض التفاصيل
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
