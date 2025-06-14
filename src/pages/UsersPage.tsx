
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import UsersHeader from '@/components/Users/UsersHeader';
import UsersStats from '@/components/Users/UsersStats';
import UsersTable from '@/components/Users/UsersTable';
import { User } from '@/types/warehouse';
import { useUsers, useAddUser } from '@/hooks/useUsers';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  const { users, isLoading: usersLoading, refetch } = useUsers();
  const { addUser } = useAddUser();
  const { state } = useWarehouse();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = state.currentUser?.role === 'admin';
  const hasManageUsersPermission = state.currentUser?.permissions?.includes('manage_users') || isAdmin;

  const handleAddUser = async (userData: {
    username: string;
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => {
    setIsLoading(true);
    
    const result = await addUser(userData);
    
    if (result.success) {
      setIsAddUserOpen(false);
      // Refresh the users list
      refetch();
    }
    
    setIsLoading(false);
  };

  if (usersLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">جاري تحميل المستخدمين...</div>
        </div>
      </Layout>
    );
  }

  // If user doesn't have permission to manage users, show limited view
  if (!hasManageUsersPermission) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                المستخدمين
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                عرض المستخدمين (صلاحيات محدودة)
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>قائمة المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-8">
                ليس لديك صلاحية لإدارة المستخدمين. يمكنك عرض المعلومات الأساسية فقط.
              </p>
              {users.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    إجمالي المستخدمين: {users.length}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <UsersHeader
          isAddUserOpen={isAddUserOpen}
          setIsAddUserOpen={setIsAddUserOpen}
          isLoading={isLoading}
          handleAddUser={handleAddUser}
        />

        <UsersStats users={users} />

        <UsersTable
          users={users}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
        />
      </div>
    </Layout>
  );
}
