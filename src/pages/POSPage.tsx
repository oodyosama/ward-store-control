
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign,
  Receipt,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockItems = [
  { id: '1', name: 'عصير برتقال', price: 5.50, barcode: '123456789', category: 'مشروبات' },
  { id: '2', name: 'شيبس', price: 3.25, barcode: '987654321', category: 'وجبات خفيفة' },
  { id: '3', name: 'قهوة', price: 8.00, barcode: '456789123', category: 'مشروبات ساخنة' },
  { id: '4', name: 'شوكولاتة', price: 12.75, barcode: '789123456', category: 'حلويات' },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeSearch, setBarcodeSearch] = useState('');

  const filteredItems = mockItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.barcode.includes(barcodeSearch)
  );

  const addToCart = (item: typeof mockItems[0]) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "سلة فارغة",
        description: "يرجى إضافة عناصر إلى السلة قبل الدفع",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment processing
    toast({
      title: "تم الدفع بنجاح",
      description: `تم دفع ${getTotalAmount().toFixed(2)} ريال`,
    });
    
    clearCart();
  };

  const handleBarcodeSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeSearch) {
      const item = mockItems.find(item => item.barcode === barcodeSearch);
      if (item) {
        addToCart(item);
        setBarcodeSearch('');
        toast({
          title: "تم إضافة المنتج",
          description: `تم إضافة ${item.name} إلى السلة`,
        });
      } else {
        toast({
          title: "منتج غير موجود",
          description: "لم يتم العثور على منتج بهذا الباركود",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      toast({
        title: "سلة فارغة",
        description: "لا يوجد عناصر للطباعة",
        variant: "destructive",
      });
      return;
    }

    // Create a printable receipt
    const receiptContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>فاتورة البيع</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            text-align: right;
            margin: 20px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .receipt-info {
            margin-bottom: 20px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: right;
          }
          .items-table th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .total-section {
            border-top: 2px solid #000;
            padding-top: 10px;
            text-align: right;
          }
          .total-amount {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">نظام المخازن - نقطة البيع</div>
          <div>فاتورة مبيعات</div>
        </div>
        
        <div class="receipt-info">
          <div><strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}</div>
          <div><strong>الوقت:</strong> ${new Date().toLocaleTimeString('ar-SA')}</div>
          <div><strong>رقم الفاتورة:</strong> ${Date.now()}</div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الكمية</th>
              <th>السعر</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price.toFixed(2)} ريال</td>
                <td>${(item.price * item.quantity).toFixed(2)} ريال</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-amount">
            <strong>المجموع الكلي: ${getTotalAmount().toFixed(2)} ريال</strong>
          </div>
        </div>

        <div class="footer">
          <div>شكراً لتسوقكم معنا</div>
          <div>نظام المخازن - الإصدار 1.0</div>
        </div>
      </body>
      </html>
    `;

    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        
        // Close window after printing or if user cancels
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };

      toast({
        title: "جاري التحضير للطباعة",
        description: "سيتم فتح شاشة الطباعة قريباً",
      });
    } else {
      toast({
        title: "خطأ في الطباعة",
        description: "لم يتم فتح نافذة الطباعة. تأكد من السماح بالنوافذ المنبثقة",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              نقطة البيع (POS)
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              إدارة المبيعات ومعالجة المدفوعات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* منطقة المنتجات */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  البحث عن المنتجات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="ابحث بالاسم..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="مسح الباركود أو أدخله..."
                      value={barcodeSearch}
                      onChange={(e) => setBarcodeSearch(e.target.value)}
                      onKeyPress={handleBarcodeSearch}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المنتجات المتاحة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => addToCart(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          {item.price.toFixed(2)} ريال
                        </span>
                        <Button size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        الباركود: {item.barcode}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* منطقة السلة والدفع */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  سلة التسوق ({cart.length})
                </CardTitle>
                {cart.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    السلة فارغة
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.price.toFixed(2)} ريال × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="font-bold text-green-600 min-w-16 text-right">
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>المجموع الكلي:</span>
                        <span className="text-green-600">
                          {getTotalAmount().toFixed(2)} ريال
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={handleCheckout}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        دفع
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleCheckout}
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        نقداً
                      </Button>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={handlePrintReceipt}
                    >
                      <Receipt className="w-4 h-4" />
                      طباعة فاتورة
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
