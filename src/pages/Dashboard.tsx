import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockCustomers, mockDocuments, mockChecklist } from "@/data/mockData";
import { Users, FileWarning, Clock, CheckCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const totalCustomers = mockCustomers.length;
  const pendingDocs = mockDocuments.filter((d) => !d.uploaded).length;
  const inProgressProjects = mockChecklist.filter((c) => c.status === "in_progress").length;
  const completedProjects = mockChecklist.filter((c) => c.status === "completed").length;

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Documents",
      value: pendingDocs,
      icon: FileWarning,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Commissioned",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your solar projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Customers</CardTitle>
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
          <div className="space-y-3">
            {filteredCustomers.slice(0, 5).map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{customer.name}</p>
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
          {filteredCustomers.length > 5 && (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/customers")}
            >
              View All Customers
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
