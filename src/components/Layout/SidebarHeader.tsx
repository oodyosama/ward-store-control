
import React from 'react';
import { Warehouse } from 'lucide-react';

export default function SidebarHeader() {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
          <Warehouse className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            نظام المخازن
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            الإصدار 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
