import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, User } from "lucide-react";
import { mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface EmployeeAssignmentProps {
  customerId: string;
  customerName: string;
  currentAssignee?: string | null;
  onAssign: (employeeId: string) => void;
}

export function EmployeeAssignment({
  customerId,
  customerName,
  currentAssignee,
  onAssign,
}: EmployeeAssignmentProps) {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(currentAssignee || "");
  const { toast } = useToast();

  const activeEmployees = mockEmployees.filter((emp) => emp.status === "active");
  const assignedEmployee = activeEmployees.find((emp) => emp.id === currentAssignee);

  const handleAssign = () => {
    if (!selectedEmployee) {
      toast({
        title: "No Employee Selected",
        description: "Please select an employee to assign",
        variant: "destructive",
      });
      return;
    }

    onAssign(selectedEmployee);

    const employee = activeEmployees.find((emp) => emp.id === selectedEmployee);
    toast({
      title: "Employee Assigned",
      description: `${employee?.name} has been assigned to ${customerName}`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {assignedEmployee ? (
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{assignedEmployee.name}</span>
            <Badge variant="secondary" className="ml-1">
              Change
            </Badge>
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Assign Employee</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Employee</DialogTitle>
          <DialogDescription>
            Select an employee to assign to {customerName}'s project
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Employee</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee..." />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{emp.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {emp.assignedCustomers.length} projects
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <div className="p-3 bg-muted rounded-lg space-y-1 animate-fade-in">
              <p className="text-sm font-medium">
                {activeEmployees.find((emp) => emp.id === selectedEmployee)?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeEmployees.find((emp) => emp.id === selectedEmployee)?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                Currently assigned to{" "}
                {activeEmployees.find((emp) => emp.id === selectedEmployee)?.assignedCustomers
                  .length || 0}{" "}
                projects
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
