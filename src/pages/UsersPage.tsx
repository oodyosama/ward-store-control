
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import UsersHeader from '@/components/Users/UsersHeader';
import UsersStats from '@/components/Users/UsersStats';
import UsersTable from '@/components/Users/UsersTable';
import { User } from '@/types/warehouse';
import { useUsersSimple, useAddUserSimple } from '@/hooks/useUsersSimple';

export default function UsersPage() {
  const { users, isLoading: usersLoading, refetch } = useUsersSimple();
  const { addUser } = useAddUserSimple();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = async (userData: {
    username: string;
    email: string;
    password: string;
    role: User['role'];
    permissions: string[];
    isActive: boolean;
  }) => {
    setIsLoading(true);
    
    const result = await addUser(userData);
    
    if (result.success) {
      setIsAddUserOpen(false);
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
