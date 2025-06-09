
import React, { useEffect, useRef, useState } from 'react';
import { Camera, Flashlight, FlashlightOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScanResult: (data: string) => void;
  onScanError: (error: string) => void;
  isActive: boolean;
}

export default function BarcodeScanner({ onScanResult, onScanError, isActive }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
          startScanning();
        };
      }
    } catch (error) {
      onScanError('فشل في الوصول للكاميرا');
      console.error('Camera access error:', error);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsInitialized(false);
  };

  const startScanning = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const scanFrame = () => {
      if (!isActive) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // محاولة قراءة الباركود من الصورة
      // هذا مجرد محاكاة - في التطبيق الحقيقي ستحتاج مكتبة مثل ZXing أو QuaggaJS
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // محاكاة نتيجة المسح (في التطبيق الحقيقي ستستخدم مكتبة فعلية)
      // يمكنك إضافة مكتبة مثل @zxing/library أو quagga
      
      requestAnimationFrame(scanFrame);
    };

    scanFrame();
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
        }
      }
    }
  };

  // محاكاة مسح باركود عند النقر على الفيديو
  const handleVideoClick = () => {
    // محاكاة نتيجة مسح ناجحة
    const mockBarcodeData = `ITEM_${Date.now()}`;
    onScanResult(mockBarcodeData);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover cursor-pointer"
              playsInline
              muted
              onClick={handleVideoClick}
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

          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            وجه الكاميرا نحو الباركود أو QR Code واضغط على الشاشة للمسح
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
