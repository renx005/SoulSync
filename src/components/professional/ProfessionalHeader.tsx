import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ProfessionalHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/professional");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="px-4 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/professional" className="flex items-center gap-2">
            <span className="text-xl font-semibold bg-gradient-to-r from-pro-primary to-pro-secondary bg-clip-text text-transparent">
              SoulSync Pro
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative p-1 rounded-full h-9 w-9 flex items-center justify-center"
              >
                <Avatar className="h-8 w-8 ring-2 ring-pro-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-pro-primary to-pro-secondary text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <ShieldCheck className="w-4 h-4 text-pro-primary fill-pro-primary stroke-white" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-pro-primary font-medium">
                    {user?.occupation || "Mental Health Professional"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/professional/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
