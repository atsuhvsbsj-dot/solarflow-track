import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/FileUpload";
import { Document, Status } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityUtils";
import { useAuth } from "@/contexts/AuthContext";
import { autoDetectDocumentStatus } from "@/utils/progressUtils";

interface DocumentEditModalProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (doc: Document) => void;
}

export const DocumentEditModal = ({ document, open, onOpenChange, onSave }: DocumentEditModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Document>(
    document || {
      id: "",
      customerId: "",
      name: "",
      uploaded: false,
      status: "pending",
    }
  );
  const [manualStatusOverride, setManualStatusOverride] = useState(false);

  // Auto-detect status when file is uploaded or verified changes
  useEffect(() => {
    if (!manualStatusOverride) {
      const autoStatus = autoDetectDocumentStatus({
        uploaded: formData.uploaded,
        fileId: formData.fileId,
        verified: formData.verified,
      });
      setFormData((prev) => ({ ...prev, status: autoStatus }));
    }
  }, [formData.uploaded, formData.fileId, formData.verified, manualStatusOverride]);

  const handleFileUpload = (fileId: string) => {
    setFormData({
      ...formData,
      fileId,
      uploaded: true,
      uploadDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleFileDelete = () => {
    setFormData({
      ...formData,
      fileId: undefined,
      uploaded: false,
      uploadDate: undefined,
    });
  };

  const handleSave = () => {
    const updatedDoc = {
      ...formData,
      doneBy: user?.username || "Admin",
    };
    
    onSave(updatedDoc);
    
    logActivity(
      user?.username || "Admin",
      user?.username || "admin",
      formData.customerId,
      "Documents",
      `Updated ${formData.name} - Status: ${formData.status}`
    );

    toast({
      title: "Document Updated",
      description: `${formData.name} has been updated successfully`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Document - {formData.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* File Upload */}
          <div className="grid gap-2">
            <Label>Upload Document</Label>
            <FileUpload
              documentId={formData.id}
              documentName={formData.name}
              existingFileId={formData.fileId}
              onUploadComplete={handleFileUpload}
              onDelete={handleFileDelete}
              acceptedFormats=".pdf,.jpg,.jpeg,.png,.docx"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status (Auto-detected)</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Status) => {
                  setManualStatusOverride(true);
                  setFormData({ ...formData, status: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">⏳ Pending</SelectItem>
                  <SelectItem value="in_progress">⚙️ In Progress</SelectItem>
                  <SelectItem value="completed">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {manualStatusOverride ? "Manual override active" : "Auto-updated based on upload"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="verified">Admin Verification</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="verified"
                  checked={formData.verified || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                />
                <Label htmlFor="verified" className="text-sm">
                  {formData.verified ? "✅ Verified" : "❌ Not Verified"}
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="submittedTo">Submitted To</Label>
            <Input
              id="submittedTo"
              value={formData.submittedTo || ""}
              onChange={(e) => setFormData({ ...formData, submittedTo: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remark">Admin Remark</Label>
            <Textarea
              id="remark"
              value={formData.remark || ""}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              rows={3}
              placeholder="Add any remarks or observations here..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Private notes for internal use..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
