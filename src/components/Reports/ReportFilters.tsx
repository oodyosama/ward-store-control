
import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Warehouse } from '@/types/warehouse';

interface ReportFiltersProps {
  selectedWarehouse: string;
  setSelectedWarehouse: (value: string) => void;
  warehouses: Warehouse[];
  selectedReport: string;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

export default function ReportFilters({
  selectedWarehouse,
  setSelectedWarehouse,
  warehouses,
  selectedReport,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onExportExcel,
  onExportPDF,
  onPrint
}: ReportFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات التقرير</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>المخزن</Label>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المخازن</SelectItem>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedReport === 'movement' && (
            <>
              <div>
                <Label>من تاريخ</Label>
                <Input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <Label>إلى تاريخ</Label>
                <Input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="flex items-end space-x-2 rtl:space-x-reverse">
            <Button onClick={onExportExcel} variant="outline">
              <Download className="w-4 h-4 ml-2" />
              Excel
            </Button>
            <Button onClick={onExportPDF} variant="outline">
              <FileText className="w-4 h-4 ml-2" />
              PDF
            </Button>
            <Button onClick={onPrint} variant="outline">
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
