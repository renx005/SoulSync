
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  MessageSquare
} from 'lucide-react';

export function AdminBottomNav() {
  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users
    },
    {
      href: '/admin/verifications',
      label: 'Verify',
      icon: ShieldCheck
    },
    {
      href: '/admin/community',
      label: 'Community',
      icon: MessageSquare
    },
    {
      href: '/admin/reports',
      label: 'Reports',
      icon: AlertTriangle
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-border/40 shadow-md">
      <nav className="flex items-center justify-around px-1 py-1 overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center py-2 px-2 text-[10px] font-medium",
                "transition-colors duration-200",
                isActive
                  ? "text-black dark:text-white"
                  : "text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
