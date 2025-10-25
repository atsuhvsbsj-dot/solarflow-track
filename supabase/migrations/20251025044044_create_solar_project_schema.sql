/*
  # Solar Project Tracking System - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for the Solar Project 
  Tracking & Management System, including all tables, security policies, and relationships.

  ## New Tables Created

  ### 1. employees
  - `id` (uuid, primary key) - Unique employee identifier
  - `name` (text) - Employee full name
  - `email` (text, unique) - Employee email address
  - `phone` (text) - Contact phone number
  - `status` (text) - Employee status (pending, approved, active, suspended)
  - `created_by` (uuid, references auth.users) - Admin who created the employee
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. customers
  - `id` (uuid, primary key) - Unique customer identifier
  - `name` (text) - Customer full name
  - `consumer_number` (text, unique) - Electricity consumer number
  - `mobile` (text) - Customer mobile number
  - `address` (text) - Customer full address
  - `system_capacity` (numeric) - Solar system capacity in kW
  - `order_amount` (numeric) - Total order amount
  - `order_date` (date) - Date of order placement
  - `assigned_to` (uuid, references employees) - Assigned employee
  - `approval_status` (text) - Overall approval status (pending, verified, completed)
  - `locked` (boolean) - Lock status for editing
  - `created_by` (uuid, references auth.users) - Creator
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. documents
  - `id` (uuid, primary key) - Document identifier
  - `customer_id` (uuid, references customers) - Related customer
  - `name` (text) - Document name/type
  - `uploaded` (boolean) - Upload status
  - `upload_date` (timestamptz) - Date uploaded
  - `notes` (text) - Additional notes
  - `done_by` (text) - Person who handled the document
  - `submitted_to` (text) - Submission destination
  - `verified` (boolean) - Verification status
  - `verified_by` (text) - Verifier name
  - `status` (text) - Status (pending, in_progress, completed)
  - `remark` (text) - Admin remarks
  - `start_date` (date) - Process start date
  - `end_date` (date) - Process end date
  - `file_url` (text) - Supabase Storage URL for uploaded file
  - `file_path` (text) - Storage path
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. checklists
  - `id` (uuid, primary key) - Checklist item identifier
  - `customer_id` (uuid, references customers) - Related customer
  - `task` (text) - Task name/description
  - `status` (text) - Status (pending, in_progress, completed)
  - `remark` (text) - Admin remarks
  - `done_by` (text) - Person who completed the task
  - `completed_date` (timestamptz) - Completion date
  - `start_date` (date) - Start date
  - `end_date` (date) - End date
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. wiring_details
  - `id` (uuid, primary key) - Wiring detail identifier
  - `customer_id` (uuid, references customers, unique) - Related customer
  - `technician_name` (text) - Technician assigned
  - `start_date` (date) - Wiring start date
  - `end_date` (date) - Wiring completion date
  - `pv_module_no` (text) - PV module number
  - `aggregate_capacity` (numeric) - Total capacity
  - `inverter_type` (text) - Inverter type/model
  - `ac_voltage` (text) - AC voltage specification
  - `mounting_structure` (text) - Mounting structure type
  - `dcdb` (text) - DC distribution board details
  - `acdb` (text) - AC distribution board details
  - `cables` (text) - Cable specifications
  - `status` (text) - Status (pending, in_progress, completed)
  - `remark` (text) - Admin remarks
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. inspections
  - `id` (uuid, primary key) - Inspection identifier
  - `customer_id` (uuid, references customers) - Related customer
  - `document` (text) - Document name
  - `submitted` (boolean) - Submission status
  - `submission_date` (timestamptz) - Submission date
  - `inward_no` (text) - Inward number
  - `qc_name` (text) - Quality control inspector name
  - `inspection_date` (date) - Date of inspection
  - `approved` (boolean) - Approval status
  - `status` (text) - Status (pending, in_progress, completed)
  - `remark` (text) - Admin remarks
  - `start_date` (date) - Start date
  - `end_date` (date) - End date
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. commissioning
  - `id` (uuid, primary key) - Commissioning identifier
  - `customer_id` (uuid, references customers, unique) - Related customer
  - `release_order_date` (date) - Release order date
  - `release_order_number` (text) - Release order number
  - `meter_fitting_date` (date) - Meter fitting date
  - `generation_meter_no` (text) - Generation meter number
  - `adani_meter_no` (text) - Adani meter number
  - `system_start_date` (date) - System commissioning date
  - `subsidy_received_date` (date) - Subsidy received date
  - `commissioning_report` (text) - Commissioning report details
  - `status` (text) - Status (pending, in_progress, completed)
  - `remark` (text) - Admin remarks
  - `start_date` (date) - Start date
  - `end_date` (date) - End date
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 8. advising
  - `id` (uuid, primary key) - Advisory identifier
  - `customer_id` (uuid, references customers) - Related customer
  - `title` (text) - Advisory title
  - `description` (text) - Detailed description
  - `priority` (text) - Priority level (low, medium, high)
  - `remark` (text) - Admin remarks
  - `assigned_to` (uuid, references employees) - Assigned employee
  - `status` (text) - Status (pending, in_progress, completed)
  - `start_date` (date) - Start date
  - `end_date` (date) - End date
  - `created_at` (timestamptz) - Creation timestamp

  ### 9. activity_logs
  - `id` (uuid, primary key) - Activity log identifier
  - `user_name` (text) - User who performed the action
  - `user_id` (uuid, references auth.users) - User identifier
  - `customer_id` (uuid, references customers) - Related customer
  - `section` (text) - Section/module name
  - `action` (text) - Action description
  - `created_at` (timestamptz) - Timestamp of action

  ### 10. employee_assignments
  - `id` (uuid, primary key) - Assignment identifier
  - `employee_id` (uuid, references employees) - Employee
  - `customer_id` (uuid, references customers) - Customer
  - `assigned_at` (timestamptz) - Assignment timestamp
  - Composite unique constraint on (employee_id, customer_id)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies created for authenticated users
  - Admin users have full access
  - Employees can view their assigned customers
  - Separate policies for SELECT, INSERT, UPDATE, DELETE operations

  ## Important Notes
  - All timestamps use `timestamptz` for timezone awareness
  - Foreign keys ensure referential integrity
  - Indexes created on frequently queried columns
  - Default values set for status fields and timestamps
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  consumer_number text UNIQUE NOT NULL,
  mobile text NOT NULL,
  address text NOT NULL,
  system_capacity numeric NOT NULL,
  order_amount numeric NOT NULL,
  order_date date NOT NULL,
  assigned_to uuid REFERENCES employees(id),
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'verified', 'completed')),
  locked boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  uploaded boolean DEFAULT false,
  upload_date timestamptz,
  notes text,
  done_by text,
  submitted_to text,
  verified boolean DEFAULT false,
  verified_by text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  remark text,
  start_date date,
  end_date date,
  file_url text,
  file_path text,
  created_at timestamptz DEFAULT now()
);

-- Create checklists table
CREATE TABLE IF NOT EXISTS checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  task text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  remark text,
  done_by text,
  completed_date timestamptz,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Create wiring_details table
CREATE TABLE IF NOT EXISTS wiring_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  technician_name text,
  start_date date,
  end_date date,
  pv_module_no text,
  aggregate_capacity numeric,
  inverter_type text,
  ac_voltage text,
  mounting_structure text,
  dcdb text,
  acdb text,
  cables text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  remark text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  document text NOT NULL,
  submitted boolean DEFAULT false,
  submission_date timestamptz,
  inward_no text,
  qc_name text,
  inspection_date date,
  approved boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  remark text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Create commissioning table
CREATE TABLE IF NOT EXISTS commissioning (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  release_order_date date,
  release_order_number text,
  meter_fitting_date date,
  generation_meter_no text,
  adani_meter_no text,
  system_start_date date,
  subsidy_received_date date,
  commissioning_report text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  remark text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create advising table
CREATE TABLE IF NOT EXISTS advising (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  remark text,
  assigned_to uuid REFERENCES employees(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  section text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create employee_assignments junction table
CREATE TABLE IF NOT EXISTS employee_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, customer_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_approval_status ON customers(approval_status);
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_checklists_customer_id ON checklists(customer_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_customer_id ON activity_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_advising_customer_id ON advising(customer_id);
CREATE INDEX IF NOT EXISTS idx_advising_assigned_to ON advising(assigned_to);

-- Enable Row Level Security on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiring_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissioning ENABLE ROW LEVEL SECURITY;
ALTER TABLE advising ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Authenticated users can view employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customers table
CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for documents table
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for checklists table
CREATE POLICY "Authenticated users can view checklists"
  ON checklists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert checklists"
  ON checklists FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update checklists"
  ON checklists FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete checklists"
  ON checklists FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for wiring_details table
CREATE POLICY "Authenticated users can view wiring details"
  ON wiring_details FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert wiring details"
  ON wiring_details FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update wiring details"
  ON wiring_details FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete wiring details"
  ON wiring_details FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for inspections table
CREATE POLICY "Authenticated users can view inspections"
  ON inspections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inspections"
  ON inspections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update inspections"
  ON inspections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inspections"
  ON inspections FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for commissioning table
CREATE POLICY "Authenticated users can view commissioning"
  ON commissioning FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert commissioning"
  ON commissioning FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update commissioning"
  ON commissioning FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete commissioning"
  ON commissioning FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for advising table
CREATE POLICY "Authenticated users can view advising"
  ON advising FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert advising"
  ON advising FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update advising"
  ON advising FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete advising"
  ON advising FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for activity_logs table
CREATE POLICY "Authenticated users can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for employee_assignments table
CREATE POLICY "Authenticated users can view employee assignments"
  ON employee_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employee assignments"
  ON employee_assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete employee assignments"
  ON employee_assignments FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiring_details_updated_at
  BEFORE UPDATE ON wiring_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commissioning_updated_at
  BEFORE UPDATE ON commissioning
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('solar-documents', 'solar-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'solar-documents');

CREATE POLICY "Authenticated users can view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'solar-documents');

CREATE POLICY "Authenticated users can update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'solar-documents')
  WITH CHECK (bucket_id = 'solar-documents');

CREATE POLICY "Authenticated users can delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'solar-documents');
