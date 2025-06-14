
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onPasswordChanged: (newUsername: string, newPassword: string) => void;
  isLoading?: boolean;
}

export default function ChangePasswordDialog({
  isOpen,
  onPasswordChanged,
  isLoading = false,
}: ChangePasswordDialogProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم المستخدم الجديد",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "كلمة المرور ضعيفة",
        description: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ في التأكيد",
        description: "كلمة المرور وتأكيدها غير متطابقين",
        variant: "destructive",
      });
      return;
    }

    if (newUsername === 'admin' && newPassword === 'admin') {
      toast({
        title: "بيانات غير آمنة",
        description: "لا يمكن استخدام البيانات الافتراضية. يرجى اختيار بيانات أخرى",
        variant: "destructive",
      });
      return;
    }

    onPasswordChanged(newUsername, newPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" closeButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-right">تغيير بيانات المدير</DialogTitle>
              <DialogDescription className="text-right">
                يجب تغيير اسم المستخدم وكلمة المرور الافتراضية لضمان الأمان
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newUsername" className="text-right block mb-2">
              اسم المستخدم الجديد
            </Label>
            <Input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم الجديد"
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-right block mb-2">
              كلمة المرور الجديدة
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              className="text-right"
              required
            />
            <p className="text-sm text-gray-500 mt-1 text-right">
              يجب أن تكون 6 أحرف على الأقل
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-right block mb-2">
              تأكيد كلمة المرور
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="أعد إدخال كلمة المرور"
              className="text-right"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحديث...' : 'تغيير البيانات'}
            </Button>
          </DialogFooter>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-right">
            <strong>ملاحظة:</strong> لن تتمكن من الوصول للنظام إلا بعد تغيير هذه البيانات
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
