
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { menuItems, systemItems } from './menuConfig';
import { useWarehouse } from '@/contexts/WarehouseContext';
import { useAuth } from '@/hooks/useAuth';

interface SidebarMenuProps {
  onLinkClick: () => void;
}

export default function SidebarMenu({ onLinkClick }: SidebarMenuProps) {
  const { state } = useWarehouse();
  const { hasPermission, isAdmin } = useAuth();
  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const checkPermissions = (requiredPermissions: string[]) => {
    if (isAdmin) return true;
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const filteredMenuItems = menuItems.filter(item => 
    checkPermissions(item.permissions)
  );

  const filteredSystemItems = systemItems.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return checkPermissions(item.permissions);
  });

  return (
    <div className="flex-1 overflow-y-auto py-6">
      <nav className="px-4 space-y-2">
        {filteredMenuItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              القائمة الرئيسية
            </h3>
            
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isActive
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-[1.02]'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 ml-3 transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      <div className="flex-1 text-right">
                        <div className={`${isActive ? 'text-white' : ''}`}>
                          {item.label}
                        </div>
                        <div className={`text-xs ${
                          isActive ? 'text-gray-100' : 'text-gray-400'
                        }`}>
                          {item.labelEn}
                        </div>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}

        {filteredSystemItems.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              النظام
            </h3>
            
            {filteredSystemItems.map((item) => {
              const Icon = item.icon;
              const showBadge = item.badge && item.path === '/notifications' && unreadNotifications > 0;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`
                  }
                >
                  <>
                    <div className="relative">
                      <Icon className="w-5 h-5 ml-3" />
                      {showBadge && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs p-0"
                        >
                          {unreadNotifications}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-400">{item.labelEn}</div>
                    </div>
                  </>
                </NavLink>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
}
