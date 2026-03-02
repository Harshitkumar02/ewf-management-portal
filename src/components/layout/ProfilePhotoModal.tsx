import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash2 } from "lucide-react";
import { getCurrentUser, update, type User } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

interface ProfilePhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (photo: string | undefined) => void;
}

const ProfilePhotoModal = ({ open, onOpenChange, onUpdate }: ProfilePhotoModalProps) => {
  const currentUser = getCurrentUser();
  const [preview, setPreview] = useState<string | undefined>(currentUser?.profilePhoto);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be under 2MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!currentUser) return;
    update<User>("users", currentUser.id, { profilePhoto: preview });
    // Update session too
    const session = { ...currentUser, profilePhoto: preview };
    localStorage.setItem("ngo_db_session", JSON.stringify(session));
    onUpdate(preview);
    onOpenChange(false);
    toast({ title: "Profile photo updated" });
  };

  const handleRemove = () => {
    setPreview(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-1.5" /> Upload
            </Button>
            {preview && (
              <Button variant="outline" size="sm" onClick={handleRemove}>
                <Trash2 className="w-4 h-4 mr-1.5" /> Remove
              </Button>
            )}
          </div>
          <Button className="w-full" onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoModal;
