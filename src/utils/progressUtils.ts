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
    completedSteps += docs.filter((d) => d.uploaded).length;
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
    if (wiring.endDate) completedSteps += 1;
  }

  // Inspection (weight: 15%)
  const inspections = mockInspections.filter((i) => i.customerId === customerId);
  if (inspections.length > 0) {
    totalSteps += inspections.length;
    completedSteps += inspections.filter((i) => i.approved).length;
  }

  // Commissioning (weight: 15%)
  const commissioning = mockCommissioning[customerId];
  if (commissioning) {
    totalSteps += 1;
    if (commissioning.systemStartDate) completedSteps += 1;
  }

  return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
};

export const getProjectStatus = (progress: number): "pending" | "in_progress" | "completed" => {
  if (progress === 0) return "pending";
  if (progress === 100) return "completed";
  return "in_progress";
};
