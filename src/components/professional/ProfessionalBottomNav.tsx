
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Users,
  Settings
} from 'lucide-react';

export function ProfessionalBottomNav() {
  const location = useLocation();
  
  const navItems = [
    {
      href: '/professional',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/professional/community',
      label: 'Community',
      icon: Users
    },
    {
      href: '/professional/settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
      <nav className="flex items-center justify-around px-1 py-1 max-w-7xl mx-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-pro-primary bg-pro-light dark:bg-pro-primary/10"
                    : "text-gray-500 hover:text-pro-primary hover:bg-gray-100 dark:hover:bg-gray-800"
                )
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
