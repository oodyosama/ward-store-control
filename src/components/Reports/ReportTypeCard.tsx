
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface ReportTypeCardProps {
  report: ReportType;
  isSelected: boolean;
  onClick: () => void;
}

export default function ReportTypeCard({ report, isSelected, onClick }: ReportTypeCardProps) {
  const Icon = report.icon;
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${report.color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-semibold text-lg">{report.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
