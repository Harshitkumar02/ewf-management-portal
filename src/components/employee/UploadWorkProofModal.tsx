import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UploadWorkProofModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: { description: string; fileName: string; fileData: string }) => void;
}

const UploadWorkProofModal = ({ open, onOpenChange, onSubmit }: UploadWorkProofModalProps) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
      return;
    }

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
      return;
    }
    if (!description.trim()) {
      toast({ title: "Description required", description: "Please add a brief description.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        onSubmit?.({
          description: description.trim(),
          fileName: file.name,
          fileData: reader.result as string,
        });
        toast({ title: "Work proof uploaded", description: `"${file.name}" submitted successfully.` });
        handleClose();
      };
      reader.onerror = () => {
        toast({ title: "Upload failed", description: "Could not read the file. Please try again.", variant: "destructive" });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading work proof:", error);
      toast({ title: "Upload failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" /> Upload Work Proof
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="work-description">Description</Label>
            <Textarea
              id="work-description"
              placeholder="Describe the work completed…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="work-file">Attach File (image, PDF, doc — max 5MB)</Label>
            <Input
              id="work-file"
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeFile}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {preview && (
            <img src={preview} alt="Preview" className="rounded-md max-h-40 object-contain w-full border" />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Uploading…" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadWorkProofModal;
