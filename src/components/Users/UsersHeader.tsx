
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import AddUserDialog from './AddUserDialog';
import { User } from '@/types/warehouse';

interface UsersHeaderProps {
  isAddUserOpen: boolean;
  setIsAddUserOpen: (open: boolean) => void;
  isLoading: boolean;
  handleAddUser: (userData: {
    username: string;
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => Promise<void>;
}

export default function UsersHeader({
  isAddUserOpen,
  setIsAddUserOpen,
  isLoading,
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
      
      <Button 
        className="flex items-center gap-2"
        onClick={() => setIsAddUserOpen(true)}
      >
        <UserPlus className="w-4 h-4" />
        إضافة مستخدم جديد
      </Button>

      <AddUserDialog
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
        isLoading={isLoading}
      />
    </div>
  );
}
