
export class PrinterCommands {
  static async printViaWebSerial(receiptText: string): Promise<void> {
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
    receiptWidth: number
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
          width: receiptWidth
        })
      });
      
      if (!response.ok) {
        throw new Error('Print service request failed');
      }
    } catch (error) {
      // If direct printing fails, show the receipt text for manual printing
      console.log('Receipt text for thermal printing:\n', receiptText);
      throw new Error('الطباعة المباشرة غير متاحة. يرجى التحقق من إعدادات الطابعة.');
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
