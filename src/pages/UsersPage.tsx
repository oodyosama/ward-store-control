
import React, { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import UsersHeader from '@/components/Users/UsersHeader';
import UsersStats from '@/components/Users/UsersStats';
import UsersTable from '@/components/Users/UsersTable';
import { User } from '@/types/warehouse';
import { useUsers, useAddUser } from '@/hooks/useUsers';

export default function UsersPage() {
  const { users } = useUsers();
  const { addUser } = useAddUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'warehouse_keeper' as User['role'],
    isActive: true
  });

  const handleAddUser = async () => {
    if (!newUser.username.trim() || !newUser.email.trim()) {
      return;
    }

    setIsLoading(true);
    
    const result = await addUser(newUser);
    
    if (result.success) {
      setIsAddUserOpen(false);
      setNewUser({
        username: '',
        email: '',
        role: 'warehouse_keeper',
        isActive: true
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <UsersHeader
          isAddUserOpen={isAddUserOpen}
          setIsAddUserOpen={setIsAddUserOpen}
          isLoading={isLoading}
          newUser={newUser}
          setNewUser={setNewUser}
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
