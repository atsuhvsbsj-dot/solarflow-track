/**
 * Local Storage Manager for SolarFlow Track
 * Handles all data persistence and synchronization
 */

import {
  Customer,
  Document,
  ChecklistItem,
  WiringDetails,
  Inspection,
  Commissioning,
  ActivityLog,
  Employee,
  Status,
} from "@/data/mockData";

// Storage keys
const STORAGE_KEYS = {
  CUSTOMERS: "solar_customers",
  DOCUMENTS: "solar_documents",
  CHECKLIST: "solar_checklist",
  WIRING: "solar_wiring",
  INSPECTION: "solar_inspection",
  COMMISSIONING: "solar_commissioning",
  ACTIVITIES: "solar_activities",
  EMPLOYEES: "solar_employees",
};

// Event for storage changes
export const STORAGE_CHANGE_EVENT = "solar_storage_change";

class StorageManager {
  // Dispatch custom event when storage changes
  private notifyChange(section: string) {
    window.dispatchEvent(
      new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { section } })
    );
  }

  // Generic get/set methods
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T, section?: string): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (section) {
        this.notifyChange(section);
      }
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
    }
  }

  // Customer operations
  getCustomers(): Customer[] {
    return this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  }

  setCustomers(customers: Customer[]): void {
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers, "customers");
  }

  getCustomer(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    customers.push(customer);
    this.setCustomers(customers);
  }

  updateCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === customer.id);
    if (index !== -1) {
      customers[index] = customer;
      this.setCustomers(customers);
    }
  }

  deleteCustomer(id: string): void {
    const customers = this.getCustomers().filter((c) => c.id !== id);
    this.setCustomers(customers);
    // Also clean up related data
    this.deleteCustomerData(id);
  }

  // Document operations
  getDocuments(): Document[] {
    return this.getItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  }

  setDocuments(documents: Document[]): void {
    this.setItem(STORAGE_KEYS.DOCUMENTS, documents, "documents");
  }

  getCustomerDocuments(customerId: string): Document[] {
    return this.getDocuments().filter((d) => d.customerId === customerId);
  }

  addDocument(document: Document): void {
    const documents = this.getDocuments();
    documents.push(document);
    this.setDocuments(documents);
  }

  updateDocument(document: Document): void {
    const documents = this.getDocuments();
    const index = documents.findIndex((d) => d.id === document.id);
    if (index !== -1) {
      documents[index] = document;
      this.setDocuments(documents);
    }
  }

  // Checklist operations
  getChecklist(): ChecklistItem[] {
    return this.getItem<ChecklistItem[]>(STORAGE_KEYS.CHECKLIST, []);
  }

  setChecklist(checklist: ChecklistItem[]): void {
    this.setItem(STORAGE_KEYS.CHECKLIST, checklist, "checklist");
  }

  getCustomerChecklist(customerId: string): ChecklistItem[] {
    return this.getChecklist().filter((c) => c.customerId === customerId);
  }

  updateChecklistItem(item: ChecklistItem): void {
    const checklist = this.getChecklist();
    const index = checklist.findIndex((c) => c.id === item.id);
    if (index !== -1) {
      checklist[index] = item;
      this.setChecklist(checklist);
    }
  }

  // Wiring operations
  getWiring(): Record<string, WiringDetails> {
    return this.getItem<Record<string, WiringDetails>>(STORAGE_KEYS.WIRING, {});
  }

  setWiring(wiring: Record<string, WiringDetails>): void {
    this.setItem(STORAGE_KEYS.WIRING, wiring, "wiring");
  }

  getCustomerWiring(customerId: string): WiringDetails | undefined {
    return this.getWiring()[customerId];
  }

  updateWiring(customerId: string, wiring: WiringDetails): void {
    const allWiring = this.getWiring();
    allWiring[customerId] = wiring;
    this.setWiring(allWiring);
  }

  // Inspection operations
  getInspections(): Inspection[] {
    return this.getItem<Inspection[]>(STORAGE_KEYS.INSPECTION, []);
  }

  setInspections(inspections: Inspection[]): void {
    this.setItem(STORAGE_KEYS.INSPECTION, inspections, "inspection");
  }

  getCustomerInspections(customerId: string): Inspection[] {
    return this.getInspections().filter((i) => i.customerId === customerId);
  }

  updateInspection(inspection: Inspection): void {
    const inspections = this.getInspections();
    const index = inspections.findIndex((i) => i.id === inspection.id);
    if (index !== -1) {
      inspections[index] = inspection;
      this.setInspections(inspections);
    }
  }

  // Commissioning operations
  getCommissioning(): Record<string, Commissioning> {
    return this.getItem<Record<string, Commissioning>>(STORAGE_KEYS.COMMISSIONING, {});
  }

  setCommissioning(commissioning: Record<string, Commissioning>): void {
    this.setItem(STORAGE_KEYS.COMMISSIONING, commissioning, "commissioning");
  }

  getCustomerCommissioning(customerId: string): Commissioning | undefined {
    return this.getCommissioning()[customerId];
  }

  updateCommissioning(customerId: string, commissioning: Commissioning): void {
    const allCommissioning = this.getCommissioning();
    allCommissioning[customerId] = commissioning;
    this.setCommissioning(allCommissioning);
  }

  // Activity log operations
  getActivities(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITIES, []);
  }

  setActivities(activities: ActivityLog[]): void {
    this.setItem(STORAGE_KEYS.ACTIVITIES, activities, "activities");
  }

  addActivity(activity: ActivityLog): void {
    const activities = this.getActivities();
    activities.unshift(activity); // Add to beginning
    // Keep only last 500 activities
    if (activities.length > 500) {
      activities.length = 500;
    }
    this.setActivities(activities);
  }

  getCustomerActivities(customerId: string): ActivityLog[] {
    return this.getActivities().filter((a) => a.customerId === customerId);
  }

  // Employee operations
  getEmployees(): Employee[] {
    return this.getItem<Employee[]>(STORAGE_KEYS.EMPLOYEES, []);
  }

  setEmployees(employees: Employee[]): void {
    this.setItem(STORAGE_KEYS.EMPLOYEES, employees, "employees");
  }

  addEmployee(employee: Employee): void {
    const employees = this.getEmployees();
    employees.push(employee);
    this.setEmployees(employees);
  }

  updateEmployee(employee: Employee): void {
    const employees = this.getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    if (index !== -1) {
      employees[index] = employee;
      this.setEmployees(employees);
    }
  }

  deleteEmployee(id: string): void {
    const employees = this.getEmployees().filter((e) => e.id !== id);
    this.setEmployees(employees);
  }

  // Clean up all data for a customer
  private deleteCustomerData(customerId: string): void {
    // Remove documents
    const documents = this.getDocuments().filter((d) => d.customerId !== customerId);
    this.setItem(STORAGE_KEYS.DOCUMENTS, documents);

    // Remove checklist
    const checklist = this.getChecklist().filter((c) => c.customerId !== customerId);
    this.setItem(STORAGE_KEYS.CHECKLIST, checklist);

    // Remove wiring
    const wiring = this.getWiring();
    delete wiring[customerId];
    this.setItem(STORAGE_KEYS.WIRING, wiring);

    // Remove inspections
    const inspections = this.getInspections().filter((i) => i.customerId !== customerId);
    this.setItem(STORAGE_KEYS.INSPECTION, inspections);

    // Remove commissioning
    const commissioning = this.getCommissioning();
    delete commissioning[customerId];
    this.setItem(STORAGE_KEYS.COMMISSIONING, commissioning);

    // Keep activities for audit trail
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    this.notifyChange("all");
  }

  // Initialize with mock data if empty
  initializeMockData(): void {
    if (this.getCustomers().length === 0) {
      // Will be populated by the data manager
      this.notifyChange("all");
    }
  }
}

export const storage = new StorageManager();
