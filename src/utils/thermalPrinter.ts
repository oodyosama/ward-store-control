
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
    const dottedLine = '-'.repeat(width);
    const date = new Date().toLocaleDateString('ar-SA');
    const time = new Date().toLocaleTimeString('ar-SA', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    
    let receipt = '';
    
    // Header with company info
    receipt += '\n';
    receipt += this.centerText('نظام المخازن المتطور', width) + '\n';
    receipt += this.centerText('ADVANCED WAREHOUSE SYSTEM', width) + '\n';
    receipt += this.centerText('فاتورة مبيعات', width) + '\n';
    receipt += this.centerText('SALES INVOICE', width) + '\n';
    receipt += separator + '\n';
    
    // Invoice details
    receipt += this.formatLine('رقم الفاتورة:', invoiceNumber, width) + '\n';
    receipt += this.formatLine('Invoice No:', invoiceNumber, width) + '\n';
    receipt += this.formatLine('التاريخ:', date, width) + '\n';
    receipt += this.formatLine('Date:', date, width) + '\n';
    receipt += this.formatLine('الوقت:', time, width) + '\n';
    receipt += this.formatLine('Time:', time, width) + '\n';
    receipt += separator + '\n';
    
    // Items header
    receipt += this.formatItemHeader(width) + '\n';
    receipt += dottedLine + '\n';
    
    // Items list
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      receipt += this.formatItemLine(
        `${index + 1}. ${this.truncateText(item.name, width - 15)}`,
        item.quantity.toString(),
        item.price.toFixed(2),
        itemTotal.toFixed(2),
        width
      ) + '\n';
    });
    
    receipt += dottedLine + '\n';
    
    // Totals section
    const subtotal = total;
    const tax = 0; // You can add tax calculation here
    const discount = 0; // You can add discount calculation here
    
    receipt += this.formatLine('المجموع الفرعي:', `${subtotal.toFixed(2)} ريال`, width) + '\n';
    if (tax > 0) {
      receipt += this.formatLine('الضريبة:', `${tax.toFixed(2)} ريال`, width) + '\n';
    }
    if (discount > 0) {
      receipt += this.formatLine('الخصم:', `${discount.toFixed(2)} ريال`, width) + '\n';
    }
    receipt += separator + '\n';
    receipt += this.formatTotalLine(`المجموع الكلي: ${total.toFixed(2)} ريال`, width) + '\n';
    receipt += this.formatTotalLine(`TOTAL: ${total.toFixed(2)} SAR`, width) + '\n';
    receipt += separator + '\n';
    
    // Payment info
    receipt += this.centerText('طريقة الدفع: نقداً', width) + '\n';
    receipt += this.centerText('Payment Method: Cash', width) + '\n';
    receipt += '\n';
    
    // Footer
    receipt += this.centerText('شكراً لتسوقكم معنا', width) + '\n';
    receipt += this.centerText('Thank you for shopping with us', width) + '\n';
    receipt += '\n';
    receipt += this.centerText('للاستفسارات: 966-11-1234567', width) + '\n';
    receipt += this.centerText('For inquiries: 966-11-1234567', width) + '\n';
    receipt += '\n';
    receipt += this.centerText('تم الطباعة بواسطة نظام المخازن', width) + '\n';
    receipt += this.centerText('Printed by Warehouse System v1.0', width) + '\n';
    
    // Paper feed
    receipt += '\n\n\n\n';
    
    return receipt;
  }

  private centerText(text: string, width: number): string {
    if (text.length >= width) return text.substring(0, width);
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(width - text.length - padding);
  }

  private formatLine(label: string, value: string, width: number): string {
    const maxLabelWidth = Math.floor(width * 0.6);
    const maxValueWidth = width - maxLabelWidth;
    
    const truncatedLabel = this.truncateText(label, maxLabelWidth);
    const truncatedValue = this.truncateText(value, maxValueWidth);
    
    return truncatedLabel.padEnd(maxLabelWidth) + truncatedValue.padStart(maxValueWidth);
  }

  private formatTotalLine(text: string, width: number): string {
    return this.centerText(text.toUpperCase(), width);
  }

  private formatItemHeader(width: number): string {
    if (width <= 32) {
      // For 58mm paper
      return 'الصنف'.padEnd(16) + 'ك'.padEnd(3) + 'سعر'.padEnd(6) + 'مجموع'.padStart(7);
    } else {
      // For 80mm paper
      return 'الصنف'.padEnd(24) + 'الكمية'.padEnd(8) + 'السعر'.padEnd(8) + 'المجموع'.padStart(8);
    }
  }

  private formatItemLine(name: string, qty: string, price: string, total: string, width: number): string {
    if (width <= 32) {
      // For 58mm paper
      return this.truncateText(name, 16).padEnd(16) + 
             qty.padEnd(3) + 
             price.padEnd(6) + 
             total.padStart(7);
    } else {
      // For 80mm paper
      return this.truncateText(name, 24).padEnd(24) + 
             qty.padEnd(8) + 
             price.padEnd(8) + 
             total.padStart(8);
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 2) + '..';
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
          copies: this.settings.printCopies,
          width: this.settings.receiptWidth
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
