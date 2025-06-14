
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User } from '@/types/warehouse';
import { useToast } from '@/hooks/use-toast';

interface ManagePermissionsDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, permissions: string[]) => Promise<void>;
  isLoading: boolean;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_users', label: 'إدارة المستخدمين' },
  { id: 'manage_items', label: 'إدارة الأصناف' },
  { id: 'manage_warehouses', label: 'إدارة المخازن' },
  { id: 'view_reports', label: 'عرض التقارير' },
  { id: 'manage_transactions', label: 'إدارة المعاملات' },
  { id: 'export_data', label: 'تصدير البيانات' },
  { id: 'system_settings', label: 'إعدادات النظام' },
];

export default function ManagePermissionsDialog({
  user,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
}: ManagePermissionsDialogProps) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  React.useEffect(() => {
    if (user) {
      setSelectedPermissions(user.permissions || []);
    }
  }, [user]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionId));
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await onUpdate(user.id, selectedPermissions);
      toast({
        title: "تم تحديث الصلاحيات بنجاح",
        description: `تم تحديث صلاحيات ${user.username}`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "خطأ في تحديث الصلاحيات",
        description: "حدث خطأ أثناء تحديث صلاحيات المستخدم",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إدارة الصلاحيات</DialogTitle>
          <DialogDescription>
            إدارة صلاحيات المستخدم {user?.username}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={(checked) => 
                  handlePermissionChange(permission.id, checked as boolean)
                }
              />
              <Label htmlFor={permission.id} className="text-sm font-medium">
                {permission.label}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
