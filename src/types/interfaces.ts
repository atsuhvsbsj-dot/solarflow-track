export interface ILogin {
  email: string;
  password: string;
}

export interface ICustomer {
  id: string;
  name: string;
  consumer_number: string;
  mobile: string;
  address: string;
  system_capacity: number;
  order_amount: number;
  order_date: string;
  assigned_to?: string | null;
  approval_status: "pending" | "verified" | "completed";
  locked: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "active" | "suspended";
  created_by?: string;
  created_at?: string;
}

export interface IDocument {
  id: string;
  customer_id: string;
  name: string;
  uploaded: boolean;
  upload_date?: string;
  notes?: string;
  done_by?: string;
  submitted_to?: string;
  verified: boolean;
  verified_by?: string;
  status: "pending" | "in_progress" | "completed";
  remark?: string;
  start_date?: string;
  end_date?: string;
  file_url?: string;
  file_path?: string;
  created_at?: string;
}

export interface IChecklist {
  id: string;
  customer_id: string;
  task: string;
  status: "pending" | "in_progress" | "completed";
  remark?: string;
  done_by?: string;
  completed_date?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface IWiringDetails {
  id: string;
  customer_id: string;
  technician_name?: string;
  start_date?: string;
  end_date?: string;
  pv_module_no?: string;
  aggregate_capacity?: number;
  inverter_type?: string;
  ac_voltage?: string;
  mounting_structure?: string;
  dcdb?: string;
  acdb?: string;
  cables?: string;
  status: "pending" | "in_progress" | "completed";
  remark?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IInspection {
  id: string;
  customer_id: string;
  document: string;
  submitted: boolean;
  submission_date?: string;
  inward_no?: string;
  qc_name?: string;
  inspection_date?: string;
  approved: boolean;
  status: "pending" | "in_progress" | "completed";
  remark?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface ICommissioning {
  id: string;
  customer_id: string;
  release_order_date?: string;
  release_order_number?: string;
  meter_fitting_date?: string;
  generation_meter_no?: string;
  adani_meter_no?: string;
  system_start_date?: string;
  subsidy_received_date?: string;
  commissioning_report?: string;
  status: "pending" | "in_progress" | "completed";
  remark?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAdvising {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  remark?: string;
  assigned_to?: string;
  status: "pending" | "in_progress" | "completed";
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface IActivityLog {
  id: string;
  user_name: string;
  user_id?: string;
  customer_id?: string;
  section: string;
  action: string;
  created_at: string;
}

export interface IEmployeeAssignment {
  id: string;
  employee_id: string;
  customer_id: string;
  assigned_at: string;
}

export type Status = "pending" | "in_progress" | "completed";

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}
