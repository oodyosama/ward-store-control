
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types/warehouse';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    username: string;
    email: string;
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => Promise<void>;
  isLoading: boolean;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'read', label: 'قراءة البيانات', description: 'عرض البيانات والتقارير' },
  { id: 'write', label: 'كتابة البيانات', description: 'إضافة وتعديل البيانات' },
  { id: 'delete', label: 'حذف البيانات', description: 'حذف البيانات' },
  { id: 'manage_users', label: 'إدارة المستخدمين', description: 'إضافة وتعديل المستخدمين' },
  { id: 'manage_inventory', label: 'إدارة المخزون', description: 'إدارة المخزون والمواد' },
  { id: 'manage_warehouses', label: 'إدارة المخازن', description: 'إضافة وتعديل المخازن' },
  { id: 'view_reports', label: 'عرض التقارير', description: 'الوصول إلى التقارير' },
  { id: 'export_data', label: 'تصدير البيانات', description: 'تصدير البيانات كـ Excel/PDF' }
];

const ROLE_PERMISSIONS = {
  admin: ['read', 'write', 'delete', 'manage_users', 'manage_inventory', 'manage_warehouses', 'view_reports', 'export_data'],
  manager: ['read', 'write', 'manage_inventory', 'manage_warehouses', 'view_reports', 'export_data'],
  warehouse_keeper: ['read', 'write', 'view_reports'],
  accountant: ['read', 'view_reports', 'export_data']
};

export default function AddUserDialog({ isOpen, onClose, onAddUser, isLoading }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'warehouse_keeper' as User['role'],
    permissions: ['read'] as string[],
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'يجب اختيار صلاحية واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (role: User['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: ROLE_PERMISSIONS[role] || ['read']
    }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    await onAddUser(formData);
    
    // Reset form on successful submission
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'warehouse_keeper',
      permissions: ['read'],
      isActive: true
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'warehouse_keeper',
      permissions: ['read'],
      isActive: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          <DialogDescription>
            أدخل بيانات المستخدم الجديد وحدد الدور والصلاحيات المناسبة
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">اسم المستخدم *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="أدخل اسم المستخدم"
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && <span className="text-sm text-red-500">{errors.username}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">كلمة المرور *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="أدخل كلمة المرور"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">الدور *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">مدير النظام</SelectItem>
                <SelectItem value="manager">مدير</SelectItem>
                <SelectItem value="warehouse_keeper">أمين مخزن</SelectItem>
                <SelectItem value="accountant">محاسب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label>الصلاحيات *</Label>
            <div className="grid gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 space-x-reverse">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                      {permission.label}
                    </Label>
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.permissions && <span className="text-sm text-red-500">{errors.permissions}</span>}
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
            />
            <Label htmlFor="isActive" className="cursor-pointer">تفعيل المستخدم</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'جاري الإضافة...' : 'إضافة المستخدم'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
