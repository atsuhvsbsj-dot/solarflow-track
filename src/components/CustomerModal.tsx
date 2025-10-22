import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/data/mockData";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSave: (customer: Partial<Customer>) => void;
}

export const CustomerModal = ({ open, onOpenChange, customer, onSave }: CustomerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || {
      name: "",
      consumerNumber: "",
      mobile: "",
      address: "",
      systemCapacity: 0,
      orderAmount: 0,
      orderDate: new Date().toISOString().split("T")[0],
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.consumerNumber?.trim()) {
      newErrors.consumerNumber = "Consumer number is required";
    }

    if (!formData.mobile?.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.systemCapacity || formData.systemCapacity <= 0) {
      newErrors.systemCapacity = "System capacity must be greater than 0";
    }

    if (!formData.orderAmount || formData.orderAmount <= 0) {
      newErrors.orderAmount = "Order amount must be greater than 0";
    }

    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: customer ? "Customer Updated" : "Customer Added",
      description: `${formData.name} has been ${customer ? "updated" : "added"} successfully`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumerNumber">Consumer Number *</Label>
              <Input
                id="consumerNumber"
                value={formData.consumerNumber}
                onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
                className={errors.consumerNumber ? "border-destructive" : ""}
              />
              {errors.consumerNumber && (
                <p className="text-sm text-destructive">{errors.consumerNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className={errors.mobile ? "border-destructive" : ""}
              />
              {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemCapacity">System Capacity (kW) *</Label>
              <Input
                id="systemCapacity"
                type="number"
                step="0.1"
                value={formData.systemCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, systemCapacity: parseFloat(e.target.value) })
                }
                className={errors.systemCapacity ? "border-destructive" : ""}
              />
              {errors.systemCapacity && (
                <p className="text-sm text-destructive">{errors.systemCapacity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderAmount">Order Amount (₹) *</Label>
              <Input
                id="orderAmount"
                type="number"
                value={formData.orderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, orderAmount: parseInt(e.target.value) })
                }
                className={errors.orderAmount ? "border-destructive" : ""}
              />
              {errors.orderAmount && (
                <p className="text-sm text-destructive">{errors.orderAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className={errors.orderDate ? "border-destructive" : ""}
              />
              {errors.orderDate && <p className="text-sm text-destructive">{errors.orderDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={errors.address ? "border-destructive" : ""}
              rows={3}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{customer ? "Update" : "Add"} Customer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
