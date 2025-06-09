
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDialogProps {
  isQRDialogOpen: boolean;
  setIsQRDialogOpen: (open: boolean) => void;
  selectedItem: any;
}

export default function QRCodeDialog({ isQRDialogOpen, setIsQRDialogOpen, selectedItem }: QRCodeDialogProps) {
  return (
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
  );
}
