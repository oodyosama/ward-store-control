
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield,
  Users
} from 'lucide-react';
import { User } from '@/types/warehouse';

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTableRow({
  user,
  onEdit,
  onManagePermissions,
  onDelete,
}: UserTableRowProps) {
  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'warehouse_keeper':
        return 'secondary';
      case 'accountant':
        return 'outline';
      case 'cashier':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'مدير النظام';
      case 'manager':
        return 'مدير';
      case 'warehouse_keeper':
        return 'أمين مخزن';
      case 'accountant':
        return 'محاسب';
      case 'cashier':
        return 'كاشير';
      default:
        return role;
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className="font-medium">{user.username}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.isActive ? "default" : "secondary"}>
          {user.isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {user.lastLogin ? user.lastLogin.toLocaleDateString('ar-SA') : 'لم يسجل دخول'}
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {user.createdAt.toLocaleDateString('ar-SA')}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="mr-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManagePermissions(user)}>
              <Shield className="mr-2 h-4 w-4" />
              إدارة الصلاحيات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              إلغاء التفعيل
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
