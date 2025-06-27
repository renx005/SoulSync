
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface RegisterProps {
  initialRole?: UserRole;
}

export function Register({ initialRole = 'user' }: RegisterProps) {
  const { register } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [occupation, setOccupation] = useState("");
  const [identityDocument, setIdentityDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Update role when initialRole changes
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    if (role === "professional" && !occupation) {
      toast({
        variant: "destructive",
        title: "Occupation required",
        description: "Please provide your professional occupation.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(username, email, password, role, occupation, identityDocument);
      
      toast({
        title: "Account created!",
        description: role === "professional" 
          ? "Your professional account is pending admin verification." 
          : "You can now sign in with your credentials.",
      });
      
      // Always redirect to login page, regardless of user type
      navigate("/auth", { state: { initialMode: "login" } });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server
      // Here we'll just store the filename for demonstration
      setIdentityDocument(file.name);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-primary pr-10"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
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
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>I am registering as a:</Label>
        <RadioGroup 
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user" className="cursor-pointer">User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="professional" id="professional" />
            <Label htmlFor="professional" className="cursor-pointer">Professional</Label>
          </div>
        </RadioGroup>
      </div>
      
      {role === "professional" && (
        <div className="space-y-4 pt-2 border-t border-border/50">
          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-sm font-medium">
              Occupation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="occupation"
              placeholder="Psychologist, Therapist, Counselor, etc."
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="min-h-24"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="identityDocument" className="text-sm font-medium">
              Upload Identity Document
            </Label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="identityDocument"
                className="flex w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-background/50 px-3 py-4 text-sm text-muted-foreground hover:border-mindscape-primary/50 hover:bg-mindscape-light/10"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>{identityDocument || "Upload professional credentials"}</span>
                <input
                  id="identityDocument"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload credentials to verify your professional status. This will be reviewed by our team.
            </p>
          </div>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full button-primary"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
