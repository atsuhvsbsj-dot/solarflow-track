/**
 * Centralized Data Manager
 * Handles all CRUD operations, auto-syncing, and state management
 */

import { 
  Customer, 
  Document, 
  ChecklistItem, 
  WiringDetails, 
  Inspection, 
  Commissioning,
  Advising,
  ActivityLog 
} from "@/data/mockData";
import { logActivity } from "@/utils/activityUtils";

// Storage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'solar_customers',
  DOCUMENTS: 'solar_documents',
  CHECKLIST: 'solar_checklist',
  WIRING: 'solar_wiring',
  INSPECTIONS: 'solar_inspections',
  COMMISSIONING: 'solar_commissioning',
  ADVISING: 'solar_advising',
  ACTIVITIES: 'solar_activities',
};

// Default checklist tasks for new customers
const DEFAULT_CHECKLIST_TASKS = [
  "New Connection",
  "Email & Mobile Update",
  "Load Extension",
  "PV Application",
  "Net Meter Application",
];

// Default documents for new customers
const DEFAULT_DOCUMENTS = [
  "Aadhaar Card",
  "Light Bill",
  "7/12 & Index 2",
  "Undertaking Letter",
  "Notary",
  "PAN Card",
  "Quotation",
  "Sanction Letter",
];

// Default inspection types
const DEFAULT_INSPECTIONS = [
  "Work Completion Report",
  "Site Inspection",
  "Quality Check",
];

