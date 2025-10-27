/**
 * Data Manager - Core Logic Handler
 * Manages all CRUD operations with auto-sync, progress calculation, and activity logging
 */

import { storage } from "./storage";
import { calculateOverallProgress, getCustomerStatus } from "./progressCalculator";
import { lockDependentSections } from "./sectionDependencies";
import { createBlankSections } from "./dataInitializer";
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

class DataManager {
  // ==================== CUSTOMER OPERATIONS ====================

  addCustomer(customer: Customer, userName: string, userId: string): void {
    // Check for duplicate consumer number
    const existing = storage.getCustomers().find(
      (c) => c.consumerNumber === customer.consumerNumber
    );
    if (existing) {
      throw new Error("Consumer number already exists");
    }

    // Add customer
    storage.addCustomer(customer);

    // Create blank sections
    createBlankSections(customer.id);

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: customer.id,
      section: "Customer",
      action: `Created customer ${customer.name}`,
      date: new Date().toISOString(),
    });
  }

  updateCustomer(customer: Customer, userName: string, userId: string): void {
    const old = storage.getCustomer(customer.id);
    storage.updateCustomer(customer);

    // Log what changed
    const changes: string[] = [];
    if (old) {
      if (old.name !== customer.name) changes.push("name");
      if (old.mobile !== customer.mobile) changes.push("mobile");
      if (old.address !== customer.address) changes.push("address");
      if (old.systemCapacity !== customer.systemCapacity) changes.push("system capacity");
    }

    if (changes.length > 0) {
      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId: customer.id,
        section: "Customer",
        action: `Updated ${changes.join(", ")}`,
        date: new Date().toISOString(),
      });
    }
  }

  deleteCustomer(customerId: string, userName: string, userId: string): void {
    const customer = storage.getCustomer(customerId);
    if (customer) {
      storage.deleteCustomer(customerId);
      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId,
        section: "Customer",
        action: `Deleted customer ${customer.name}`,
        date: new Date().toISOString(),
      });
    }
  }

  // ==================== DOCUMENT OPERATIONS ====================

  uploadDocument(
    customerId: string,
    documentId: string,
    file: File,
    userName: string,
    userId: string
  ): void {
    const doc = storage.getDocuments().find((d) => d.id === documentId);
    if (!doc) return;

    // Store file in localStorage (base64 for demo)
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      const fileId = `file_${Date.now()}`;
      localStorage.setItem(fileId, fileData);

      const updatedDoc: Document = {
        ...doc,
        uploaded: true,
        uploadDate: new Date().toISOString().split("T")[0],
        doneBy: userName,
        status: "in_progress",
        fileId,
      };

      storage.updateDocument(updatedDoc);

      // Recalculate progress
      this.recalculateProgress(customerId);

      // Log activity
      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId,
        section: "Documents",
        action: `Uploaded ${doc.name}`,
        date: new Date().toISOString(),
      });
    };
    reader.readAsDataURL(file);
  }

  verifyDocument(
    documentId: string,
    verified: boolean,
    userName: string,
    userId: string
  ): void {
    const doc = storage.getDocuments().find((d) => d.id === documentId);
    if (!doc) return;

    const updatedDoc: Document = {
      ...doc,
      verified,
      verifiedBy: verified ? userName : undefined,
      status: verified ? "completed" : "in_progress",
    };

    storage.updateDocument(updatedDoc);

    // Recalculate progress
    this.recalculateProgress(doc.customerId);

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: doc.customerId,
      section: "Documents",
      action: verified ? `Verified ${doc.name}` : `Unverified ${doc.name}`,
      date: new Date().toISOString(),
    });
  }

  deleteDocument(documentId: string, userName: string, userId: string): void {
    const doc = storage.getDocuments().find((d) => d.id === documentId);
    if (!doc) return;

    // Delete file from localStorage
    if (doc.fileId) {
      localStorage.removeItem(doc.fileId);
    }

    const updatedDoc: Document = {
      ...doc,
      uploaded: false,
      uploadDate: undefined,
      fileId: undefined,
      status: "pending",
    };

    storage.updateDocument(updatedDoc);

    // Recalculate progress
    this.recalculateProgress(doc.customerId);

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: doc.customerId,
      section: "Documents",
      action: `Deleted ${doc.name}`,
      date: new Date().toISOString(),
    });
  }

  // ==================== CHECKLIST OPERATIONS ====================

  updateChecklistItem(
    item: ChecklistItem,
    userName: string,
    userId: string
  ): void {
    const old = storage.getChecklist().find((c) => c.id === item.id);
    storage.updateChecklistItem(item);

    // Recalculate progress
    this.recalculateProgress(item.customerId);

    // Lock/unlock dependent sections
    lockDependentSections(item.customerId, "checklist");

    // Log activity
    if (old && old.status !== item.status) {
      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId: item.customerId,
        section: "Checklist",
        action: `${item.status === "completed" ? "Completed" : "Updated"} ${item.task}`,
        date: new Date().toISOString(),
      });
    }
  }

  // ==================== WIRING OPERATIONS ====================

  updateWiring(
    customerId: string,
    wiring: WiringDetails,
    userName: string,
    userId: string
  ): void {
    storage.updateWiring(customerId, wiring);

    // Recalculate progress
    this.recalculateProgress(customerId);

    // Lock/unlock dependent sections
    lockDependentSections(customerId, "wiring");

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId,
      section: "Wiring",
      action: "Updated wiring details",
      date: new Date().toISOString(),
    });
  }

  // ==================== INSPECTION OPERATIONS ====================

  updateInspection(
    inspection: Inspection,
    userName: string,
    userId: string
  ): void {
    storage.updateInspection(inspection);

    // Recalculate progress
    this.recalculateProgress(inspection.customerId);

    // Lock/unlock dependent sections
    lockDependentSections(inspection.customerId, "inspection");

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: inspection.customerId,
      section: "Inspection",
      action: `${inspection.approved ? "Approved" : "Updated"} ${inspection.document}`,
      date: new Date().toISOString(),
    });
  }

  // ==================== COMMISSIONING OPERATIONS ====================

  updateCommissioning(
    customerId: string,
    commissioning: Commissioning,
    userName: string,
    userId: string
  ): void {
    storage.updateCommissioning(customerId, commissioning);

    // Recalculate progress
    this.recalculateProgress(customerId);

    // Log activity
    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId,
      section: "Commissioning",
      action: "Updated commissioning details",
      date: new Date().toISOString(),
    });

    // Check if project is completed
    if (commissioning.status === "completed") {
      const customer = storage.getCustomer(customerId);
      if (customer) {
        this.logActivity({
          id: `act_${Date.now()}_complete`,
          user: "System",
          userId: "system",
          customerId,
          section: "Project",
          action: `Project ${customer.name} commissioned successfully ✅`,
          date: new Date().toISOString(),
        });
      }
    }
  }

  // ==================== EMPLOYEE OPERATIONS ====================

  addEmployee(employee: Employee, userName: string, userId: string): void {
    storage.addEmployee(employee);

    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: "",
      section: "Employee",
      action: `Added employee ${employee.name}`,
      date: new Date().toISOString(),
    });
  }

  updateEmployee(employee: Employee, userName: string, userId: string): void {
    storage.updateEmployee(employee);

    this.logActivity({
      id: `act_${Date.now()}`,
      user: userName,
      userId,
      customerId: "",
      section: "Employee",
      action: `Updated employee ${employee.name}`,
      date: new Date().toISOString(),
    });
  }

  deleteEmployee(employeeId: string, userName: string, userId: string): void {
    const employee = storage.getEmployees().find((e) => e.id === employeeId);
    if (employee) {
      storage.deleteEmployee(employeeId);

      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId: "",
        section: "Employee",
        action: `Deleted employee ${employee.name}`,
        date: new Date().toISOString(),
      });
    }
  }

  assignEmployee(
    customerId: string,
    employeeId: string,
    userName: string,
    userId: string
  ): void {
    const customer = storage.getCustomer(customerId);
    const employee = storage.getEmployees().find((e) => e.id === employeeId);

    if (customer && employee) {
      // Update customer
      storage.updateCustomer({ ...customer, assignedTo: employeeId });

      // Update employee
      if (!employee.assignedCustomers.includes(customerId)) {
        employee.assignedCustomers.push(customerId);
        storage.updateEmployee(employee);
      }

      this.logActivity({
        id: `act_${Date.now()}`,
        user: userName,
        userId,
        customerId,
        section: "Assignment",
        action: `Assigned ${employee.name} to ${customer.name}`,
        date: new Date().toISOString(),
      });
    }
  }

  // ==================== PROGRESS CALCULATION ====================

  recalculateProgress(customerId: string): void {
    const progress = calculateOverallProgress(customerId);
    const status = getCustomerStatus(customerId);
    
    const customer = storage.getCustomer(customerId);
    if (customer) {
      // Update customer with new progress
      // Note: Customer interface doesn't have progress field in mockData
      // But we can calculate it on demand
      
      // Log auto-update
      this.logActivity({
        id: `act_${Date.now()}_auto`,
        user: "System",
        userId: "system",
        customerId,
        section: "Progress",
        action: `Progress updated to ${progress}% (${status})`,
        date: new Date().toISOString(),
      });
    }
  }

  // ==================== ACTIVITY LOG ====================

  logActivity(activity: ActivityLog): void {
    storage.addActivity(activity);
  }

  getActivities(filters?: {
    customerId?: string;
    userId?: string;
    section?: string;
    limit?: number;
  }): ActivityLog[] {
    let activities = storage.getActivities();

    if (filters?.customerId) {
      activities = activities.filter((a) => a.customerId === filters.customerId);
    }

    if (filters?.userId) {
      activities = activities.filter((a) => a.userId === filters.userId);
    }

    if (filters?.section) {
      activities = activities.filter((a) => a.section === filters.section);
    }

    if (filters?.limit) {
      activities = activities.slice(0, filters.limit);
    }

    return activities;
  }

  // ==================== IMPORT / EXPORT ====================

  importCustomers(customers: Partial<Customer>[], userName: string, userId: string): number {
    let importedCount = 0;

    customers.forEach((customerData) => {
      // Skip if consumer number exists
      const exists = storage.getCustomers().some(
        (c) => c.consumerNumber === customerData.consumerNumber
      );

      if (!exists && customerData.consumerNumber) {
        const customer: Customer = {
          id: `CUST${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: customerData.name || "",
          consumerNumber: customerData.consumerNumber,
          mobile: customerData.mobile || "",
          address: customerData.address || "",
          systemCapacity: customerData.systemCapacity || 0,
          orderAmount: customerData.orderAmount || 0,
          orderDate: customerData.orderDate || new Date().toISOString().split("T")[0],
          approvalStatus: "pending",
          locked: false,
        };

        this.addCustomer(customer, userName, userId);
        importedCount++;
      }
    });

    return importedCount;
  }
}

export const dataManager = new DataManager();
