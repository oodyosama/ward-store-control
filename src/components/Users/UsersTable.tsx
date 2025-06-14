
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/warehouse';
import EditUserDialog from './EditUserDialog';
import ManagePermissionsDialog from './ManagePermissionsDialog';
import UserSearchFilter from './UserSearchFilter';
import UsersTableContent from './UsersTableContent';
import { useUserActions } from '@/hooks/useUserActions';

interface UsersTableProps {
  users: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  onRefresh: () => void;
}

export default function UsersTable({
  users,
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  onRefresh,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  
  const { updateUser, updateUserPermissions, deleteUser, isLoading } = useUserActions();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`هل أنت متأكد من إلغاء تفعيل المستخدم ${user.username}؟`)) {
      try {
        await deleteUser(user.id);
        onRefresh();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    await updateUser(userId, userData);
    onRefresh();
  };

  const handleUpdatePermissions = async (userId: string, permissions: string[]) => {
    await updateUserPermissions(userId, permissions);
    onRefresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            إدارة المستخدمين وأدوارهم وصلاحياتهم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserSearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />

          <UsersTableContent
            users={filteredUsers}
            onEdit={handleEdit}
            onManagePermissions={handleManagePermissions}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <EditUserDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdateUser}
        isLoading={isLoading}
      />

      <ManagePermissionsDialog
        user={selectedUser}
        isOpen={isPermissionsDialogOpen}
        onClose={() => {
          setIsPermissionsDialogOpen(false);
          setSelectedUser(null);
        }}
        onUpdate={handleUpdatePermissions}
        isLoading={isLoading}
      />
    </>
  );
}
