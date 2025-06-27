
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const { adminLogin } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await adminLogin(email, password);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
      navigate("/admin");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid admin credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            Admin Access
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Secure login for administrative users
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 sm:px-8 shadow sm:rounded-xl sm:px-8 border border-border/50 animate-enter">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-input bg-background/50 focus:border-gray-600 focus:ring-gray-600/30"
                    required
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-input bg-background/50 focus:border-gray-600 focus:ring-gray-600/30"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 hover:opacity-90 transition-all"
              >
                {isLoading ? "Signing in..." : "Access Admin Dashboard"}
              </Button>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="default" 
              size="sm" 
              className="mx-auto flex items-center justify-center px-4 py-2 w-full rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:opacity-90 transition-all"
              onClick={() => navigate('/auth')}
            >
              Back to main login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
