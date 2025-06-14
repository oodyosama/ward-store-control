
import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const handleLinkClick = () => {
    // إغلاق القائمة في الجوال عند النقر على رابط
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* خلفية شفافة للجوال */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* الشريط الجانبي */}
      <aside
        className={`
          fixed md:static inset-y-0 right-0 z-50 w-72 bg-white dark:bg-gray-800 
          shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          border-l border-gray-200 dark:border-gray-700
        `}
      >
        <SidebarHeader />
        <SidebarMenu onLinkClick={handleLinkClick} />
        <SidebarFooter />
      </aside>
    </>
  );
}
