
import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface DashboardWelcomeProps {
  username: string;
}

export default function DashboardWelcome({ username }: DashboardWelcomeProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            مرحباً، {username}
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            إليك نظرة سريعة على حالة المخازن اليوم
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-sm text-blue-100">اليوم</p>
          <p className="text-lg font-semibold">
            {format(new Date(), 'EEEE، d MMMM yyyy', { locale: ar })}
          </p>
        </div>
      </div>
    </div>
  );
}
