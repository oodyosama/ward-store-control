
import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

export default function Sidebar() {
  const handleLinkClick = () => {
    // لا حاجة لإغلاق القائمة لأنها ثابتة
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-800 shadow-xl border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
      <SidebarHeader />
      <SidebarMenu onLinkClick={handleLinkClick} />
      <SidebarFooter />
    </aside>
  );
}
