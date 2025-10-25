import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockEmployees, Customer } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Download, Filter, Lock } from "lucide-react";
import { CustomerModal } from "@/components/CustomerModal";
import { ExcelImport } from "@/components/ExcelImport";
import { calculateCustomerProgress } from "@/utils/progressUtils";
import { exportToExcel } from "@/utils/exportUtils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [modalOpen, setModalOpen] = useState(false);
  const [customers, setCustomers] = useState(mockCustomers);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.role === "admin";

  const handleImportComplete = (importedCustomers: Partial<Customer>[]) => {
    const newCustomers = importedCustomers.map((c) => ({
      ...c,
      id: c.id || `CUST${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: c.name || '',
      consumerNumber: c.consumerNumber || '',
      mobile: c.mobile || '',
      address: c.address || '',
      systemCapacity: c.systemCapacity || 0,
      orderAmount: c.orderAmount || 0,
      orderDate: c.orderDate || new Date().toISOString().split('T')[0],
      assignedTo: c.assignedTo || null,
      approvalStatus: c.approvalStatus || 'pending',
      locked: c.locked || false,
    })) as Customer[];

    setCustomers([...customers, ...newCustomers]);
    
    toast({
      title: "Import Complete",
      description: `${newCustomers.length} customer(s) added successfully`,
    });
  };

  // Filter customers based on role
  const employee = mockEmployees.find((emp) => emp.email.startsWith(user?.username || ""));
  const visibleCustomers = isAdmin
    ? customers
    : customers.filter((customer) => employee?.assignedCustomers.includes(customer.id));

  const customersWithProgress = visibleCustomers.map((customer) => ({
    ...customer,
    progress: calculateCustomerProgress(customer.id),
  }));

  const getAssignedEmployeeName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer?.assignedTo) return "Unassigned";
    const employee = mockEmployees.find((emp) => emp.id === customer.assignedTo);
    return employee?.name || "Unknown";
  };

  const getApprovalStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-warning text-warning-foreground",
      verified: "bg-blue-500 text-white",
      completed: "bg-success text-success-foreground",
    };
    return <Badge className={variants[status] || ""}>{status}</Badge>;
  };

  let filteredCustomers = customersWithProgress.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.consumerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort customers
  filteredCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "date":
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      case "capacity":
        return b.systemCapacity - a.systemCapacity;
      case "amount":
        return b.orderAmount - a.orderAmount;
      case "progress":
        return b.progress - a.progress;
      default:
        return 0;
    }
  });

  const handleSaveCustomer = (customer: any) => {
    console.log("Saving customer:", customer);
    // In real app, this would call an API
  };

  const handleExport = () => {
    exportToExcel(filteredCustomers);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Customers</h2>
          <p className="text-muted-foreground">
            Manage all customer information ({filteredCustomers.length} customers)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {isAdmin && (
            <>
              <ExcelImport onImportComplete={handleImportComplete} />
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or consumer number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="date">Date (Newest First)</SelectItem>
            <SelectItem value="capacity">Capacity (High to Low)</SelectItem>
            <SelectItem value="amount">Amount (High to Low)</SelectItem>
            <SelectItem value="progress">Progress (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card
            key={customer.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{customer.name}</span>
                  {customer.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <Badge
                  className={
                    customer.progress === 100
                      ? "bg-success text-success-foreground"
                      : customer.progress > 0
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {customer.progress}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Consumer No:</span>
                <span className="font-medium">{customer.consumerNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-medium">{customer.mobile}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium">{customer.systemCapacity} kW</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Amount:</span>
                <span className="font-medium">₹{customer.orderAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {new Date(customer.orderDate).toLocaleDateString()}
                </span>
              </div>

              {isAdmin && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assigned To:</span>
                    <span className="font-medium">{getAssignedEmployeeName(customer.id)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    {getApprovalStatusBadge(customer.approvalStatus)}
                  </div>
                </>
              )}

              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Project Progress</span>
                  <span className="font-medium">{customer.progress}%</span>
                </div>
                <Progress value={customer.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground text-center">
              No customers found matching your search.
            </p>
          </CardContent>
        </Card>
      )}

      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default Customers;
