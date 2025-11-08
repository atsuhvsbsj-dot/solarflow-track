import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Commissioning, Status } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/utils/activityUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";

interface CommissioningEditModalProps {
  commissioning: Commissioning | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (commissioning: Commissioning) => void;
}

export const CommissioningEditModal = ({ commissioning, open, onOpenChange, onSave }: CommissioningEditModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Commissioning>(
    commissioning || {
      customerId: "",
      status: "pending",
    }
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store file in localStorage as base64 for demo
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result as string;
        const fileId = `comm_report_${Date.now()}`;
        localStorage.setItem(fileId, fileData);
        setFormData({ ...formData, commissioningReportFileId: fileId });
        toast({
          title: "File Uploaded",
          description: `Commissioning report uploaded successfully`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    
    logActivity(
      user?.username || "Admin",
      user?.username || "admin",
      formData.customerId,
      "Commissioning",
      `Updated commissioning details - Status: ${formData.status}`
    );

    toast({
      title: "Commissioning Updated",
      description: "Commissioning details have been updated successfully",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Commissioning Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Status) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
            <Label htmlFor="subsidyReceivedDate">Subsidy Received Date</Label>
            <Input
              id="subsidyReceivedDate"
              type="date"
              value={formData.subsidyReceivedDate || ""}
              onChange={(e) => setFormData({ ...formData, subsidyReceivedDate: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>Commissioning Report</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="flex-1"
              />
              {formData.commissioningReportFileId && (
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Uploaded
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              value={formData.remark || ""}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              rows={3}
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
