
import React from 'react';
import Layout from '@/components/Layout/Layout';
import Dashboard from './Dashboard';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

const Index = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  );
};

export default Index;
