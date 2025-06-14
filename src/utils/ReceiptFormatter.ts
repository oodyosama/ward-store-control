
import { CartItem } from './ThermalPrinterService';

export class ReceiptFormatter {
  private width: number;

  constructor(width: number) {
    this.width = width === 58 ? 32 : 48;
  }

  formatReceiptText(cart: CartItem[], total: number): string {
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
    receipt += separator + '\n';
    
    // Items header
    receipt += this.formatItemHeader(this.width) + '\n';
    receipt += dottedLine + '\n';
    
    // Items list
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      receipt += this.formatItemLine(
        `${index + 1}. ${this.truncateText(item.name, this.width - 15)}`,
        item.quantity.toString(),
        item.price.toFixed(2),
        itemTotal.toFixed(2),
        this.width
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
    
    // Footer
    receipt += this.centerText('شكراً لتسوقكم معنا', this.width) + '\n';
    receipt += this.centerText('Thank you for shopping with us', this.width) + '\n';
    receipt += '\n';
    receipt += this.centerText('للاستفسارات: 966-11-1234567', this.width) + '\n';
    receipt += this.centerText('For inquiries: 966-11-1234567', this.width) + '\n';
    receipt += '\n';
    receipt += this.centerText('تم الطباعة بواسطة نظام المخازن', this.width) + '\n';
    receipt += this.centerText('Printed by Warehouse System v1.0', this.width) + '\n';
    
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
}
