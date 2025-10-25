export type Status = "pending" | "in_progress" | "completed";

export interface SectionStatus {
  status: Status;
  progress: number;
  completedCount: number;
  totalCount: number;
}

export const calculateDocumentStatus = (
  documents: Array<{ uploaded: boolean; verified: boolean }>
): SectionStatus => {
  const totalCount = documents.length;
  if (totalCount === 0) {
    return { status: "pending", progress: 0, completedCount: 0, totalCount: 0 };
  }

  const completedCount = documents.filter(
    (doc) => doc.uploaded && doc.verified
  ).length;
  const inProgressCount = documents.filter(
    (doc) => doc.uploaded && !doc.verified
  ).length;

  const progress = Math.round((completedCount / totalCount) * 100);

  let status: Status = "pending";
  if (completedCount === totalCount) {
    status = "completed";
  } else if (inProgressCount > 0 || completedCount > 0) {
    status = "in_progress";
  }

  return { status, progress, completedCount, totalCount };
};

export const calculateChecklistStatus = (
  checklists: Array<{ status: Status }>
): SectionStatus => {
  const totalCount = checklists.length;
  if (totalCount === 0) {
    return { status: "pending", progress: 0, completedCount: 0, totalCount: 0 };
  }

  const completedCount = checklists.filter(
    (item) => item.status === "completed"
  ).length;
  const inProgressCount = checklists.filter(
    (item) => item.status === "in_progress"
  ).length;

  const progress = Math.round((completedCount / totalCount) * 100);

  let status: Status = "pending";
  if (completedCount === totalCount) {
    status = "completed";
  } else if (inProgressCount > 0 || completedCount > 0) {
    status = "in_progress";
  }

  return { status, progress, completedCount, totalCount };
};

export const calculateWiringStatus = (
  wiringDetails?: { status: Status } | null
): SectionStatus => {
  if (!wiringDetails) {
    return { status: "pending", progress: 0, completedCount: 0, totalCount: 1 };
  }

  const status = wiringDetails.status;
  const progress =
    status === "completed" ? 100 : status === "in_progress" ? 50 : 0;
  const completedCount = status === "completed" ? 1 : 0;

  return { status, progress, completedCount, totalCount: 1 };
};

export const calculateInspectionStatus = (
  inspections: Array<{ status: Status }>
): SectionStatus => {
  const totalCount = inspections.length;
  if (totalCount === 0) {
    return { status: "pending", progress: 0, completedCount: 0, totalCount: 0 };
  }

  const completedCount = inspections.filter(
    (item) => item.status === "completed"
  ).length;
  const inProgressCount = inspections.filter(
    (item) => item.status === "in_progress"
  ).length;

  const progress = Math.round((completedCount / totalCount) * 100);

  let status: Status = "pending";
  if (completedCount === totalCount) {
    status = "completed";
  } else if (inProgressCount > 0 || completedCount > 0) {
    status = "in_progress";
  }

  return { status, progress, completedCount, totalCount };
};

export const calculateCommissioningStatus = (
  commissioning?: { status: Status } | null
): SectionStatus => {
  if (!commissioning) {
    return { status: "pending", progress: 0, completedCount: 0, totalCount: 1 };
  }

  const status = commissioning.status;
  const progress =
    status === "completed" ? 100 : status === "in_progress" ? 50 : 0;
  const completedCount = status === "completed" ? 1 : 0;

  return { status, progress, completedCount, totalCount: 1 };
};

export interface ProjectProgress {
  overallProgress: number;
  overallStatus: Status;
  sections: {
    documents: SectionStatus;
    checklists: SectionStatus;
    wiring: SectionStatus;
    inspection: SectionStatus;
    commissioning: SectionStatus;
  };
}

export const calculateProjectProgress = (data: {
  documents: Array<{ uploaded: boolean; verified: boolean }>;
  checklists: Array<{ status: Status }>;
  wiringDetails?: { status: Status } | null;
  inspections: Array<{ status: Status }>;
  commissioning?: { status: Status } | null;
}): ProjectProgress => {
  const documents = calculateDocumentStatus(data.documents);
  const checklists = calculateChecklistStatus(data.checklists);
  const wiring = calculateWiringStatus(data.wiringDetails);
  const inspection = calculateInspectionStatus(data.inspections);
  const commissioning = calculateCommissioningStatus(data.commissioning);

  const sections = { documents, checklists, wiring, inspection, commissioning };

  const totalProgress =
    (documents.progress +
      checklists.progress +
      wiring.progress +
      inspection.progress +
      commissioning.progress) /
    5;

  const overallProgress = Math.round(totalProgress);

  let overallStatus: Status = "pending";
  if (overallProgress === 100) {
    overallStatus = "completed";
  } else if (overallProgress > 0) {
    overallStatus = "in_progress";
  }

  return {
    overallProgress,
    overallStatus,
    sections,
  };
};
