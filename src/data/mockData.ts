export type Status = "pending" | "in_progress" | "completed";

export interface Customer {
  id: string;
  name: string;
  consumerNumber: string;
  mobile: string;
  address: string;
  systemCapacity: number;
  orderAmount: number;
  orderDate: string;
}

export interface Document {
  id: string;
  customerId: string;
  name: string;
  uploaded: boolean;
  uploadDate?: string;
  notes?: string;
  doneBy?: string;
  submittedTo?: string;
}

export interface ChecklistItem {
  id: string;
  customerId: string;
  task: string;
  status: Status;
  remark?: string;
  doneBy?: string;
  date?: string;
}

export interface WiringDetails {
  customerId: string;
  technicianName?: string;
  startDate?: string;
  endDate?: string;
  pvModuleNo?: string;
  aggregateCapacity?: number;
  inverterType?: string;
  acVoltage?: string;
  mountingStructure?: string;
  dcdb?: string;
  acdb?: string;
  cables?: string;
}

export interface Inspection {
  id: string;
  customerId: string;
  document: string;
  submitted: boolean;
  date?: string;
  inwardNo?: string;
  qcName?: string;
  inspectionDate?: string;
  approved: boolean;
}

export interface Commissioning {
  customerId: string;
  releaseOrderDate?: string;
  releaseOrderNumber?: string;
  meterFittingDate?: string;
  generationMeterNo?: string;
  adaniMeterNo?: string;
  systemStartDate?: string;
  subsidyReceivedDate?: string;
  commissioningReport?: string;
}

// Mock customers
export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    consumerNumber: "CN001234567",
    mobile: "9876543210",
    address: "123, Green Valley Society, Pune, Maharashtra - 411001",
    systemCapacity: 5.5,
    orderAmount: 325000,
    orderDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Priya Sharma",
    consumerNumber: "CN002345678",
    mobile: "9765432109",
    address: "45, Sunrise Apartments, Mumbai, Maharashtra - 400052",
    systemCapacity: 3.3,
    orderAmount: 195000,
    orderDate: "2024-02-10",
  },
  {
    id: "3",
    name: "Amit Patel",
    consumerNumber: "CN003456789",
    mobile: "9654321098",
    address: "78, Laxmi Nagar, Nagpur, Maharashtra - 440001",
    systemCapacity: 7.2,
    orderAmount: 425000,
    orderDate: "2024-01-28",
  },
];

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: "d1",
    customerId: "1",
    name: "Aadhaar Card",
    uploaded: true,
    uploadDate: "2024-01-16",
    doneBy: "Admin",
    submittedTo: "MSEDCL",
  },
  {
    id: "d2",
    customerId: "1",
    name: "Light Bill",
    uploaded: true,
    uploadDate: "2024-01-16",
    doneBy: "Admin",
    submittedTo: "MSEDCL",
  },
  {
    id: "d3",
    customerId: "1",
    name: "7/12 & Index 2",
    uploaded: false,
  },
  {
    id: "d4",
    customerId: "2",
    name: "Aadhaar Card",
    uploaded: true,
    uploadDate: "2024-02-11",
    doneBy: "Admin",
  },
];

// Mock checklist items
export const mockChecklist: ChecklistItem[] = [
  {
    id: "c1",
    customerId: "1",
    task: "New Connection",
    status: "completed",
    doneBy: "Admin",
    date: "2024-01-18",
  },
  {
    id: "c2",
    customerId: "1",
    task: "Email & Mobile Update",
    status: "completed",
    doneBy: "Admin",
    date: "2024-01-19",
  },
  {
    id: "c3",
    customerId: "1",
    task: "Load Extension",
    status: "in_progress",
    remark: "Waiting for approval",
    doneBy: "Admin",
  },
  {
    id: "c4",
    customerId: "1",
    task: "PV Application",
    status: "pending",
  },
];

// Mock wiring details
export const mockWiring: Record<string, WiringDetails> = {
  "1": {
    customerId: "1",
    technicianName: "Suresh Patil",
    startDate: "2024-02-01",
    endDate: "2024-02-05",
    pvModuleNo: "PV550-72-M",
    aggregateCapacity: 5.5,
    inverterType: "String Inverter 5kW",
    acVoltage: "230V",
    mountingStructure: "Galvanized Steel",
    dcdb: "IP65 Enclosure",
    acdb: "IP65 Enclosure",
    cables: "4mm² DC, 6mm² AC",
  },
};

// Mock inspections
export const mockInspections: Inspection[] = [
  {
    id: "i1",
    customerId: "1",
    document: "Work Completion Report",
    submitted: true,
    date: "2024-02-08",
    inwardNo: "INW001",
    qcName: "Quality Inspector A",
    inspectionDate: "2024-02-10",
    approved: true,
  },
];

// Mock commissioning data
export const mockCommissioning: Record<string, Commissioning> = {
  "1": {
    customerId: "1",
    releaseOrderDate: "2024-02-15",
    releaseOrderNumber: "RO001",
    meterFittingDate: "2024-02-20",
    generationMeterNo: "GM12345",
    adaniMeterNo: "AM67890",
    systemStartDate: "2024-02-21",
    commissioningReport: "All systems operational",
  },
};
