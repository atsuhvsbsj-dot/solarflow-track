import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusChart } from "@/components/StatusChart";
import {
  Users,
  FileWarning,
  Clock,
  CheckCircle,
  Search,
  UserCog,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { storage, STORAGE_CHANGE_EVENT } from "@/lib/storage";
import { calculateOverallProgress } from "@/lib/progressCalculator";
import { Customer, ActivityLog } from "@/data/mockData";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  // Load data
  useEffect(() => {
    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, handleStorageChange);
    };
  }, []);

  const loadData = () => {
    setCustomers(storage.getCustomers());
    setActivities(storage.getActivities().slice(0, 10));
    setRefreshKey((prev) => prev + 1);
  };

  // Calculate stats
  const customersWithProgress = customers.map((customer) => ({
    ...customer,
    progress: calculateOverallProgress(customer.id),
  }));

  const totalCustomers = customers.length;
  const activeProjects = customersWithProgress.filter(
    (c) => c.progress > 0 && c.progress < 100
  ).length;
  const completedProjects = customersWithProgress.filter((c) => c.progress === 100).length;
  const pendingProjects = customersWithProgress.filter((c) => c.progress === 0).length;

  // Pending documents count
  const allDocuments = storage.getDocuments();
  const pendingDocuments = allDocuments.filter((d) => d.status === "pending").length;

  // Total employees
  const totalEmployees = storage.getEmployees().length;

  // Filter customers for search
  const filteredCustomers = customersWithProgress.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.consumerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const getProgressBadge = (progress: number) => {
    if (progress === 100)
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    if (progress > 0)
      return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">Pending</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.username}! ({user?.role})
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate("/customers")}>
            <Users className="h-4 w-4 mr-2" />
            Manage Customers
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-scale cursor-pointer" onClick={() => navigate("/customers")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} active projects
            </p>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => navigate("/customers")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => navigate("/customers")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card className="hover-scale cursor-pointer" onClick={() => navigate("/documents")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <FileWarning className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">Awaiting upload</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart
          pending={pendingProjects}
          inProgress={activeProjects}
          completed={completedProjects}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Activity className="h-4 w-4 text-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.section} •{" "}
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {activities.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/activity-log")}
                >
                  View All Activity
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCustomers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No customers found
              </p>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      {getProgressBadge(customer.progress)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{customer.consumerNumber}</span>
                      <span>•</span>
                      <span>{customer.systemCapacity} kW</span>
                      <span>•</span>
                      <span>₹{customer.orderAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{customer.progress}%</div>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${getProgressColor(customer.progress)} transition-all`}
                          style={{ width: `${customer.progress}%` }}
                        />
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
