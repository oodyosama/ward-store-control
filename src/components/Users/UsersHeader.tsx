
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { UserPlus } from 'lucide-react';
import { User } from '@/types/warehouse';

interface UsersHeaderProps {
  isAddUserOpen: boolean;
  setIsAddUserOpen: (open: boolean) => void;
  isLoading: boolean;
  newUser: {
    username: string;
    email: string;
    role: User['role'];
    isActive: boolean;
  };
  setNewUser: (user: any) => void;
  handleAddUser: () => void;
}

export default function UsersHeader({
  isAddUserOpen,
  setIsAddUserOpen,
  isLoading,
  newUser,
  setNewUser,
  handleAddUser,
}: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          إدارة المستخدمين
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          إدارة المستخدمين والأدوار والصلاحيات
        </p>
      </div>
      
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            إضافة مستخدم جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            <DialogDescription>
              أدخل بيانات المستخدم الجديد وحدد الدور المناسب له
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">الدور</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as User['role'] })}>
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
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleAddUser}
              disabled={isLoading || !newUser.username.trim() || !newUser.email.trim()}
            >
              {isLoading ? 'جاري الإضافة...' : 'إضافة المستخدم'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
