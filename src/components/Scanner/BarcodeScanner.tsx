
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, FlashlightOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onScanResult: (data: string) => void;
  onScanError: (error: string) => void;
  isActive: boolean;
}

export default function BarcodeScanner({ onScanResult, onScanError, isActive }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isActive && !isInitialized) {
      initializeScanner();
    } else if (!isActive && streamRef.current) {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isActive]);

  const initializeScanner = async () => {
    try {
      console.log('Initializing barcode scanner...');
      
      // Initialize the barcode reader
      readerRef.current = new BrowserMultiFormatReader();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsInitialized(true);
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startBarcodeDetection();
        };
      }
    } catch (error) {
      console.error('Camera access error:', error);
      onScanError('فشل في الوصول للكاميرا. تأكد من منح الإذن للكاميرا.');
    }
  };

  const startBarcodeDetection = async () => {
    if (!readerRef.current || !videoRef.current || isScanning) return;
    
    console.log('Starting barcode detection...');
    setIsScanning(true);

    try {
      // Start continuous scanning
      const result = await readerRef.current.decodeFromVideoDevice(
        undefined, // Use default video device
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log('Barcode detected:', result.getText());
            onScanResult(result.getText());
            return;
          }
          
          if (error && !(error instanceof NotFoundException)) {
            console.warn('Barcode detection error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Barcode detection error:', error);
      onScanError('خطأ في قراءة الباركود');
    }
  };

  const stopScanner = () => {
    console.log('Stopping barcode scanner...');
    
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsInitialized(false);
    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && 'torch' in track.getCapabilities()) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashOn } as any]
          });
          setFlashOn(!flashOn);
        } catch (error) {
          console.error('Flash toggle error:', error);
          onScanError('فشل في تشغيل/إطفاء الفلاش');
        }
      } else {
        onScanError('الفلاش غير متوفر على هذا الجهاز');
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            
            {/* إطار المسح */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white border-opacity-50 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500"></div>
                
                {/* خط المسح المتحرك */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-green-500 animate-pulse"></div>
              </div>
            </div>

            {/* حالة المسح */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {isScanning ? 'جاري البحث عن الباركود...' : 'في انتظار بدء المسح'}
              </div>
            </div>

            {/* أدوات التحكم */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Button
                onClick={toggleFlash}
                variant="secondary"
                size="sm"
                className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              >
                {flashOn ? (
                  <FlashlightOff className="w-4 h-4" />
                ) : (
                  <Flashlight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            وجه الكاميرا نحو الباركود أو QR Code وسيتم المسح تلقائياً
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
