
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, UserCheck, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { login } = useUser();
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
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
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
            className="pl-10 border-input bg-background/50 focus:border-mindscape-primary focus:ring-mindscape-primary/30"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <a href="#" className="text-xs text-mindscape-primary hover:text-mindscape-secondary hover:underline transition-colors">
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
            className="pl-10 border-input bg-background/50 focus:border-mindscape-primary focus:ring-mindscape-primary/30"
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
        className="w-full mt-2 rounded-full bg-gradient-to-r from-mindscape-primary to-purple-500 hover:opacity-90 transition-all"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground">other login options</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          type="button" 
          className="flex items-center justify-center gap-2 bg-background/50 hover:bg-background"
          onClick={() => navigate('/auth/professional')}
        >
          <UserCheck className="h-4 w-4 text-blue-600" />
          <span className="text-xs sm:text-sm">Professional</span>
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="flex items-center justify-center gap-2 bg-background/50 hover:bg-background"
          onClick={() => navigate('/auth/admin')}
        >
          <ShieldCheck className="h-4 w-4 text-gray-700" />
          <span className="text-xs sm:text-sm">Admin</span>
        </Button>
      </div>
    </form>
  );
}
