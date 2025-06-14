
export interface PrinterSettings {
  defaultPrinter: string;
  thermalPrinterIP: string;
  thermalPrinterPort: number;
  autoPrint: boolean;
  receiptWidth: number;
  printCopies: number;
  enableSound: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ThermalPrinterService {
  private settings: PrinterSettings;

  constructor() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('printerSettings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      defaultPrinter: 'thermal',
      thermalPrinterIP: '192.168.1.100',
      thermalPrinterPort: 9100,
      autoPrint: true,
      receiptWidth: 58,
      printCopies: 1,
      enableSound: true
    };
  }

  private formatReceiptText(cart: CartItem[], total: number): string {
    const width = this.settings.receiptWidth === 58 ? 32 : 48;
    const separator = '='.repeat(width);
    const date = new Date().toLocaleDateString('ar-SA');
    const time = new Date().toLocaleTimeString('ar-SA');
    
    let receipt = '';
    
    // Header
    receipt += this.centerText('نظام المخازن - نقطة البيع', width) + '\n';
    receipt += this.centerText('فاتورة مبيعات', width) + '\n';
    receipt += separator + '\n';
    receipt += `التاريخ: ${date}\n`;
    receipt += `الوقت: ${time}\n`;
    receipt += `رقم الفاتورة: ${Date.now()}\n`;
    receipt += separator + '\n';
    
    // Items
    receipt += this.padText('الصنف', 'الكمية', 'السعر', width) + '\n';
    receipt += '-'.repeat(width) + '\n';
    
    cart.forEach(item => {
      const itemName = this.truncateText(item.name, 12);
      const quantity = item.quantity.toString();
      const price = `${(item.price * item.quantity).toFixed(2)}`;
      receipt += this.padText(itemName, quantity, price, width) + '\n';
    });
    
    receipt += separator + '\n';
    receipt += this.padRight(`المجموع الكلي: ${total.toFixed(2)} ريال`, width) + '\n';
    receipt += separator + '\n';
    receipt += this.centerText('شكراً لتسوقكم معنا', width) + '\n';
    receipt += this.centerText('نظام المخازن - الإصدار 1.0', width) + '\n';
    receipt += '\n\n\n'; // Feed paper
    
    return receipt;
  }

  private centerText(text: string, width: number): string {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return ' '.repeat(padding) + text;
  }

  private padText(left: string, center: string, right: string, width: number): string {
    const centerPos = Math.floor(width / 2);
    const rightPos = width - right.length;
    
    let line = left.padEnd(centerPos - Math.floor(center.length / 2));
    line = line.substring(0, centerPos - Math.floor(center.length / 2)) + center;
    line = line.padEnd(rightPos) + right;
    
    return line.substring(0, width);
  }

  private padRight(text: string, width: number): string {
    return text.padStart(width);
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  }

  async printThermal(cart: CartItem[], total: number): Promise<void> {
    try {
      const receiptText = this.formatReceiptText(cart, total);
      
      // For web environment, we'll use the Web Serial API if available
      // or fallback to a service worker for actual thermal printing
      if ('serial' in navigator) {
        await this.printViaWebSerial(receiptText);
      } else {
        // Fallback: Send to a local print service or show message
        await this.printViaLocalService(receiptText);
      }
      
      if (this.settings.enableSound) {
        this.playPrintSound();
      }
    } catch (error) {
      console.error('Thermal printing failed:', error);
      throw new Error('فشل في الطباعة الحرارية');
    }
  }

  private async printViaWebSerial(receiptText: string): Promise<void> {
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
      
      // Print text
      await writer.write(encoder.encode(receiptText));
      
      // Cut paper
      await writer.write(new Uint8Array([0x1D, 0x56, 0x00]));
      
      writer.releaseLock();
      await port.close();
    } catch (error) {
      console.error('Web Serial printing failed:', error);
      throw error;
    }
  }

  private async printViaLocalService(receiptText: string): Promise<void> {
    try {
      // This would send the receipt to a local print service
      // For demonstration, we'll simulate the request
      const response = await fetch(`http://${this.settings.thermalPrinterIP}:${this.settings.thermalPrinterPort}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: receiptText,
          copies: this.settings.printCopies
        })
      });
      
      if (!response.ok) {
        throw new Error('Print service request failed');
      }
    } catch (error) {
      // If direct printing fails, show the receipt text for manual printing
      console.log('Receipt text for manual printing:\n', receiptText);
      throw new Error('الطباعة المباشرة غير متاحة. يرجى التحقق من إعدادات الطابعة.');
    }
  }

  private playPrintSound(): void {
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

  getSettings(): PrinterSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<PrinterSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('printerSettings', JSON.stringify(this.settings));
  }
}

export const thermalPrinter = new ThermalPrinterService();
