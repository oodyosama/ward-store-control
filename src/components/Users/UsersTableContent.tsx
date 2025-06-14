
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/types/warehouse';
import UserTableRow from './UserTableRow';

interface UsersTableContentProps {
  users: User[];
  onEdit: (user: User) => void;
  onManagePermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UsersTableContent({
  users,
  onEdit,
  onManagePermissions,
  onDelete,
}: UsersTableContentProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">المستخدم</TableHead>
            <TableHead className="text-right">الدور</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">آخر تسجيل دخول</TableHead>
            <TableHead className="text-right">تاريخ الإنشاء</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onManagePermissions={onManagePermissions}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