class DataManager {
  // Initialize with default data from mockData
  initialize(mockData: any) {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(mockData.customers));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(mockData.documents));
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(mockData.checklist));
      localStorage.setItem(STORAGE_KEYS.WIRING, JSON.stringify(mockData.wiring));
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(mockData.inspections));
      localStorage.setItem(STORAGE_KEYS.COMMISSIONING, JSON.stringify(mockData.commissioning));
      localStorage.setItem(STORAGE_KEYS.ADVISING, JSON.stringify(mockData.advising || []));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(mockData.activities));
    }
  }

  // Generic get method
  private get<T>(key: string): T[] | Record<string, T> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : (key.includes('wiring') || key.includes('commissioning') ? {} : []);
  }

  // Generic set method
  private set<T>(key: string, data: T[] | Record<string, T>): void {
    localStorage.setItem(key, JSON.stringify(data));
    // Trigger storage event for cross-component updates
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(data),
    }));
  }

  // CUSTOMER OPERATIONS
  getCustomers(): Customer[] {
    return this.get<Customer>(STORAGE_KEYS.CUSTOMERS) as Customer[];
  }

  getCustomer(id: string): Customer | undefined {
    return this.getCustomers().find(c => c.id === id);
  }

  addCustomer(customer: Customer, userName: string, userId: string): void {
    const customers = this.getCustomers();
    customers.push(customer);
    this.set(STORAGE_KEYS.CUSTOMERS, customers);

    // Auto-create blank entries for all sections
    this.createBlankSections(customer.id, userName, userId);

    // Log activity
    logActivity(userName, userId, customer.id, "Customer", `Added new customer: ${customer.name}`);
  }

  updateCustomer(customer: Customer, userName: string, userId: string): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      this.set(STORAGE_KEYS.CUSTOMERS, customers);
      logActivity(userName, userId, customer.id, "Customer", `Updated customer: ${customer.name}`);
    }
  }

  deleteCustomer(customerId: string, userName: string, userId: string): void {
    // Remove customer and all related data
    const customers = this.getCustomers().filter(c => c.id !== customerId);
    this.set(STORAGE_KEYS.CUSTOMERS, customers);

    // Remove related documents
    const documents = this.getDocuments().filter(d => d.customerId !== customerId);
    this.set(STORAGE_KEYS.DOCUMENTS, documents);

    // Remove related checklist
    const checklist = this.getChecklist().filter(c => c.customerId !== customerId);
    this.set(STORAGE_KEYS.CHECKLIST, checklist);

    // Remove related wiring
    const wiring = this.getWiring();
    delete wiring[customerId];
    this.set(STORAGE_KEYS.WIRING, wiring);

    // Remove related inspections
    const inspections = this.getInspections().filter(i => i.customerId !== customerId);
    this.set(STORAGE_KEYS.INSPECTIONS, inspections);

    // Remove related commissioning
    const commissioning = this.getCommissioning();
    delete commissioning[customerId];
    this.set(STORAGE_KEYS.COMMISSIONING, commissioning);

    logActivity(userName, userId, customerId, "Customer", "Deleted customer and all related data");
  }

  // AUTO-CREATE BLANK SECTIONS
  private createBlankSections(customerId: string, userName: string, userId: string): void {
    // Create blank documents
    const documents = this.getDocuments();
    DEFAULT_DOCUMENTS.forEach(docName => {
      documents.push({
        id: `doc_${customerId}_${Date.now()}_${Math.random()}`,
        customerId,
        name: docName,
        uploaded: false,
        status: "pending",
      } as Document);
    });
    this.set(STORAGE_KEYS.DOCUMENTS, documents);

    // Create blank checklist
    const checklist = this.getChecklist();
    DEFAULT_CHECKLIST_TASKS.forEach(task => {
      checklist.push({
        id: `check_${customerId}_${Date.now()}_${Math.random()}`,
        customerId,
        task,
        status: "pending",
      } as ChecklistItem);
    });
    this.set(STORAGE_KEYS.CHECKLIST, checklist);

    // Create blank wiring
    const wiring = this.getWiring();
    wiring[customerId] = {
      customerId,
      status: "pending",
    } as WiringDetails;
    this.set(STORAGE_KEYS.WIRING, wiring);

    // Create blank inspections
    const inspections = this.getInspections();
    DEFAULT_INSPECTIONS.forEach(docName => {
      inspections.push({
        id: `insp_${customerId}_${Date.now()}_${Math.random()}`,
        customerId,
        document: docName,
        submitted: false,
        approved: false,
        status: "pending",
      } as Inspection);
    });
    this.set(STORAGE_KEYS.INSPECTIONS, inspections);

    // Create blank commissioning
    const commissioning = this.getCommissioning();
    commissioning[customerId] = {
      customerId,
      status: "pending",
    } as Commissioning;
    this.set(STORAGE_KEYS.COMMISSIONING, commissioning);

    logActivity(userName, userId, customerId, "System", "Auto-created blank sections for new customer");
  }

  // DOCUMENT OPERATIONS
  getDocuments(): Document[] {
    return this.get<Document>(STORAGE_KEYS.DOCUMENTS) as Document[];
  }

  getCustomerDocuments(customerId: string): Document[] {
    return this.getDocuments().filter(d => d.customerId === customerId);
  }

  updateDocument(document: Document, userName: string, userId: string): void {
    const documents = this.getDocuments();
    const index = documents.findIndex(d => d.id === document.id);
    if (index !== -1) {
      documents[index] = document;
      this.set(STORAGE_KEYS.DOCUMENTS, documents);
      logActivity(userName, userId, document.customerId, "Documents", `Updated document: ${document.name}`);
      
      // Trigger progress recalculation
      this.recalculateProgress(document.customerId);
    }
  }

  // CHECKLIST OPERATIONS
  getChecklist(): ChecklistItem[] {
    return this.get<ChecklistItem>(STORAGE_KEYS.CHECKLIST) as ChecklistItem[];
  }

  getCustomerChecklist(customerId: string): ChecklistItem[] {
    return this.getChecklist().filter(c => c.customerId === customerId);
  }

  updateChecklistItem(item: ChecklistItem, userName: string, userId: string): void {
    const checklist = this.getChecklist();
    const index = checklist.findIndex(c => c.id === item.id);
    if (index !== -1) {
      checklist[index] = item;
      this.set(STORAGE_KEYS.CHECKLIST, checklist);
      logActivity(userName, userId, item.customerId, "Checklist", `Updated task: ${item.task}`);
      
      // Check if checklist is complete and unlock next section
      this.checkSectionCompletion(item.customerId, "checklist");
      this.recalculateProgress(item.customerId);
    }
  }

  // WIRING OPERATIONS
  getWiring(): Record<string, WiringDetails> {
    return this.get<WiringDetails>(STORAGE_KEYS.WIRING) as Record<string, WiringDetails>;
  }

  getCustomerWiring(customerId: string): WiringDetails | null {
    return this.getWiring()[customerId] || null;
  }

  updateWiring(wiring: WiringDetails, userName: string, userId: string): void {
    const allWiring = this.getWiring();
    allWiring[wiring.customerId] = wiring;
    this.set(STORAGE_KEYS.WIRING, allWiring);
    logActivity(userName, userId, wiring.customerId, "Wiring", "Updated wiring details");
    
    // Check if wiring is complete and unlock inspection
    this.checkSectionCompletion(wiring.customerId, "wiring");
    this.recalculateProgress(wiring.customerId);
  }

  // INSPECTION OPERATIONS
  getInspections(): Inspection[] {
    return this.get<Inspection>(STORAGE_KEYS.INSPECTIONS) as Inspection[];
  }

  getCustomerInspections(customerId: string): Inspection[] {
    return this.getInspections().filter(i => i.customerId === customerId);
  }

  updateInspection(inspection: Inspection, userName: string, userId: string): void {
    const inspections = this.getInspections();
    const index = inspections.findIndex(i => i.id === inspection.id);
    if (index !== -1) {
      inspections[index] = inspection;
      this.set(STORAGE_KEYS.INSPECTIONS, inspections);
      logActivity(userName, userId, inspection.customerId, "Inspection", `Updated inspection: ${inspection.document}`);
      
      // Check if inspection approved and unlock release order
      this.checkSectionCompletion(inspection.customerId, "inspection");
      this.recalculateProgress(inspection.customerId);
    }
  }

  // COMMISSIONING OPERATIONS
  getCommissioning(): Record<string, Commissioning> {
    return this.get<Commissioning>(STORAGE_KEYS.COMMISSIONING) as Record<string, Commissioning>;
  }

  getCustomerCommissioning(customerId: string): Commissioning | null {
    return this.getCommissioning()[customerId] || null;
  }

  updateCommissioning(commissioning: Commissioning, userName: string, userId: string): void {
    const allCommissioning = this.getCommissioning();
    allCommissioning[commissioning.customerId] = commissioning;
    this.set(STORAGE_KEYS.COMMISSIONING, allCommissioning);
    logActivity(userName, userId, commissioning.customerId, "Commissioning", "Updated commissioning details");
    
    this.recalculateProgress(commissioning.customerId);
  }

  // ADVISING OPERATIONS
  getAdvising(): Advising[] {
    return this.get<Advising>(STORAGE_KEYS.ADVISING) as Advising[];
  }

  getCustomerAdvising(customerId: string): Advising[] {
    return this.getAdvising().filter(a => a.customerId === customerId);
  }

  addAdvising(advising: Advising, userName: string, userId: string): void {
    const advisings = this.getAdvising();
    advisings.push(advising);
    this.set(STORAGE_KEYS.ADVISING, advisings);
    logActivity(userName, userId, advising.customerId, "Advising", `Added note: ${advising.title}`);
  }

  updateAdvising(advising: Advising, userName: string, userId: string): void {
    const advisings = this.getAdvising();
    const index = advisings.findIndex(a => a.id === advising.id);
    if (index !== -1) {
      advisings[index] = advising;
      this.set(STORAGE_KEYS.ADVISING, advisings);
      logActivity(userName, userId, advising.customerId, "Advising", `Updated note: ${advising.title}`);
    }
  }

  // SECTION COMPLETION CHECK
  private checkSectionCompletion(customerId: string, section: string): void {
    switch (section) {
      case "checklist":
        const checklist = this.getCustomerChecklist(customerId);
        const allChecklistComplete = checklist.every(c => c.status === "completed");
        if (allChecklistComplete) {
          // Unlock wiring section
          logActivity("System", "system", customerId, "System", "Checklist completed - Wiring section unlocked");
        }
        break;
      
      case "wiring":
        const wiring = this.getCustomerWiring(customerId);
        if (wiring?.status === "completed") {
          // Unlock inspection
          logActivity("System", "system", customerId, "System", "Wiring completed - Inspection section unlocked");
        }
        break;
      
      case "inspection":
        const inspections = this.getCustomerInspections(customerId);
        const allInspectionsApproved = inspections.every(i => i.approved);
        if (allInspectionsApproved) {
          // Unlock commissioning
          logActivity("System", "system", customerId, "System", "All inspections approved - Commissioning unlocked");
        }
        break;
    }
  }

  // PROGRESS CALCULATION WITH WEIGHTS
  private recalculateProgress(customerId: string): void {
    const weights = {
      documents: 0.25,    // 25%
      checklist: 0.20,    // 20%
      wiring: 0.20,       // 20%
      inspection: 0.20,   // 20%
      commissioning: 0.15, // 15%
    };

    let totalProgress = 0;

    // Documents progress
    const docs = this.getCustomerDocuments(customerId);
    if (docs.length > 0) {
      const completedDocs = docs.filter(d => d.status === "completed").length;
      totalProgress += (completedDocs / docs.length) * weights.documents;
    }

    // Checklist progress
    const checklist = this.getCustomerChecklist(customerId);
    if (checklist.length > 0) {
      const completedTasks = checklist.filter(c => c.status === "completed").length;
      totalProgress += (completedTasks / checklist.length) * weights.checklist;
    }

    // Wiring progress
    const wiring = this.getCustomerWiring(customerId);
    if (wiring) {
      const wiringProgress = wiring.status === "completed" ? 1 : wiring.status === "in_progress" ? 0.5 : 0;
      totalProgress += wiringProgress * weights.wiring;
    }

    // Inspection progress
    const inspections = this.getCustomerInspections(customerId);
    if (inspections.length > 0) {
      const completedInspections = inspections.filter(i => i.status === "completed").length;
      totalProgress += (completedInspections / inspections.length) * weights.inspection;
    }

    // Commissioning progress
    const commissioning = this.getCustomerCommissioning(customerId);
    if (commissioning) {
      const commissioningProgress = commissioning.status === "completed" ? 1 : commissioning.status === "in_progress" ? 0.5 : 0;
      totalProgress += commissioningProgress * weights.commissioning;
    }

    // Update customer with new progress
    const customer = this.getCustomer(customerId);
    if (customer) {
      const progressPercent = Math.round(totalProgress * 100);
      
      // Auto-update approval status based on progress
      if (progressPercent === 100) {
        customer.approvalStatus = "completed";
      } else if (progressPercent > 0) {
        customer.approvalStatus = "verified";
      }
      
      this.updateCustomer(customer, "System", "system");
    }
  }

  // Get activities
  getActivities(): ActivityLog[] {
    return this.get<ActivityLog>(STORAGE_KEYS.ACTIVITIES) as ActivityLog[];
  }
}

// Export singleton instance
export const dataManager = new DataManager();
