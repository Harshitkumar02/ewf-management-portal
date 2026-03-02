import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, initDB } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

// Initialize DB on first load
initDB();

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (!user) {
      toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
      return;
    }
    const routes: Record<string, string> = {
      admin: "/admin/dashboard",
      management: "/management/dashboard",
      manager: "/manager/dashboard",
      employee: "/employee/dashboard",
    };
    toast({ title: `Welcome, ${user.name}!`, description: `Logged in as ${user.role}` });
    navigate(routes[user.role] || "/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-9 h-9 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-heading font-bold text-foreground">NGO Management Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="mt-6 p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>Admin:</span><span>admin@ngo.org / admin123</span>
              <span>Management:</span><span>nadia@ngo.org / nadia123</span>
              <span>Manager:</span><span>rahul@ngo.org / rahul123</span>
              <span>Employee:</span><span>aisha@ngo.org / aisha123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
