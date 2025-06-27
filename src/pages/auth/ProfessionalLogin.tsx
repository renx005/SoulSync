
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function ProfessionalLogin() {
  const { professionalLogin } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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
      await professionalLogin(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in as a professional.",
      });
      navigate("/professional");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again. Your account may still be pending approval.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Navigate to main auth page and set professional mode
    navigate('/auth', { state: { initialMode: 'register', role: 'professional' } });
  };
  
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-500 shadow-lg">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            Professional Login
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Access your professional SoulSync account
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 sm:px-8 shadow sm:rounded-xl sm:px-8 border border-border/50 animate-enter">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-input bg-background/50 focus:border-blue-600 focus:ring-blue-600/30"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-input bg-background/50 focus:border-blue-600 focus:ring-blue-600/30"
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
                className={cn(
                  "w-full mt-2 rounded-full",
                  "bg-gradient-to-r from-blue-600 to-purple-500 hover:opacity-90 transition-all"
                )}
              >
                {isLoading ? "Signing in..." : "Professional Sign In"}
              </Button>
              
              <div className="text-center pt-2 text-sm">
                <span className="text-muted-foreground">
                  Don't have a professional account?{" "}
                </span>
                <button 
                  type="button"
                  onClick={handleRegisterClick}
                  className="text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-500 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              onClick={() => navigate('/auth')}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Login</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
