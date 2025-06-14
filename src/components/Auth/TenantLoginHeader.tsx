
import React from 'react';
import { Building2 } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';

export function TenantLoginHeader() {
  return (
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
        <Building2 className="w-6 h-6 text-white" />
      </div>
      <CardTitle className="text-2xl font-bold text-gray-900">
        نظام إدارة المخازن
      </CardTitle>
      <p className="text-gray-600 mt-2">
        دخول المؤسسات الرئيسية
      </p>
    </CardHeader>
  );
}
