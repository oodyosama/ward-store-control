
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface UserSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
}

export default function UserSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
}: UserSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="ابحث عن المستخدمين..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>
      
      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="تصفية حسب الدور" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع الأدوار</SelectItem>
          <SelectItem value="admin">مدير النظام</SelectItem>
          <SelectItem value="manager">مدير</SelectItem>
          <SelectItem value="warehouse_keeper">أمين مخزن</SelectItem>
          <SelectItem value="accountant">محاسب</SelectItem>
          <SelectItem value="cashier">كاشير</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
