
import { ReceiptFormatter } from './ReceiptFormatter';
import { PrinterCommands } from './PrinterCommands';

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

  async printThermal(cart: CartItem[], total: number): Promise<void> {
    try {
      const formatter = new ReceiptFormatter(this.settings.receiptWidth);
      const receiptText = formatter.formatReceiptText(cart, total);
      
      // For web environment, we'll use the Web Serial API if available
      // or fallback to a service worker for actual thermal printing
      if ('serial' in navigator) {
        await PrinterCommands.printViaWebSerial(receiptText);
      } else {
        // Fallback: Send to a local print service or show message
        await PrinterCommands.printViaLocalService(
          receiptText,
          this.settings.thermalPrinterIP,
          this.settings.thermalPrinterPort,
          this.settings.printCopies,
          this.settings.receiptWidth
        );
      }
      
      if (this.settings.enableSound) {
        PrinterCommands.playPrintSound();
      }
    } catch (error) {
      console.error('Thermal printing failed:', error);
      throw new Error('فشل في الطباعة الحرارية');
    }
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
