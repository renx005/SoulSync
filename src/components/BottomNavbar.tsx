
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, MessageSquare, BarChart2, Flower } from "lucide-react";

interface BottomNavbarProps {
  className?: string;
}

export function BottomNavbar({ className }: BottomNavbarProps) {
  const location = useLocation();
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/"
    },
    {
      label: "Journal",
      icon: BookOpen,
      href: "/journal"
    },
    {
      label: "Community",
      icon: MessageSquare,
      href: "/community"
    },
    {
      label: "Mindful",
      icon: Flower,
      href: "/mindful"
    },
    {
      label: "Insights",
      icon: BarChart2,
      href: "/insights"
    }
  ];
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-around bg-background/80 backdrop-blur-md border-t border-border/50",
      className
    )}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link 
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-16 py-1 transition-all",
              isActive ? "text-mindscape-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all",
              isActive && "bg-mindscape-light"
            )}>
              <item.icon className={cn(
                "h-5 w-5 transition-all",
                isActive ? "animate-scale-in" : "opacity-70"
              )} />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
