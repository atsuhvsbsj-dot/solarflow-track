import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  mockCustomers,
  mockDocuments,
  mockChecklist,
  mockWiring,
  mockInspections,
  mockCommissioning,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateCustomerProgress } from "@/utils/progressUtils";
import { exportCustomerReport } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const customer = mockCustomers.find((c) => c.id === id);
  const progress = id ? calculateCustomerProgress(id) : 0;

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Button onClick={() => navigate("/customers")} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  const customerDocs = mockDocuments.filter((d) => d.customerId === id);
  const customerChecklist = mockChecklist.filter((c) => c.customerId === id);
  const wiringDetails = id ? mockWiring[id] : undefined;
  const inspections = mockInspections.filter((i) => i.customerId === id);
  const commissioning = id ? mockCommissioning[id] : undefined;

  const handleExportReport = () => {
    if (customer) {
      exportCustomerReport(customer);
      toast({
        title: "Report Exported",
        description: "Customer report has been downloaded successfully",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">{customer.name}</h2>
            <p className="text-muted-foreground">{customer.consumerNumber}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Project Progress</h3>
              <Badge
                className={
                  progress === 100
                    ? "bg-success text-success-foreground"
                    : progress > 0
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground"
                }
              >
                {progress}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {progress === 100
                ? "Project completed successfully!"
                : progress > 0
                ? "Project is in progress"
                : "Project not yet started"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Mobile</p>
              <p className="font-medium">{customer.mobile}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Capacity</p>
              <p className="font-medium">{customer.systemCapacity} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Amount</p>
              <p className="font-medium">₹{customer.orderAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(customer.orderDate).toLocaleDateString()}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{customer.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="wiring">Wiring</TabsTrigger>
          <TabsTrigger value="inspection">Inspection</TabsTrigger>
          <TabsTrigger value="commissioning">Commissioning</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <div className="flex gap-2 text-sm">
                  <Badge className="bg-success text-success-foreground">
                    {customerDocs.filter((d) => d.uploaded).length} Uploaded
                  </Badge>
                  <Badge variant="outline">
                    {customerDocs.filter((d) => !d.uploaded).length} Pending
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Done By</TableHead>
                    <TableHead>Submitted To</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {doc.uploaded ? (
                          <Badge className="bg-success text-success-foreground">✓ Uploaded</Badge>
                        ) : (
                          <Badge className="bg-destructive text-destructive-foreground">
                            ✗ Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{doc.uploadDate || "-"}</TableCell>
                      <TableCell>{doc.doneBy || "-"}</TableCell>
                      <TableCell>{doc.submittedTo || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {doc.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Process Checklist</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-success text-success-foreground">
                    {customerChecklist.filter((c) => c.status === "completed").length} Completed
                  </Badge>
                  <Badge className="bg-warning text-warning-foreground">
                    {customerChecklist.filter((c) => c.status === "in_progress").length} In
                    Progress
                  </Badge>
                  <Badge variant="outline">
                    {customerChecklist.filter((c) => c.status === "pending").length} Pending
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress
                  value={
                    (customerChecklist.filter((c) => c.status === "completed").length /
                      customerChecklist.length) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remark</TableHead>
                    <TableHead>Done By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerChecklist.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.task}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-sm">{item.remark || "-"}</TableCell>
                      <TableCell>{item.doneBy || "-"}</TableCell>
                      <TableCell>{item.date || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wiring">
          <Card>
            <CardHeader>
              <CardTitle>Wiring & Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              {wiringDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Technician Name</p>
                    <p className="font-medium">{wiringDetails.technicianName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{wiringDetails.startDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{wiringDetails.endDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">PV Module No.</p>
                    <p className="font-medium">{wiringDetails.pvModuleNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aggregate Capacity</p>
                    <p className="font-medium">
                      {wiringDetails.aggregateCapacity
                        ? `${wiringDetails.aggregateCapacity} kWp`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inverter Type</p>
                    <p className="font-medium">{wiringDetails.inverterType || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AC Voltage</p>
                    <p className="font-medium">{wiringDetails.acVoltage || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mounting Structure</p>
                    <p className="font-medium">{wiringDetails.mountingStructure || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DCDB</p>
                    <p className="font-medium">{wiringDetails.dcdb || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ACDB</p>
                    <p className="font-medium">{wiringDetails.acdb || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Cables</p>
                    <p className="font-medium">{wiringDetails.cables || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No wiring details available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspection">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control & Inspection</CardTitle>
            </CardHeader>
            <CardContent>
              {inspections.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Inward No.</TableHead>
                      <TableHead>QC Name</TableHead>
                      <TableHead>Inspection Date</TableHead>
                      <TableHead>Approved</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.document}</TableCell>
                        <TableCell>
                          {inspection.submitted ? (
                            <Badge className="bg-success text-success-foreground">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>{inspection.inwardNo || "-"}</TableCell>
                        <TableCell>{inspection.qcName || "-"}</TableCell>
                        <TableCell>{inspection.inspectionDate || "-"}</TableCell>
                        <TableCell>
                          {inspection.approved ? (
                            <Badge className="bg-success text-success-foreground">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No inspection data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissioning">
          <Card>
            <CardHeader>
              <CardTitle>Commissioning Details</CardTitle>
            </CardHeader>
            <CardContent>
              {commissioning ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Release Order Date</p>
                    <p className="font-medium">{commissioning.releaseOrderDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Release Order Number</p>
                    <p className="font-medium">{commissioning.releaseOrderNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meter Fitting Date</p>
                    <p className="font-medium">{commissioning.meterFittingDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Generation Meter No.</p>
                    <p className="font-medium">{commissioning.generationMeterNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adani Meter No.</p>
                    <p className="font-medium">{commissioning.adaniMeterNo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System Start Date</p>
                    <p className="font-medium">{commissioning.systemStartDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subsidy Received Date</p>
                    <p className="font-medium">{commissioning.subsidyReceivedDate || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Commissioning Report</p>
                    <p className="font-medium">{commissioning.commissioningReport || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No commissioning data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetail;
