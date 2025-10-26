/**
 * Input Validation Schemas using Zod
 * SECURITY: All user inputs must be validated to prevent injection attacks
 */

import * as z from "zod";

// Customer validation schema
export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  consumerNumber: z
    .string()
    .trim()
    .min(1, "Consumer number is required")
    .max(50, "Consumer number must be less than 50 characters")
    .regex(/^[A-Z0-9]+$/, "Consumer number must be alphanumeric"),
  
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
  
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  
  systemCapacity: z
    .number()
    .positive("System capacity must be greater than 0")
    .max(100, "System capacity must be less than 100 kW"),
  
  orderAmount: z
    .number()
    .positive("Order amount must be greater than 0")
    .max(10000000, "Order amount seems too high"),
  
  orderDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

// Employee validation schema
export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
});

// Document validation schema
export const documentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(100, "Document name must be less than 100 characters"),
  
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
});

// Checklist validation schema
export const checklistSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(200, "Task name must be less than 200 characters"),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
  
  doneBy: z
    .string()
    .trim()
    .max(100, "Done by must be less than 100 characters")
    .optional(),
});

// Wiring validation schema
export const wiringSchema = z.object({
  technicianName: z
    .string()
    .trim()
    .max(100, "Technician name must be less than 100 characters")
    .optional(),
  
  pvModuleNo: z
    .string()
    .trim()
    .max(100, "Module number must be less than 100 characters")
    .optional(),
  
  aggregateCapacity: z
    .number()
    .positive("Capacity must be positive")
    .max(100, "Capacity must be less than 100 kW")
    .optional(),
  
  inverterType: z
    .string()
    .trim()
    .max(100, "Inverter type must be less than 100 characters")
    .optional(),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
});

// Inspection validation schema
export const inspectionSchema = z.object({
  document: z
    .string()
    .trim()
    .min(1, "Document name is required")
    .max(200, "Document name must be less than 200 characters"),
  
  inwardNo: z
    .string()
    .trim()
    .max(50, "Inward number must be less than 50 characters")
    .optional(),
  
  qcName: z
    .string()
    .trim()
    .max(100, "QC name must be less than 100 characters")
    .optional(),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
});

// Commissioning validation schema
export const commissioningSchema = z.object({
  releaseOrderNumber: z
    .string()
    .trim()
    .max(50, "Release order number must be less than 50 characters")
    .optional(),
  
  generationMeterNo: z
    .string()
    .trim()
    .max(50, "Meter number must be less than 50 characters")
    .optional(),
  
  adaniMeterNo: z
    .string()
    .trim()
    .max(50, "Meter number must be less than 50 characters")
    .optional(),
  
  commissioningReport: z
    .string()
    .trim()
    .max(1000, "Report must be less than 1000 characters")
    .optional(),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
});

// Advising validation schema
export const advisingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  
  priority: z.enum(["low", "medium", "high"]),
  
  remark: z
    .string()
    .trim()
    .max(500, "Remark must be less than 500 characters")
    .optional(),
});

// Utility function to safely encode for URL parameters
export function encodeForURL(text: string): string {
  return encodeURIComponent(text.trim().substring(0, 500));
}

// Utility function to sanitize file names
export function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

// Type exports for use in components
export type CustomerInput = z.infer<typeof customerSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ChecklistInput = z.infer<typeof checklistSchema>;
export type WiringInput = z.infer<typeof wiringSchema>;
export type InspectionInput = z.infer<typeof inspectionSchema>;
export type CommissioningInput = z.infer<typeof commissioningSchema>;
export type AdvisingInput = z.infer<typeof advisingSchema>;
