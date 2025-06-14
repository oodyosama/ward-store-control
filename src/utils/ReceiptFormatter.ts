
import { CartItem } from './ThermalPrinterService';

export interface UserSettings {
  userName: string;
  userPhone: string;
  userEmail: string;
  userPosition: string;
  showUserInfoOnReceipt: boolean;
}

export class ReceiptFormatter {
  private width: number;
  private actualWidth: number; // Actual paper width in mm

  constructor(actualWidth: number) {
    this.actualWidth = actualWidth;
    // Character width mapping based on actual paper width
    if (actualWidth <= 57) {
      this.width = 30; // Characters per line for 57mm
    } else if (actualWidth <= 58) {
      this.width = 32; // Characters per line for 58mm (most common)
    } else if (actualWidth <= 80) {
      this.width = 48; // Characters per line for 80mm
    } else {
      this.width =32; // Default fallback
    }
  }

  formatReceiptText(
    cart: CartItem[], 
    total: number, 
    userSettings?: UserSettings,
    format: string = 'standard'
  ): string {
    const separator = '='.repeat(this.width);
    const dottedLine = '-'.repeat(this.width);
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
    receipt += this.centerText('نظام المخازن المتطور', this.width) + '\n';
    receipt += this.centerText('ADVANCED WAREHOUSE SYSTEM', this.width) + '\n';
    receipt += this.centerText('فاتورة مبيعات', this.width) + '\n';
    receipt += this.centerText('SALES INVOICE', this.width) + '\n';
    receipt += separator + '\n';
    
    // Invoice details
    receipt += this.formatLine('رقم الفاتورة:', invoiceNumber, this.width) + '\n';
    receipt += this.formatLine('Invoice No:', invoiceNumber, this.width) + '\n';
    receipt += this.formatLine('التاريخ:', date, this.width) + '\n';
    receipt += this.formatLine('Date:', date, this.width) + '\n';
    receipt += this.formatLine('الوقت:', time, this.width) + '\n';
    receipt += this.formatLine('Time:', time, this.width) + '\n';
    
    // Add user information if enabled and provided
    if (userSettings?.showUserInfoOnReceipt && userSettings) {
      receipt += dottedLine + '\n';
      receipt += this.centerText('معلومات المستخدم', this.width) + '\n';
      receipt += this.formatLine('المستخدم:', userSettings.userName, this.width) + '\n';
      if (format !== 'compact') {
        receipt += this.formatLine('المنصب:', userSettings.userPosition, this.width) + '\n';
        receipt += this.formatLine('الهاتف:', userSettings.userPhone, this.width) + '\n';
      }
    }
    
    receipt += separator + '\n';
    
    // Items header
    receipt += this.formatItemHeader(this.width, format) + '\n';
    receipt += dottedLine + '\n';
    
    // Items list
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      receipt += this.formatItemLine(
        `${index + 1}. ${this.truncateText(item.name, this.getNameWidth(format))}`,
        item.quantity.toString(),
        item.price.toFixed(2),
        itemTotal.toFixed(2),
        this.width,
        format
      ) + '\n';
    });
    
    receipt += dottedLine + '\n';
    
    // Totals section
    const subtotal = total;
    const tax = 0; // You can add tax calculation here
    const discount = 0; // You can add discount calculation here
    
    receipt += this.formatLine('المجموع الفرعي:', `${subtotal.toFixed(2)} ريال`, this.width) + '\n';
    if (tax > 0) {
      receipt += this.formatLine('الضريبة:', `${tax.toFixed(2)} ريال`, this.width) + '\n';
    }
    if (discount > 0) {
      receipt += this.formatLine('الخصم:', `${discount.toFixed(2)} ريال`, this.width) + '\n';
    }
    receipt += separator + '\n';
    receipt += this.formatTotalLine(`المجموع الكلي: ${total.toFixed(2)} ريال`, this.width) + '\n';
    receipt += this.formatTotalLine(`TOTAL: ${total.toFixed(2)} SAR`, this.width) + '\n';
    receipt += separator + '\n';
    
    // Payment info
    receipt += this.centerText('طريقة الدفع: نقداً', this.width) + '\n';
    receipt += this.centerText('Payment Method: Cash', this.width) + '\n';
    receipt += '\n';
    
    // Footer based on format
    if (format === 'detailed') {
      receipt += this.centerText('شكراً لتسوقكم معنا', this.width) + '\n';
      receipt += this.centerText('Thank you for shopping with us', this.width) + '\n';
      receipt += '\n';
      receipt += this.centerText('للاستفسارات: 966-11-1234567', this.width) + '\n';
      receipt += this.centerText('For inquiries: 966-11-1234567', this.width) + '\n';
      receipt += '\n';
      receipt += this.centerText(`تم الطباعة على ورق ${this.actualWidth}مم`, this.width) + '\n';
      receipt += this.centerText(`Printed on ${this.actualWidth}mm paper`, this.width) + '\n';
    } else if (format === 'standard') {
      receipt += this.centerText('شكراً لتسوقكم معنا', this.width) + '\n';
      receipt += this.centerText('Thank you for shopping', this.width) + '\n';
      receipt += '\n';
      receipt += this.centerText(`ورق ${this.actualWidth}مم`, this.width) + '\n';
    } else {
      // Compact format
      receipt += this.centerText('شكراً لكم', this.width) + '\n';
      receipt += '\n';
    }
    
    // Paper feed - adjusted based on format
    const feedLines = format === 'compact' ? 2 : format === 'standard' ? 3 : 4;
    receipt += '\n'.repeat(feedLines);
    
    return receipt;
  }

  private getNameWidth(format: string): number {
    const baseWidth = this.width <= 32 ? 12 : 20;
    switch (format) {
      case 'compact': return Math.floor(baseWidth * 0.8);
      case 'detailed': return Math.floor(baseWidth * 1.2);
      default: return baseWidth;
    }
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

  private formatItemHeader(width: number, format: string): string {
    if (width <= 32) {
      // For 58mm paper and smaller
      switch (format) {
        case 'compact':
          return 'الصنف'.padEnd(14) + 'ك'.padEnd(3) + 'مجموع'.padStart(15);
        case 'detailed':
          return 'الصنف'.padEnd(16) + 'كمية'.padEnd(4) + 'سعر'.padEnd(6) + 'مجموع'.padStart(6);
        default:
          return 'الصنف'.padEnd(16) + 'ك'.padEnd(3) + 'سعر'.padEnd(6) + 'مجموع'.padStart(7);
      }
    } else {
      // For 80mm paper
      switch (format) {
        case 'compact':
          return 'الصنف'.padEnd(20) + 'كمية'.padEnd(6) + 'مجموع'.padStart(22);
        case 'detailed':
          return 'اسم الصنف'.padEnd(24) + 'الكمية'.padEnd(8) + 'السعر'.padEnd(8) + 'المجموع'.padStart(8);
        default:
          return 'الصنف'.padEnd(24) + 'الكمية'.padEnd(8) + 'السعر'.padEnd(8) + 'المجموع'.padStart(8);
      }
    }
  }

  private formatItemLine(
    name: string, 
    qty: string, 
    price: string, 
    total: string, 
    width: number,
    format: string = 'standard'
  ): string {
    if (width <= 32) {
      // For 58mm paper and smaller
      switch (format) {
        case 'compact':
          return this.truncateText(name, 14).padEnd(14) + 
                 qty.padEnd(3) + 
                 total.padStart(15);
        case 'detailed':
          return this.truncateText(name, 16).padEnd(16) + 
                 qty.padEnd(4) + 
                 price.padEnd(6) + 
                 total.padStart(6);
        default:
          return this.truncateText(name, 16).padEnd(16) + 
                 qty.padEnd(3) + 
                 price.padEnd(6) + 
                 total.padStart(7);
      }
    } else {
      // For 80mm paper
      switch (format) {
        case 'compact':
          return this.truncateText(name, 20).padEnd(20) + 
                 qty.padEnd(6) + 
                 total.padStart(22);
        case 'detailed':
          return this.truncateText(name, 24).padEnd(24) + 
                 qty.padEnd(8) + 
                 price.padEnd(8) + 
                 total.padStart(8);
        default:
          return this.truncateText(name, 24).padEnd(24) + 
                 qty.padEnd(8) + 
                 price.padEnd(8) + 
                 total.padStart(8);
      }
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 2) + '..';
  }
}
