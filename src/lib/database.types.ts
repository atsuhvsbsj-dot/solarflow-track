export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          status: 'pending' | 'approved' | 'active' | 'suspended'
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          status?: 'pending' | 'approved' | 'active' | 'suspended'
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'pending' | 'approved' | 'active' | 'suspended'
          created_by?: string | null
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          consumer_number: string
          mobile: string
          address: string
          system_capacity: number
          order_amount: number
          order_date: string
          assigned_to: string | null
          approval_status: 'pending' | 'verified' | 'completed'
          locked: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          consumer_number: string
          mobile: string
          address: string
          system_capacity: number
          order_amount: number
          order_date: string
          assigned_to?: string | null
          approval_status?: 'pending' | 'verified' | 'completed'
          locked?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          consumer_number?: string
          mobile?: string
          address?: string
          system_capacity?: number
          order_amount?: number
          order_date?: string
          assigned_to?: string | null
          approval_status?: 'pending' | 'verified' | 'completed'
          locked?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          customer_id: string
          name: string
          uploaded: boolean
          upload_date: string | null
          notes: string | null
          done_by: string | null
          submitted_to: string | null
          verified: boolean
          verified_by: string | null
          status: 'pending' | 'in_progress' | 'completed'
          remark: string | null
          start_date: string | null
          end_date: string | null
          file_url: string | null
          file_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          name: string
          uploaded?: boolean
          upload_date?: string | null
          notes?: string | null
          done_by?: string | null
          submitted_to?: string | null
          verified?: boolean
          verified_by?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          file_url?: string | null
          file_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          name?: string
          uploaded?: boolean
          upload_date?: string | null
          notes?: string | null
          done_by?: string | null
          submitted_to?: string | null
          verified?: boolean
          verified_by?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          file_url?: string | null
          file_path?: string | null
          created_at?: string
        }
      }
      checklists: {
        Row: {
          id: string
          customer_id: string
          task: string
          status: 'pending' | 'in_progress' | 'completed'
          remark: string | null
          done_by: string | null
          completed_date: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          task: string
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          done_by?: string | null
          completed_date?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          task?: string
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          done_by?: string | null
          completed_date?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      wiring_details: {
        Row: {
          id: string
          customer_id: string
          technician_name: string | null
          start_date: string | null
          end_date: string | null
          pv_module_no: string | null
          aggregate_capacity: number | null
          inverter_type: string | null
          ac_voltage: string | null
          mounting_structure: string | null
          dcdb: string | null
          acdb: string | null
          cables: string | null
          status: 'pending' | 'in_progress' | 'completed'
          remark: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          technician_name?: string | null
          start_date?: string | null
          end_date?: string | null
          pv_module_no?: string | null
          aggregate_capacity?: number | null
          inverter_type?: string | null
          ac_voltage?: string | null
          mounting_structure?: string | null
          dcdb?: string | null
          acdb?: string | null
          cables?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          technician_name?: string | null
          start_date?: string | null
          end_date?: string | null
          pv_module_no?: string | null
          aggregate_capacity?: number | null
          inverter_type?: string | null
          ac_voltage?: string | null
          mounting_structure?: string | null
          dcdb?: string | null
          acdb?: string | null
          cables?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          customer_id: string
          document: string
          submitted: boolean
          submission_date: string | null
          inward_no: string | null
          qc_name: string | null
          inspection_date: string | null
          approved: boolean
          status: 'pending' | 'in_progress' | 'completed'
          remark: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          document: string
          submitted?: boolean
          submission_date?: string | null
          inward_no?: string | null
          qc_name?: string | null
          inspection_date?: string | null
          approved?: boolean
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          document?: string
          submitted?: boolean
          submission_date?: string | null
          inward_no?: string | null
          qc_name?: string | null
          inspection_date?: string | null
          approved?: boolean
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      commissioning: {
        Row: {
          id: string
          customer_id: string
          release_order_date: string | null
          release_order_number: string | null
          meter_fitting_date: string | null
          generation_meter_no: string | null
          adani_meter_no: string | null
          system_start_date: string | null
          subsidy_received_date: string | null
          commissioning_report: string | null
          status: 'pending' | 'in_progress' | 'completed'
          remark: string | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          release_order_date?: string | null
          release_order_number?: string | null
          meter_fitting_date?: string | null
          generation_meter_no?: string | null
          adani_meter_no?: string | null
          system_start_date?: string | null
          subsidy_received_date?: string | null
          commissioning_report?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          release_order_date?: string | null
          release_order_number?: string | null
          meter_fitting_date?: string | null
          generation_meter_no?: string | null
          adani_meter_no?: string | null
          system_start_date?: string | null
          subsidy_received_date?: string | null
          commissioning_report?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          remark?: string | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      advising: {
        Row: {
          id: string
          customer_id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          remark: string | null
          assigned_to: string | null
          status: 'pending' | 'in_progress' | 'completed'
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          title: string
          description: string
          priority?: 'low' | 'medium' | 'high'
          remark?: string | null
          assigned_to?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          remark?: string | null
          assigned_to?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_name: string
          user_id: string | null
          customer_id: string | null
          section: string
          action: string
          created_at: string
        }
        Insert: {
          id?: string
          user_name: string
          user_id?: string | null
          customer_id?: string | null
          section: string
          action: string
          created_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          user_id?: string | null
          customer_id?: string | null
          section?: string
          action?: string
          created_at?: string
        }
      }
      employee_assignments: {
        Row: {
          id: string
          employee_id: string
          customer_id: string
          assigned_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          customer_id: string
          assigned_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          customer_id?: string
          assigned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
