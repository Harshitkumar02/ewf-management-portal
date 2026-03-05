import { useState } from "react";
import { Building2, LogOut, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useSidebarState } from "./SidebarContext";
import { getCurrentUser } from "@/lib/db";
import ProfilePhotoModal from "./ProfilePhotoModal";

interface HeaderProps {
  userName?: string;
  role?: string;
}

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  management: "Management",
  manager: "Project Manager",
  employee: "Employee",
};

const Header = ({ userName = "Admin User", role = "admin" }: HeaderProps) => {
  const { setMobileOpen } = useSidebarState();
  const currentUser = getCurrentUser();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(currentUser?.profilePhoto);

  const canEditPhoto = role === "admin" || role === "management" || role === "manager" || role === "employee";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground hidden sm:block">
              NGO Management Portal
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => canEditPhoto && setPhotoModalOpen(true)}
              className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ${canEditPhoto ? "cursor-pointer ring-offset-background hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 transition-all" : ""}`}
              title={canEditPhoto ? "Edit profile photo" : undefined}
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </button>
            <div className="hidden sm:block">
              <p className="font-medium text-foreground leading-tight">{userName}</p>
              <p className="text-xs text-muted-foreground">{roleLabels[role] || role}</p>
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

      {canEditPhoto && (
        <ProfilePhotoModal
          open={photoModalOpen}
          onOpenChange={setPhotoModalOpen}
          onUpdate={setProfilePhoto}
        />
      )}
    </>
  );
};

export default Header;
