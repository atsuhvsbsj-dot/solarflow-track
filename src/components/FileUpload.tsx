import { useState, useRef } from "react";
import { Upload, Download, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fileUploadService } from "@/services/fileUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FileUploadProps {
  customerId: string;
  documentName: string;
  existingFileUrl?: string;
  existingFilePath?: string;
  onUploadComplete: (fileUrl: string, filePath: string) => void;
  onDelete?: () => void;
  acceptedFormats?: string;
}

export function FileUpload({
  customerId,
  documentName,
  existingFileUrl,
  existingFilePath,
  onUploadComplete,
  onDelete,
  acceptedFormats = ".pdf,.jpg,.jpeg,.png,.docx",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = fileUploadService.validateFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { fileUrl, filePath } = await fileUploadService.uploadDocument(
        customerId,
        documentName,
        file
      );
      onUploadComplete(fileUrl, filePath);

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (existingFileUrl) {
      window.open(existingFileUrl, "_blank");
      toast({
        title: "Download Started",
        description: `Downloading ${documentName}`,
      });
    }
  };

  const handleDelete = async () => {
    if (existingFilePath && onDelete) {
      try {
        await fileUploadService.deleteDocument(existingFilePath);
        onDelete();
        toast({
          title: "File Deleted",
          description: "The file has been removed",
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: error instanceof Error ? error.message : "Failed to delete file",
          variant: "destructive",
        });
      }
    }
  };

  const getFileIcon = () => {
    if (!existingFileUrl) return <FileText className="h-4 w-4" />;

    const ext = existingFileUrl.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "docx":
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const isImage = existingFileUrl?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${customerId}-${documentName}`}
        disabled={uploading}
      />

      {existingFileUrl ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{documentName}</p>
            <p className="text-xs text-muted-foreground">Uploaded</p>
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
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`file-${customerId}-${documentName}`}
          className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">
            {uploading ? "Uploading..." : "Click to upload"}
          </span>
          <Badge variant="outline" className="text-xs">
            {acceptedFormats.replace(/\./g, "").replace(/,/g, ", ").toUpperCase()}
          </Badge>
        </label>
      )}

      {isImage && existingFileUrl && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{documentName}</DialogTitle>
            </DialogHeader>
            <img
              src={existingFileUrl}
              alt={documentName}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
