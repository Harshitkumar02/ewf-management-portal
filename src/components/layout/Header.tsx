import { Building2, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  userName?: string;
  role?: string;
}

const Header = ({ userName = "Admin User", role = "Admin" }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b flex items-center justify-between px-4 shadow-sm">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-heading font-bold text-lg text-foreground hidden sm:block">
          NGO Management Portal
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-foreground leading-tight">{userName}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
