import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockCustomers, mockEmployees, mockActivities, Customer } from "@/data/mockData";
import {
  Users,
  FileWarning,
  Clock,
  CheckCircle,
  Search,
  Download,
  UserCog,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusChart } from "@/components/StatusChart";
import { ExcelImport } from "@/components/ExcelImport";
import { calculateCustomerProgress, getProjectStatus } from "@/utils/progressUtils";
import { exportToExcel } from "@/utils/exportUtils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
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
      description: `${newCustomers.length} customer(s) imported successfully`,
    });
  };

  const totalCustomers = customers.length;
  const totalEmployees = mockEmployees.filter((emp) => emp.status === "active").length;

  // Calculate project statuses based on progress
  const customersWithProgress = customers.map((customer) => ({
    ...customer,
    progress: calculateCustomerProgress(customer.id),
    status: getProjectStatus(calculateCustomerProgress(customer.id)),
  }));

  const pendingProjects = customersWithProgress.filter((c) => c.status === "pending").length;
  const inProgressProjects = customersWithProgress.filter((c) => c.status === "in_progress")
    .length;
  const completedProjects = customersWithProgress.filter((c) => c.status === "completed").length;
  const pendingDocs = customersWithProgress.filter((c) => c.progress < 30).length;

  const recentActivities = mockActivities.slice(0, 5);

  // Apply filters
  let filteredCustomers = customersWithProgress.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (statusFilter !== "all") {
    filteredCustomers = filteredCustomers.filter((c) => c.status === statusFilter);
  }

  if (dateFilter !== "all") {
    const today = new Date();
    filteredCustomers = filteredCustomers.filter((customer) => {
      const orderDate = new Date(customer.orderDate);
      const diffTime = Math.abs(today.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateFilter === "7days") return diffDays <= 7;
      if (dateFilter === "30days") return diffDays <= 30;
      if (dateFilter === "90days") return diffDays <= 90;
      return true;
    });
  }

  const handleExport = () => {
    exportToExcel(filteredCustomers);
  };

  const adminStats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => navigate("/customers"),
    },
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: UserCog,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => navigate("/employees"),
    },
    {
      title: "Pending Documents",
      value: pendingDocs,
      icon: FileWarning,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      onClick: () => navigate("/documents"),
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      onClick: () => setStatusFilter("in_progress"),
    },
    {
      title: "Commissioned",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      onClick: () => setStatusFilter("completed"),
    },
  ];

  const employeeStats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: undefined,
    },
    {
      title: "Pending Documents",
      value: pendingDocs,
      icon: FileWarning,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      onClick: undefined,
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      onClick: undefined,
    },
    {
      title: "Commissioned",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      onClick: undefined,
    },
  ];

  const stats = isAdmin ? adminStats : employeeStats;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          {isAdmin
            ? "Overview of your solar projects and team"
            : "Overview of your assigned projects"}
        </p>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-${isAdmin ? "5" : "4"} gap-4`}>
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-full`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart
          pending={pendingProjects}
          inProgress={inProgressProjects}
          completed={completedProjects}
        />

        {isAdmin ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {activity.section}
                        </Badge>
                        <span>{new Date(activity.date).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/activity-log")}
                >
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All Projects
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "in_progress" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("in_progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Filter by Date</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Customers</CardTitle>
            <Badge variant="secondary">{filteredCustomers.length} found</Badge>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No customers found matching your filters
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filteredCustomers.slice(0, 8).map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <Badge
                          className={
                            customer.status === "completed"
                              ? "bg-success text-success-foreground"
                              : customer.status === "in_progress"
                              ? "bg-warning text-warning-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {customer.progress}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{customer.consumerNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{customer.systemCapacity} kW</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{customer.orderAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {filteredCustomers.length > 8 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate("/customers")}
                >
                  View All {filteredCustomers.length} Customers
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;