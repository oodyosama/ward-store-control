
import { ReceiptFormatter } from './ReceiptFormatter';
import { PrinterCommands } from './PrinterCommands';

export interface PrinterSettings {
  defaultPrinter: string;
  thermalPrinterIP: string;
  thermalPrinterPort: number;
  autoPrint: boolean;
  receiptWidth: number;
  receiptFormat: string;
  printCopies: number;
  enableSound: boolean;
  paperType: string;
  printQuality: string;
}

export interface UserSettings {
  userName: string;
  userPhone: string;
  userEmail: string;
  userPosition: string;
  showUserInfoOnReceipt: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ThermalPrinterService {
  private settings: PrinterSettings;
  private userSettings: UserSettings;

  constructor() {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('printerSettings');
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      defaultPrinter: 'thermal',
      thermalPrinterIP: '192.168.1.100',
      thermalPrinterPort: 9100,
      autoPrint: true,
      receiptWidth: 58, // Corrected to actual thermal paper width
      receiptFormat: 'standard',
      printCopies: 1,
      enableSound: true,
      paperType: 'thermal',
      printQuality: 'normal'
    };

    // Load user settings from localStorage
    const savedUserSettings = localStorage.getItem('userSettings');
    this.userSettings = savedUserSettings ? JSON.parse(savedUserSettings) : {
      userName: 'مستخدم النظام',
      userPhone: '+966501234567',
      userEmail: 'user@example.com',
      userPosition: 'أمين الصندوق',
      showUserInfoOnReceipt: true
    };
  }

  async printThermal(cart: CartItem[], total: number): Promise<void> {
    try {
      const formatter = new ReceiptFormatter(this.settings.receiptWidth);
      const receiptText = formatter.formatReceiptText(
        cart, 
        total, 
        this.userSettings,
        this.settings.receiptFormat
      );
      
      // For web environment, we'll use the Web Serial API if available
      // or fallback to a service worker for actual thermal printing
      if ('serial' in navigator) {
        await PrinterCommands.printViaWebSerial(
          receiptText, 
          this.settings.receiptWidth,
          this.settings.printQuality
        );
      } else {
        // Fallback: Send to a local print service or show message
        await PrinterCommands.printViaLocalService(
          receiptText,
          this.settings.thermalPrinterIP,
          this.settings.thermalPrinterPort,
          this.settings.printCopies,
          this.settings.receiptWidth,
          this.settings.printQuality
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

  getUserSettings(): UserSettings {
    return { ...this.userSettings };
  }

  updateSettings(newSettings: Partial<PrinterSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('printerSettings', JSON.stringify(this.settings));
  }

  updateUserSettings(newUserSettings: Partial<UserSettings>): void {
    this.userSettings = { ...this.userSettings, ...newUserSettings };
    localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
  }
}

export const thermalPrinter = new ThermalPrinterService();
