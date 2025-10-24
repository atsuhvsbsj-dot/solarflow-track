import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  mockCustomers,
  mockDocuments,
  mockChecklist,
  mockWiring,
  mockInspections,
  mockCommissioning,
  mockAdvising,
  mockEmployees,
  Document,
  ChecklistItem,
  WiringDetails,
  Inspection,
  Commissioning,
  Advising,
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
import { ArrowLeft, Download, Edit, FileText, Plus, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateCustomerProgress } from "@/utils/progressUtils";
import { exportCustomerReport } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { DocumentEditModal } from "@/components/DocumentEditModal";
import { ChecklistEditModal } from "@/components/ChecklistEditModal";
import { WiringEditModal } from "@/components/WiringEditModal";
import { InspectionEditModal } from "@/components/InspectionEditModal";
import { CommissioningEditModal } from "@/components/CommissioningEditModal";
import { AdvisingModal } from "@/components/AdvisingModal";
import { useAuth } from "@/contexts/AuthContext";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const customer = mockCustomers.find((c) => c.id === id);

  // State management for all sections
  const [documents, setDocuments] = useState<Document[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [wiring, setWiring] = useState<WiringDetails | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [commissioning, setCommissioning] = useState<Commissioning | null>(null);
  const [advisings, setAdvisings] = useState<Advising[]>([]);
  const [progress, setProgress] = useState(0);

  // Modal states
  const [documentModal, setDocumentModal] = useState<{ open: boolean; document: Document | null }>({
    open: false,
    document: null,
  });
  const [checklistModal, setChecklistModal] = useState<{ open: boolean; item: ChecklistItem | null }>({
    open: false,
    item: null,
  });
  const [wiringModal, setWiringModal] = useState(false);
  const [inspectionModal, setInspectionModal] = useState<{ open: boolean; inspection: Inspection | null }>({
    open: false,
    inspection: null,
  });
  const [commissioningModal, setCommissioningModal] = useState(false);
  const [advisingModal, setAdvisingModal] = useState<{ open: boolean; advising: Advising | null }>({
    open: false,
    advising: null,
  });

  // Load data on mount
  useEffect(() => {
    if (id) {
      setDocuments(mockDocuments.filter((d) => d.customerId === id));
      setChecklist(mockChecklist.filter((c) => c.customerId === id));
      setWiring(mockWiring[id] || null);
      setInspections(mockInspections.filter((i) => i.customerId === id));
      setCommissioning(mockCommissioning[id] || null);
      setAdvisings(mockAdvising.filter((a) => a.customerId === id));
      setProgress(calculateCustomerProgress(id));
    }
  }, [id]);

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

  const isAdmin = user?.role === "admin";

  const handleDocumentSave = (doc: Document) => {
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? doc : d)));
    if (id) setProgress(calculateCustomerProgress(id));
  };

  const handleChecklistSave = (item: ChecklistItem) => {
    setChecklist((prev) => prev.map((c) => (c.id === item.id ? item : c)));
    if (id) setProgress(calculateCustomerProgress(id));
  };

  const handleWiringSave = (wiringData: WiringDetails) => {
    setWiring(wiringData);
    if (id) setProgress(calculateCustomerProgress(id));
  };

  const handleInspectionSave = (inspection: Inspection) => {
    setInspections((prev) => prev.map((i) => (i.id === inspection.id ? inspection : i)));
    if (id) setProgress(calculateCustomerProgress(id));
  };

  const handleCommissioningSave = (commissioningData: Commissioning) => {
    setCommissioning(commissioningData);
    if (id) setProgress(calculateCustomerProgress(id));
  };

  const handleAdvisingSave = (advising: Advising) => {
    if (advisings.find((a) => a.id === advising.id)) {
      setAdvisings((prev) => prev.map((a) => (a.id === advising.id ? advising : a)));
    } else {
      setAdvisings((prev) => [...prev, advising]);
    }
  };

  const handleExportReport = () => {
    if (customer) {
      exportCustomerReport(customer);
      toast({
        title: "Report Exported",
        description: "Customer report has been downloaded successfully",
      });
    }
  };

  const getPriorityBadge = (priority: "low" | "medium" | "high") => {
    const colors = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-warning text-warning-foreground",
      high: "bg-destructive text-destructive-foreground",
    };
    return <Badge className={colors[priority]}>{priority.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
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

      {/* Progress Card */}
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
                    : "bg-destructive text-destructive-foreground"
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

      {/* Customer Information */}
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

      {/* Tabbed Sections */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="wiring">Wiring</TabsTrigger>
          <TabsTrigger value="inspection">Inspection</TabsTrigger>
          <TabsTrigger value="commissioning">Commissioning</TabsTrigger>
          <TabsTrigger value="advising">
            Advising
            {advisings.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {advisings.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <div className="flex gap-2 text-sm">
                  <Badge className="bg-success text-success-foreground">
                    {documents.filter((d) => d.uploaded).length} Uploaded
                  </Badge>
                  <Badge variant="outline">
                    {documents.filter((d) => !d.uploaded).length} Pending
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
                    <TableHead>Dates</TableHead>
                    <TableHead>Done By</TableHead>
                    <TableHead>Remark</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={doc.status} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {doc.startDate && (
                          <div>
                            <span className="text-muted-foreground">Start:</span> {doc.startDate}
                          </div>
                        )}
                        {doc.endDate && (
                          <div>
                            <span className="text-muted-foreground">End:</span> {doc.endDate}
                          </div>
                        )}
                        {!doc.startDate && !doc.endDate && "-"}
                      </TableCell>
                      <TableCell>{doc.doneBy || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {doc.remark || "-"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDocumentModal({ open: true, document: doc })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Process Checklist</CardTitle>
                <div className="flex gap-2">
                  <Badge className="bg-success text-success-foreground">
                    {checklist.filter((c) => c.status === "completed").length} Completed
                  </Badge>
                  <Badge className="bg-warning text-warning-foreground">
                    {checklist.filter((c) => c.status === "in_progress").length} In Progress
                  </Badge>
                  <Badge variant="outline">
                    {checklist.filter((c) => c.status === "pending").length} Pending
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress
                  value={
                    checklist.length > 0
                      ? (checklist.filter((c) => c.status === "completed").length / checklist.length) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Done By</TableHead>
                    <TableHead>Remark</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checklist.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.task}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.startDate && (
                          <div>
                            <span className="text-muted-foreground">Start:</span> {item.startDate}
                          </div>
                        )}
                        {item.endDate && (
                          <div>
                            <span className="text-muted-foreground">End:</span> {item.endDate}
                          </div>
                        )}
                        {!item.startDate && !item.endDate && "-"}
                      </TableCell>
                      <TableCell>{item.doneBy || "-"}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{item.remark || "-"}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setChecklistModal({ open: true, item })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wiring Tab */}
        <TabsContent value="wiring">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Wiring & Technical Details</CardTitle>
                {isAdmin && wiring && (
                  <Button variant="outline" size="sm" onClick={() => setWiringModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {wiring ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge status={wiring.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Technician Name</p>
                      <p className="font-medium">{wiring.technicianName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <StatusBadge status={wiring.status} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{wiring.startDate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{wiring.endDate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">PV Module No.</p>
                      <p className="font-medium">{wiring.pvModuleNo || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aggregate Capacity</p>
                      <p className="font-medium">
                        {wiring.aggregateCapacity ? `${wiring.aggregateCapacity} kWp` : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Inverter Type</p>
                      <p className="font-medium">{wiring.inverterType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">AC Voltage</p>
                      <p className="font-medium">{wiring.acVoltage || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mounting Structure</p>
                      <p className="font-medium">{wiring.mountingStructure || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">DCDB</p>
                      <p className="font-medium">{wiring.dcdb || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ACDB</p>
                      <p className="font-medium">{wiring.acdb || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cables</p>
                      <p className="font-medium">{wiring.cables || "-"}</p>
                    </div>
                  </div>

                  {wiring.remark && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Remark</p>
                      <p className="text-sm bg-muted p-3 rounded-md">{wiring.remark}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No wiring details available</p>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setWiring({ customerId: id!, status: "pending" });
                        setWiringModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Wiring Details
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspection Tab */}
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
                      <TableHead>Status</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>QC Name</TableHead>
                      <TableHead>Remark</TableHead>
                      {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((inspection) => (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-medium">{inspection.document}</TableCell>
                        <TableCell>
                          <StatusBadge status={inspection.status} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {inspection.startDate && (
                            <div>
                              <span className="text-muted-foreground">Start:</span> {inspection.startDate}
                            </div>
                          )}
                          {inspection.endDate && (
                            <div>
                              <span className="text-muted-foreground">End:</span> {inspection.endDate}
                            </div>
                          )}
                          {!inspection.startDate && !inspection.endDate && "-"}
                        </TableCell>
                        <TableCell>{inspection.qcName || "-"}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {inspection.remark || "-"}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setInspectionModal({ open: true, inspection })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No inspection data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissioning Tab */}
        <TabsContent value="commissioning">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Commissioning Details</CardTitle>
                {isAdmin && commissioning && (
                  <Button variant="outline" size="sm" onClick={() => setCommissioningModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {commissioning ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <StatusBadge status={commissioning.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{commissioning.startDate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{commissioning.endDate || "-"}</p>
                    </div>
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
                  </div>

                  {commissioning.commissioningReport && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Commissioning Report</p>
                      <p className="text-sm bg-muted p-3 rounded-md">{commissioning.commissioningReport}</p>
                    </div>
                  )}

                  {commissioning.remark && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Remark</p>
                      <p className="text-sm bg-muted p-3 rounded-md">{commissioning.remark}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No commissioning details available</p>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCommissioning({ customerId: id!, status: "pending" });
                        setCommissioningModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Commissioning Details
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advising Tab */}
        <TabsContent value="advising">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Advising & Notes</CardTitle>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAdvisingModal({ open: true, advising: null })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Advising
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {advisings.length > 0 ? (
                <div className="space-y-4">
                  {advisings.map((advising) => (
                    <Card key={advising.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{advising.title}</h4>
                                {getPriorityBadge(advising.priority)}
                                <StatusBadge status={advising.status} />
                              </div>
                              <p className="text-sm text-muted-foreground">{advising.description}</p>
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAdvisingModal({ open: true, advising })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {advising.assignedTo && (
                              <div>
                                <span className="text-muted-foreground">Assigned To:</span>{" "}
                                <span className="font-medium">
                                  {mockEmployees.find((e) => e.id === advising.assignedTo)?.name || "-"}
                                </span>
                              </div>
                            )}
                            {advising.startDate && (
                              <div>
                                <span className="text-muted-foreground">Start Date:</span>{" "}
                                <span className="font-medium">{advising.startDate}</span>
                              </div>
                            )}
                            {advising.endDate && (
                              <div>
                                <span className="text-muted-foreground">End Date:</span>{" "}
                                <span className="font-medium">{advising.endDate}</span>
                              </div>
                            )}
                          </div>

                          {advising.remark && (
                            <div className="bg-muted p-3 rounded-md">
                              <p className="text-xs text-muted-foreground mb-1">Admin Remark:</p>
                              <p className="text-sm">{advising.remark}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No advising notes available</p>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      onClick={() => setAdvisingModal({ open: true, advising: null })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Advising Note
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {isAdmin && (
        <>
          <DocumentEditModal
            document={documentModal.document}
            open={documentModal.open}
            onOpenChange={(open) => setDocumentModal({ open, document: null })}
            onSave={handleDocumentSave}
          />
          <ChecklistEditModal
            item={checklistModal.item}
            open={checklistModal.open}
            onOpenChange={(open) => setChecklistModal({ open, item: null })}
            onSave={handleChecklistSave}
          />
          {wiring && (
            <WiringEditModal
              wiring={wiring}
              open={wiringModal}
              onOpenChange={setWiringModal}
              onSave={handleWiringSave}
            />
          )}
          <InspectionEditModal
            inspection={inspectionModal.inspection}
            open={inspectionModal.open}
            onOpenChange={(open) => setInspectionModal({ open, inspection: null })}
            onSave={handleInspectionSave}
          />
          {commissioning && (
            <CommissioningEditModal
              commissioning={commissioning}
              open={commissioningModal}
              onOpenChange={setCommissioningModal}
              onSave={handleCommissioningSave}
            />
          )}
          <AdvisingModal
            advising={advisingModal.advising}
            customerId={id!}
            open={advisingModal.open}
            onOpenChange={(open) => setAdvisingModal({ open, advising: null })}
            onSave={handleAdvisingSave}
          />
        </>
      )}
    </div>
  );
};

export default CustomerDetail;
