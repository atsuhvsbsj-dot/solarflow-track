import { useState } from "react";
import { mockActivities, mockCustomers } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSection, setFilterSection] = useState<string>("all");

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection =
      filterSection === "all" || activity.section.toLowerCase() === filterSection.toLowerCase();

    return matchesSearch && matchesSection;
  });

  const getCustomerName = (customerId: string) => {
    return mockCustomers.find((c) => c.id === customerId)?.name || "Unknown";
  };

  const getSectionColor = (section: string) => {
    const colors: Record<string, string> = {
      Documents: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Checklist: "bg-green-500/10 text-green-500 border-green-500/20",
      Wiring: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      Inspection: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Commissioning: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[section] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Activity Log</h2>
        <p className="text-muted-foreground">
          Track all system activities and updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="checklist">Checklist</SelectItem>
            <SelectItem value="wiring">Wiring</SelectItem>
            <SelectItem value="inspection">Inspection</SelectItem>
            <SelectItem value="commissioning">Commissioning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getSectionColor(activity.section)} variant="outline">
                      {activity.section}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {getCustomerName(activity.customerId)}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        {activity.action}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(activity.date).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No activities found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
