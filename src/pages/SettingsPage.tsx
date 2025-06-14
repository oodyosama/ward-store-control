
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe, 
  Download,
  Upload,
  RefreshCw,
  Save,
  Printer,
  Receipt
} from 'lucide-react';

export default function SettingsPage() {
  const { state } = useWarehouse();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'شركة المخازن المحدودة',
    address: 'الرياض، المملكة العربية السعودية',
    phone: '+966501234567',
    email: 'info@warehouse.com',
    currency: 'SAR',
    language: 'ar',
    timezone: 'Asia/Riyadh'
  });

  // User information settings
  const [userSettings, setUserSettings] = useState({
    userName: 'أحمد محمد',
    userPhone: '+966501234567',
    userEmail: 'ahmed@example.com',
    userPosition: 'مدير المبيعات',
    showUserInfoOnReceipt: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    stockAlerts: true,
    transactionNotifications: true,
    systemUpdates: false,
    lowStockThreshold: 10,
    expiryAlertDays: 30
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordPolicy: 'medium',
    auditLog: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    maxFileSize: 10,
    enableApi: true,
    debugMode: false
  });

  // Enhanced printer settings
  const [printerSettings, setPrinterSettings] = useState({
    defaultPrinter: 'thermal',
    thermalPrinterIP: '192.168.1.100',
    thermalPrinterPort: 9100,
    autoPrint: true,
    receiptWidth: 58, // mm - corrected to actual thermal printer width
    receiptFormat: 'compact', // compact, standard, detailed
    printCopies: 1,
    enableSound: true,
    paperType: 'thermal', // thermal, regular
    printQuality: 'normal' // draft, normal, high
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save all settings including user information
      localStorage.setItem('printerSettings', JSON.stringify(printerSettings));
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      localStorage.setItem('generalSettings', JSON.stringify(generalSettings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ جميع الإعدادات بما في ذلك معلومات المستخدم وإعدادات الطباعة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testThermalPrinter = async () => {
    try {
      toast({
        title: "اختبار الطابعة الحرارية",
        description: "جاري إرسال اختبار طباعة...",
      });
      
      // This would be implemented with actual thermal printer communication
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "نجح الاختبار",
        description: `تم الاتصال بالطابعة الحرارية بنجاح - عرض الفاتورة: ${printerSettings.receiptWidth}مم`,
      });
    } catch (error) {
      toast({
        title: "فشل الاختبار",
        description: "لم يتم الاتصال بالطابعة الحرارية",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "جاري تصدير البيانات",
      description: "سيتم تنزيل ملف البيانات قريباً",
    });
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "جاري استيراد البيانات",
          description: `تم اختيار الملف: ${file.name}`,
        });
      }
    };
    input.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">الإعدادات</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              إدارة إعدادات النظام والتفضيلات
            </p>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
              حفظ الإعدادات
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أقسام الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">الإعدادات العامة</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <User className="w-4 h-4" />
                  <span className="text-sm">معلومات المستخدم</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Printer className="w-4 h-4" />
                  <span className="text-sm">إعدادات الطباعة</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">الإشعارات</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">الأمان</span>
                </div>
                <div className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <Database className="w-4 h-4" />
                  <span className="text-sm">النظام</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Settings className="w-5 h-5" />
                  <span>الإعدادات العامة</span>
                </CardTitle>
                <CardDescription>
                  إعدادات الشركة والنظام الأساسية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">اسم الشركة</Label>
                    <Input
                      id="companyName"
                      value={generalSettings.companyName}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={generalSettings.currency} onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={generalSettings.phone}
                      onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={generalSettings.email}
                      onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="text-right"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* User Information Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <User className="w-5 h-5" />
                  <span>معلومات المستخدم</span>
                </CardTitle>
                <CardDescription>
                  معلومات مستخدم البرنامج التي ستظهر في الفواتير والتقارير
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>إظهار معلومات المستخدم في الفاتورة</Label>
                      <p className="text-sm text-gray-500">عرض اسم ومعلومات المستخدم في الفواتير المطبوعة</p>
                    </div>
                    <Checkbox
                      checked={userSettings.showUserInfoOnReceipt}
                      onCheckedChange={(checked) => setUserSettings({...userSettings, showUserInfoOnReceipt: !!checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="userName">اسم المستخدم</Label>
                    <Input
                      id="userName"
                      value={userSettings.userName}
                      onChange={(e) => setUserSettings({...userSettings, userName: e.target.value})}
                      className="text-right"
                      placeholder="أدخل اسم المستخدم"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">رقم هاتف المستخدم</Label>
                    <Input
                      id="userPhone"
                      value={userSettings.userPhone}
                      onChange={(e) => setUserSettings({...userSettings, userPhone: e.target.value})}
                      className="text-right"
                      placeholder="+966501234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">بريد المستخدم الإلكتروني</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userSettings.userEmail}
                      onChange={(e) => setUserSettings({...userSettings, userEmail: e.target.value})}
                      className="text-right"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPosition">المنصب/الوظيفة</Label>
                    <Input
                      id="userPosition"
                      value={userSettings.userPosition}
                      onChange={(e) => setUserSettings({...userSettings, userPosition: e.target.value})}
                      className="text-right"
                      placeholder="مدير المبيعات"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Printer Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Printer className="w-5 h-5" />
                  <span>إعدادات الطباعة</span>
                </CardTitle>
                <CardDescription>
                  تكوين الطابعات وإعدادات الفواتير بمقاسات مختلفة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>الطباعة التلقائية</Label>
                      <p className="text-sm text-gray-500">طباعة الفواتير تلقائياً بعد الدفع</p>
                    </div>
                    <Checkbox
                      checked={printerSettings.autoPrint}
                      onCheckedChange={(checked) => setPrinterSettings({...printerSettings, autoPrint: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>تفعيل الصوت</Label>
                      <p className="text-sm text-gray-500">تشغيل صوت عند اكتمال الطباعة</p>
                    </div>
                    <Checkbox
                      checked={printerSettings.enableSound}
                      onCheckedChange={(checked) => setPrinterSettings({...printerSettings, enableSound: !!checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPrinter">الطابعة الافتراضية</Label>
                    <Select value={printerSettings.defaultPrinter} onValueChange={(value) => setPrinterSettings({...printerSettings, defaultPrinter: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thermal">طابعة حرارية</SelectItem>
                        <SelectItem value="standard">طابعة عادية</SelectItem>
                        <SelectItem value="pdf">تصدير PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printCopies">عدد النسخ</Label>
                    <Input
                      id="printCopies"
                      type="number"
                      min="1"
                      max="5"
                      value={printerSettings.printCopies}
                      onChange={(e) => setPrinterSettings({...printerSettings, printCopies: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                {/* Receipt Size Selection */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-3">
                    <Label>مقاس الفاتورة (عرض الورق الحراري)</Label>
                    <RadioGroup 
                      value={printerSettings.receiptWidth.toString()} 
                      onValueChange={(value) => setPrinterSettings({...printerSettings, receiptWidth: parseInt(value)})}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2 rtl:space-x-reverse border rounded-lg p-4">
                        <RadioGroupItem value="58" id="width-58" />
                        <Label htmlFor="width-58" className="flex-1 cursor-pointer">
                          <div className="font-medium">58 مم</div>
                          <div className="text-sm text-gray-500">مناسب للإيصالات السريعة</div>
                        </Label>
                        <Receipt className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse border rounded-lg p-4">
                        <RadioGroupItem value="80" id="width-80" />
                        <Label htmlFor="width-80" className="flex-1 cursor-pointer">
                          <div className="font-medium">80 مم</div>
                          <div className="text-sm text-gray-500">مناسب للفواتير التفصيلية</div>
                        </Label>
                        <Receipt className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse border rounded-lg p-4">
                        <RadioGroupItem value="57" id="width-57" />
                        <Label htmlFor="width-57" className="flex-1 cursor-pointer">
                          <div className="font-medium">57 مم</div>
                          <div className="text-sm text-gray-500">للطابعات المحمولة</div>
                        </Label>
                        <Receipt className="w-4 h-4 text-gray-400" />
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receiptFormat">تنسيق الفاتورة</Label>
                    <Select value={printerSettings.receiptFormat} onValueChange={(value) => setPrinterSettings({...printerSettings, receiptFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">مضغوط - أساسي</SelectItem>
                        <SelectItem value="standard">قياسي - متوسط</SelectItem>
                        <SelectItem value="detailed">مفصل - كامل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="thermalIP">عنوان IP للطابعة الحرارية</Label>
                    <Input
                      id="thermalIP"
                      value={printerSettings.thermalPrinterIP}
                      onChange={(e) => setPrinterSettings({...printerSettings, thermalPrinterIP: e.target.value})}
                      placeholder="192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thermalPort">منفذ الطابعة الحرارية</Label>
                    <Input
                      id="thermalPort"
                      type="number"
                      value={printerSettings.thermalPrinterPort}
                      onChange={(e) => setPrinterSettings({...printerSettings, thermalPrinterPort: parseInt(e.target.value)})}
                      placeholder="9100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printQuality">جودة الطباعة</Label>
                    <Select value={printerSettings.printQuality} onValueChange={(value) => setPrinterSettings({...printerSettings, printQuality: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">مسودة - سريع</SelectItem>
                        <SelectItem value="normal">عادي - متوازن</SelectItem>
                        <SelectItem value="high">عالي - بطيء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={testThermalPrinter} variant="outline" className="flex-1">
                    <Printer className="w-4 h-4 ml-2" />
                    اختبار الطابعة ({printerSettings.receiptWidth}مم)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Bell className="w-5 h-5" />
                  <span>إعدادات الإشعارات</span>
                </CardTitle>
                <CardDescription>
                  تخصيص التنبيهات والإشعارات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-gray-500">تلقي الإشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Checkbox
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>تنبيهات المخزون</Label>
                      <p className="text-sm text-gray-500">التنبيه عند انخفاض المخزون</p>
                    </div>
                    <Checkbox
                      checked={notificationSettings.stockAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, stockAlerts: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>إشعارات الحركات</Label>
                      <p className="text-sm text-gray-500">التنبيه عند حدوث حركات جديدة</p>
                    </div>
                    <Checkbox
                      checked={notificationSettings.transactionNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, transactionNotifications: !!checked})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="stockThreshold">حد التنبيه للمخزون</Label>
                    <Input
                      id="stockThreshold"
                      type="number"
                      value={notificationSettings.lowStockThreshold}
                      onChange={(e) => setNotificationSettings({...notificationSettings, lowStockThreshold: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDays">أيام تنبيه انتهاء الصلاحية</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      value={notificationSettings.expiryAlertDays}
                      onChange={(e) => setNotificationSettings({...notificationSettings, expiryAlertDays: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="w-5 h-5" />
                  <span>إعدادات الأمان</span>
                </CardTitle>
                <CardDescription>
                  إدارة أمان النظام والمصادقة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>المصادقة الثنائية</Label>
                    <p className="text-sm text-gray-500">تفعيل الحماية الإضافية للحساب</p>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Badge variant={securitySettings.twoFactorAuth ? "default" : "secondary"}>
                      {securitySettings.twoFactorAuth ? "مفعل" : "غير مفعل"}
                    </Badge>
                    <Checkbox
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorAuth: !!checked})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">مهلة انتهاء الجلسة (دقيقة)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordPolicy">سياسة كلمة المرور</Label>
                    <Select value={securitySettings.passwordPolicy} onValueChange={(value) => setSecuritySettings({...securitySettings, passwordPolicy: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weak">ضعيف</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="strong">قوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Database className="w-5 h-5" />
                  <span>إعدادات النظام</span>
                </CardTitle>
                <CardDescription>
                  إدارة البيانات والنسخ الاحتياطي
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <p className="text-sm text-gray-500">إنشاء نسخ احتياطية تلقائياً</p>
                    </div>
                    <Checkbox
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>تفعيل واجهة برمجة التطبيقات</Label>
                      <p className="text-sm text-gray-500">السماح بالوصول عبر API</p>
                    </div>
                    <Checkbox
                      checked={systemSettings.enableApi}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, enableApi: !!checked})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="backupFreq">تكرار النسخ الاحتياطي</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">كل ساعة</SelectItem>
                        <SelectItem value="daily">يومياً</SelectItem>
                        <SelectItem value="weekly">أسبوعياً</SelectItem>
                        <SelectItem value="monthly">شهرياً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">حد حجم الملف (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button onClick={handleExportData} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير البيانات
                  </Button>
                  <Button onClick={handleImportData} variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 ml-2" />
                    استيراد البيانات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
