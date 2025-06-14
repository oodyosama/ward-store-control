
export class PrinterCommands {
  static async printViaWebSerial(
    receiptText: string, 
    paperWidth: number = 58,
    printQuality: string = 'normal'
  ): Promise<void> {
    try {
      // Request serial port access
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      const writer = port.writable.getWriter();
      
      // ESC/POS commands for thermal printer
      const encoder = new TextEncoder();
      
      // Initialize printer
      await writer.write(new Uint8Array([0x1B, 0x40])); // ESC @
      
      // Set character set to Arabic/UTF-8
      await writer.write(new Uint8Array([0x1C, 0x43, 0xFF]));
      
      // Set print quality based on settings
      switch (printQuality) {
        case 'draft':
          await writer.write(new Uint8Array([0x1B, 0x21, 0x01])); // Fast mode
          break;
        case 'high':
          await writer.write(new Uint8Array([0x1B, 0x21, 0x20])); // High quality
          break;
        default:
          await writer.write(new Uint8Array([0x1B, 0x21, 0x00])); // Normal mode
      }
      
      // Set paper width specific commands
      if (paperWidth <= 58) {
        // For 58mm paper - set narrower margins
        await writer.write(new Uint8Array([0x1D, 0x4C, 0x00, 0x00])); // Left margin
        await writer.write(new Uint8Array([0x1D, 0x57, 0x60])); // Print area width (384 dots for 58mm)
      } else if (paperWidth <= 80) {
        // For 80mm paper - set wider margins
        await writer.write(new Uint8Array([0x1D, 0x4C, 0x00, 0x00])); // Left margin
        await writer.write(new Uint8Array([0x1D, 0x57, 0x20, 0x02])); // Print area width (576 dots for 80mm)
      }
      
      // Set text alignment to center for header
      await writer.write(new Uint8Array([0x1B, 0x61, 0x01])); // ESC a 1
      
      // Print text
      await writer.write(encoder.encode(receiptText));
      
      // Reset alignment
      await writer.write(new Uint8Array([0x1B, 0x61, 0x00])); // ESC a 0
      
      // Cut paper (full cut)
      await writer.write(new Uint8Array([0x1D, 0x56, 0x00]));
      
      writer.releaseLock();
      await port.close();
    } catch (error) {
      console.error('Web Serial printing failed:', error);
      throw error;
    }
  }

  static async printViaLocalService(
    receiptText: string, 
    printerIP: string, 
    printerPort: number, 
    printCopies: number, 
    receiptWidth: number,
    printQuality: string = 'normal'
  ): Promise<void> {
    try {
      // This would send the receipt to a local print service
      // For demonstration, we'll simulate the request
      const response = await fetch(`http://${printerIP}:${printerPort}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: receiptText,
          copies: printCopies,
          width: receiptWidth,
          quality: printQuality,
          paperSize: `${receiptWidth}mm`
        })
      });
      
      if (!response.ok) {
        throw new Error('Print service request failed');
      }
    } catch (error) {
      // If direct printing fails, show the receipt text for manual printing
      console.log(`Receipt text for ${receiptWidth}mm thermal printing:\n`, receiptText);
      throw new Error(`الطباعة المباشرة غير متاحة للطابعة ${receiptWidth}مم. يرجى التحقق من إعدادات الطابعة.`);
    }
  }

  static playPrintSound(): void {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}
