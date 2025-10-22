import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCustomers } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Eye } from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.consumerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Customers</h2>
          <p className="text-muted-foreground">Manage all customer information</p>
        </div>
        <Button onClick={() => navigate("/customers/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or consumer number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{customer.name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/customers/${customer.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
    </div>
  );
};

export default Customers;
