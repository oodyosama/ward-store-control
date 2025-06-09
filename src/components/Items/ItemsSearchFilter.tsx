
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ItemsSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function ItemsSearchFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}: ItemsSearchFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث عن الأصناف بالاسم أو رقم الصنف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="تصفية حسب الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="cat1">مواد خام</SelectItem>
              <SelectItem value="cat2">منتج نهائي</SelectItem>
              <SelectItem value="cat3">مواد تغليف</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            تصفية متقدمة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
