import { useState, useRef } from "react";
import { Upload, Download, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saveFile, downloadFile, deleteFile, getFile, UploadedFile } from "@/utils/fileStorage";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileUploadProps {
  documentId: string;
  documentName: string;
  existingFileId?: string;
  onUploadComplete: (fileId: string) => void;
  onDelete?: () => void;
  acceptedFormats?: string;
}

export function FileUpload({
  documentId,
  documentName,
  existingFileId,
  onUploadComplete,
  onDelete,
  acceptedFormats = ".pdf,.jpg,.jpeg,.png,.docx",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const existingFile = existingFileId ? getFile(existingFileId) : null;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadedFile = await saveFile(file, documentId);
      onUploadComplete(uploadedFile.id);
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (existingFile) {
      downloadFile(existingFile);
      toast({
        title: "Download Started",
        description: `Downloading ${existingFile.name}`,
      });
    }
  };

  const handleDelete = () => {
    if (existingFile && onDelete) {
      deleteFile(existingFile.id);
      onDelete();
      toast({
        title: "File Deleted",
        description: "The file has been removed",
      });
    }
  };

  const getFileIcon = () => {
    if (!existingFile) return <FileText className="h-4 w-4" />;
    
    const ext = existingFile.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isImage = existingFile?.type.startsWith('image/');

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${documentId}`}
      />

      {existingFile ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{existingFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(existingFile.uploadDate).toLocaleDateString()} • {(existingFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <div className="flex gap-1">
            {isImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(true)}
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Re-upload"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`file-${documentId}`}
          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">
            {uploading ? "Uploading..." : "Click to upload"}
          </span>
          <Badge variant="outline" className="text-xs">
            {acceptedFormats.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()}
          </Badge>
        </label>
      )}

      {/* Image Preview Dialog */}
      {isImage && existingFile && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{existingFile.name}</DialogTitle>
            </DialogHeader>
            <img
              src={existingFile.base64Data}
              alt={existingFile.name}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
