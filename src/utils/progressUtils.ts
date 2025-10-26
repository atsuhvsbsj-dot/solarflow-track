import {
  mockDocuments,
  mockChecklist,
  mockWiring,
  mockInspections,
  mockCommissioning,
} from "@/data/mockData";

export const calculateCustomerProgress = (customerId: string): number => {
  let totalSteps = 0;
  let completedSteps = 0;

  // Documents (weight: 20%)
  const docs = mockDocuments.filter((d) => d.customerId === customerId);
  if (docs.length > 0) {
    totalSteps += docs.length;
    completedSteps += docs.filter((d) => d.status === "completed").length;
  }

  // Checklist (weight: 30%)
  const checklist = mockChecklist.filter((c) => c.customerId === customerId);
  if (checklist.length > 0) {
    totalSteps += checklist.length;
    completedSteps += checklist.filter((c) => c.status === "completed").length;
  }

  // Wiring (weight: 20%)
  const wiring = mockWiring[customerId];
  if (wiring) {
    totalSteps += 1;
    if (wiring.status === "completed") completedSteps += 1;
  }

  // Inspection (weight: 15%)
  const inspections = mockInspections.filter((i) => i.customerId === customerId);
  if (inspections.length > 0) {
    totalSteps += inspections.length;
    completedSteps += inspections.filter((i) => i.status === "completed").length;
  }

  // Commissioning (weight: 15%)
  const commissioning = mockCommissioning[customerId];
  if (commissioning) {
    totalSteps += 1;
    if (commissioning.status === "completed") completedSteps += 1;
  }

  return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
};

// Auto-detect status based on completeness
export const autoDetectDocumentStatus = (doc: {
  uploaded?: boolean;
  fileId?: string;
  verified?: boolean;
}): "pending" | "in_progress" | "completed" => {
  if (doc.verified) return "completed";
  if (doc.uploaded || doc.fileId) return "in_progress";
  return "pending";
};

export const autoDetectChecklistStatus = (item: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): "pending" | "in_progress" | "completed" => {
  if (item.status === "completed" || item.endDate) return "completed";
  if (item.status === "in_progress" || item.startDate) return "in_progress";
  return "pending";
};

export const autoDetectSectionStatus = (section: {
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}): "pending" | "in_progress" | "completed" => {
  // Check if explicitly marked as completed
  if (section.status === "completed") return "completed";
  
  // Check if all required fields are filled
  const hasStartDate = !!section.startDate;
  const hasEndDate = !!section.endDate;
  
  if (hasEndDate) return "completed";
  if (hasStartDate) return "in_progress";
  return "pending";
};

export const getProjectStatus = (progress: number): "pending" | "in_progress" | "completed" => {
  if (progress === 0) return "pending";
  if (progress === 100) return "completed";
  return "in_progress";
};