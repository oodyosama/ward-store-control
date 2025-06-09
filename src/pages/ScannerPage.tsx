
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, Flashlight, FlashlightOff, RotateCcw } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BarcodeScanner from '@/components/Scanner/BarcodeScanner';
import ScanResults from '@/components/Scanner/ScanResults';

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleScanResult = (data: string) => {
    setScannedData(data);
    setIsScanning(false);
    toast({
      title: "تم مسح الباركود بنجاح",
      description: `البيانات: ${data}`,
    });
  };

  const handleScanError = (error: string) => {
    toast({
      title: "خطأ في المسح",
      description: error,
      variant: "destructive",
    });
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setHasPermission(true);
      setIsScanning(true);
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
      toast({
        title: "خطأ في الوصول للكاميرا",
        description: "لا يمكن الوصول إلى الكاميرا. يرجى التأكد من منح الإذن.",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScannedData('');
    setIsScanning(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* رأس الصفحة */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ماسح الباركود</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              مسح الباركود والـ QR Code بسهولة
            </p>
          </div>
        </div>

        {/* أدوات التحكم */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end">
              <Camera className="w-5 h-5 ml-2" />
              التحكم في الماسح
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              {!isScanning ? (
                <Button
                  onClick={startScanning}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                >
                  <Camera className="w-4 h-4 ml-2" />
                  بدء المسح
                </Button>
              ) : (
                <Button
                  onClick={stopScanning}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 ml-2" />
                  إيقاف المسح
                </Button>
              )}
              
              <Button
                onClick={resetScanner}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* منطقة الماسح */}
        {isScanning && (
          <BarcodeScanner
            onScanResult={handleScanResult}
            onScanError={handleScanError}
            isActive={isScanning}
          />
        )}

        {/* نتائج المسح */}
        {scannedData && (
          <ScanResults scannedData={scannedData} />
        )}

        {/* رسالة عدم وجود إذن */}
        {hasPermission === false && (
          <Card>
            <CardContent className="p-6 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                مطلوب إذن الكاميرا
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                يحتاج الماسح إلى الوصول للكاميرا لمسح الباركود. يرجى السماح بالوصول للكاميرا وإعادة المحاولة.
              </p>
              <Button onClick={startScanning}>
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
