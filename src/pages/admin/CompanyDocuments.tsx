import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getAll, insert, update, remove, generateId, getCurrentUser, getLocalDate, type CompanyDocument } from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { Upload, Download, Trash2, Pencil, FileText, Search, Plus, FolderOpen } from "lucide-react";

const DEFAULT_CATEGORIES = ["Policies", "Contracts", "Financial", "HR", "Legal", "Other"];

const CompanyDocuments = () => {
  const currentUser = getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<CompanyDocument[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<CompanyDocument | null>(null);
  const [newName, setNewName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Other");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const refresh = () => setDocs(getAll<CompanyDocument>("companyDocs"));

  useEffect(() => { refresh(); }, []);

  const handleUpload = () => {
    if (!uploadFile) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    if (uploadFile.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 10MB allowed.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const doc: CompanyDocument = {
        id: generateId(),
        name: uploadFile.name.replace(/\.[^/.]+$/, ""),
        category: uploadCategory,
        fileData: reader.result as string,
        fileName: uploadFile.name,
        fileType: uploadFile.type,
        fileSize: uploadFile.size,
        uploadedBy: currentUser?.name || "Admin",
        uploadedAt: getLocalDate(),
      };
      insert("companyDocs", doc);
      refresh();
      setUploadOpen(false);
      setUploadFile(null);
      setUploadCategory("Other");
      toast({ title: "Document uploaded successfully" });
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleDownload = (doc: CompanyDocument) => {
    const link = document.createElement("a");
    link.href = doc.fileData;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRename = () => {
    if (!selectedDoc || !newName.trim()) return;
    update<CompanyDocument>("companyDocs", selectedDoc.id, { name: newName.trim() });
    refresh();
    setRenameOpen(false);
    toast({ title: "Document renamed" });
  };

  const handleDelete = () => {
    if (!selectedDoc) return;
    remove("companyDocs", selectedDoc.id);
    refresh();
    setDeleteOpen(false);
    toast({ title: "Document deleted" });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filtered = docs
    .filter((d) => categoryFilter === "all" || d.category === categoryFilter)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.fileName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="admin" userName={currentUser?.name || "Admin User"}>
      <PageHeader title="Company Documents" breadcrumbs={[{ label: "Admin" }, { label: "Documents" }]} />

      <div className="bg-card border rounded-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b">
          <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> Document Backup
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {DEFAULT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={() => setUploadOpen(true)}><Plus className="w-4 h-4 mr-1" /> Upload</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>File</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No documents found. Upload your first document.</td></tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id}>
                    <td className="font-medium"><span className="inline-flex items-center gap-2"><FileText className="w-4 h-4 text-muted-foreground shrink-0" />{d.name}</span></td>
                    <td><span className="badge-status badge-approved">{d.category}</span></td>
                    <td className="text-muted-foreground text-xs">{d.fileName}</td>
                    <td>{formatSize(d.fileSize)}</td>
                    <td>{d.uploadedAt}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(d)} title="Download"><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedDoc(d); setNewName(d.name); setRenameOpen(true); }} title="Rename"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedDoc(d); setDeleteOpen(true); }} title="Delete" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Category</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEFAULT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File (max 10MB)</Label>
              <Input ref={fileInputRef} type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}><Upload className="w-4 h-4 mr-1" /> Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Modal */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Document</DialogTitle></DialogHeader>
          <div className="py-2">
            <Label>New Name</Label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Document</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete <strong>{selectedDoc?.name}</strong>? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CompanyDocuments;
