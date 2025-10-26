import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/data/mockData";
import { customerSchema } from "@/lib/validation";
import { dataManager } from "@/lib/dataManager";
import { useAuth } from "@/contexts/AuthContext";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer;
  onSave: (customer: Partial<Customer>) => void;
}

export const CustomerModal = ({ open, onOpenChange, customer, onSave }: CustomerModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
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

  useEffect(() => {
    if (open && customer) {
      setFormData(customer);
    } else if (open && !customer) {
      setFormData({
        name: "",
        consumerNumber: "",
        mobile: "",
        address: "",
        systemCapacity: 0,
        orderAmount: 0,
        orderDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [open, customer]);

  const validateForm = () => {
    try {
      // Validate using zod schema
      customerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
      }
      setErrors(newErrors);
      return false;
    }
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

    if (customer) {
      // Update existing customer
      const updatedCustomer = { ...customer, ...formData } as Customer;
      dataManager.updateCustomer(updatedCustomer, user?.username || "Admin", user?.username || "admin");
      toast({
        title: "Customer Updated",
        description: `${formData.name} has been updated successfully`,
      });
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `CUST${Date.now()}`,
        name: formData.name || "",
        consumerNumber: formData.consumerNumber || "",
        mobile: formData.mobile || "",
        address: formData.address || "",
        systemCapacity: formData.systemCapacity || 0,
        orderAmount: formData.orderAmount || 0,
        orderDate: formData.orderDate || new Date().toISOString().split("T")[0],
        approvalStatus: "pending",
        locked: false,
      };
      
      dataManager.addCustomer(newCustomer, user?.username || "Admin", user?.username || "admin");
      toast({
        title: "Customer Added",
        description: `${formData.name} has been added successfully. All sections auto-created.`,
      });
    }

    onSave(formData);
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
