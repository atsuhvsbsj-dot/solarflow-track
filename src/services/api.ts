import { supabase } from "../lib/supabase";
import { Database } from "../lib/database.types";

type Customer = Database["public"]["Tables"]["customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type EmployeeInsert = Database["public"]["Tables"]["employees"]["Insert"];
type EmployeeUpdate = Database["public"]["Tables"]["employees"]["Update"];

type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

type Checklist = Database["public"]["Tables"]["checklists"]["Row"];
type ChecklistInsert = Database["public"]["Tables"]["checklists"]["Insert"];
type ChecklistUpdate = Database["public"]["Tables"]["checklists"]["Update"];

type WiringDetails = Database["public"]["Tables"]["wiring_details"]["Row"];
type WiringDetailsInsert = Database["public"]["Tables"]["wiring_details"]["Insert"];
type WiringDetailsUpdate = Database["public"]["Tables"]["wiring_details"]["Update"];

type Inspection = Database["public"]["Tables"]["inspections"]["Row"];
type InspectionInsert = Database["public"]["Tables"]["inspections"]["Insert"];
type InspectionUpdate = Database["public"]["Tables"]["inspections"]["Update"];

type Commissioning = Database["public"]["Tables"]["commissioning"]["Row"];
type CommissioningInsert = Database["public"]["Tables"]["commissioning"]["Insert"];
type CommissioningUpdate = Database["public"]["Tables"]["commissioning"]["Update"];

type Advising = Database["public"]["Tables"]["advising"]["Row"];
type AdvisingInsert = Database["public"]["Tables"]["advising"]["Insert"];
type AdvisingUpdate = Database["public"]["Tables"]["advising"]["Update"];

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
type ActivityLogInsert = Database["public"]["Tables"]["activity_logs"]["Insert"];

export const customersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("customers")
      .select("*, employees(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*, employees(name)")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(customer: CustomerInsert) {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("customers")
      .insert({ ...customer, created_by: user.user?.id })
      .select()
      .single();

    if (error) throw error;

    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: data.id,
      section: "Customers",
      action: `Created customer ${customer.name}`,
    });

    return data;
  },

  async update(id: string, updates: CustomerUpdate) {
    const { data, error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: id,
      section: "Customers",
      action: `Updated customer`,
    });

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) throw error;
  },

  async getByAssignedEmployee(employeeId: string) {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("assigned_to", employeeId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const employeesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(employee: EmployeeInsert) {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("employees")
      .insert({ ...employee, created_by: user.user?.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: EmployeeUpdate) {
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) throw error;
  },

  async getAssignedCustomers(employeeId: string) {
    const { data, error } = await supabase
      .from("employee_assignments")
      .select("customer_id, customers(*)")
      .eq("employee_id", employeeId);

    if (error) throw error;
    return data;
  },
};

export const documentsApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(document: DocumentInsert) {
    const { data, error } = await supabase
      .from("documents")
      .insert(document)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: document.customer_id,
      section: "Documents",
      action: `Created document ${document.name}`,
    });

    return data;
  },

  async update(id: string, updates: DocumentUpdate) {
    const { data, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Documents",
        action: `Updated document`,
      });
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) throw error;
  },

  async uploadFile(customerId: string, documentName: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${customerId}/${documentName}-${Date.now()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from("solar-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("solar-documents").getPublicUrl(fileName);

    return { filePath: fileName, fileUrl: publicUrl };
  },
};

export const checklistsApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("checklists")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },

  async create(checklist: ChecklistInsert) {
    const { data, error } = await supabase
      .from("checklists")
      .insert(checklist)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: checklist.customer_id,
      section: "Checklist",
      action: `Created checklist item ${checklist.task}`,
    });

    return data;
  },

  async update(id: string, updates: ChecklistUpdate) {
    const { data, error } = await supabase
      .from("checklists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Checklist",
        action: `Updated checklist item`,
      });
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("checklists").delete().eq("id", id);
    if (error) throw error;
  },
};

export const wiringDetailsApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("wiring_details")
      .select("*")
      .eq("customer_id", customerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(wiringDetails: WiringDetailsInsert) {
    const { data, error } = await supabase
      .from("wiring_details")
      .insert(wiringDetails)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: wiringDetails.customer_id,
      section: "Wiring",
      action: `Created wiring details`,
    });

    return data;
  },

  async update(id: string, updates: WiringDetailsUpdate) {
    const { data, error } = await supabase
      .from("wiring_details")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Wiring",
        action: `Updated wiring details`,
      });
    }

    return data;
  },
};

export const inspectionsApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(inspection: InspectionInsert) {
    const { data, error } = await supabase
      .from("inspections")
      .insert(inspection)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: inspection.customer_id,
      section: "Inspection",
      action: `Created inspection record`,
    });

    return data;
  },

  async update(id: string, updates: InspectionUpdate) {
    const { data, error } = await supabase
      .from("inspections")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Inspection",
        action: `Updated inspection record`,
      });
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("inspections").delete().eq("id", id);
    if (error) throw error;
  },
};

export const commissioningApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("commissioning")
      .select("*")
      .eq("customer_id", customerId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(commissioning: CommissioningInsert) {
    const { data, error } = await supabase
      .from("commissioning")
      .insert(commissioning)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: commissioning.customer_id,
      section: "Commissioning",
      action: `Created commissioning record`,
    });

    return data;
  },

  async update(id: string, updates: CommissioningUpdate) {
    const { data, error } = await supabase
      .from("commissioning")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Commissioning",
        action: `Updated commissioning record`,
      });
    }

    return data;
  },
};

export const advisingApi = {
  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("advising")
      .select("*, employees(name)")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(advising: AdvisingInsert) {
    const { data, error } = await supabase
      .from("advising")
      .insert(advising)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: advising.customer_id,
      section: "Advising",
      action: `Created advisory ${advising.title}`,
    });

    return data;
  },

  async update(id: string, updates: AdvisingUpdate) {
    const { data, error } = await supabase
      .from("advising")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const { data: user } = await supabase.auth.getUser();
    if (updates.customer_id) {
      await activityLogsApi.create({
        user_name: user.user?.email || "Unknown",
        user_id: user.user?.id,
        customer_id: updates.customer_id,
        section: "Advising",
        action: `Updated advisory`,
      });
    }

    return data;
  },

  async delete(id: string) {
    const { error } = await supabase.from("advising").delete().eq("id", id);
    if (error) throw error;
  },
};

export const activityLogsApi = {
  async getAll(limit?: number) {
    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(activityLog: ActivityLogInsert) {
    const { data, error } = await supabase
      .from("activity_logs")
      .insert(activityLog)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const employeeAssignmentsApi = {
  async assign(employeeId: string, customerId: string) {
    const { data, error } = await supabase
      .from("employee_assignments")
      .insert({ employee_id: employeeId, customer_id: customerId })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("customers")
      .update({ assigned_to: employeeId })
      .eq("id", customerId);

    const { data: user } = await supabase.auth.getUser();
    await activityLogsApi.create({
      user_name: user.user?.email || "Unknown",
      user_id: user.user?.id,
      customer_id: customerId,
      section: "Assignment",
      action: `Assigned employee to customer`,
    });

    return data;
  },

  async unassign(employeeId: string, customerId: string) {
    const { error } = await supabase
      .from("employee_assignments")
      .delete()
      .eq("employee_id", employeeId)
      .eq("customer_id", customerId);

    if (error) throw error;

    await supabase
      .from("customers")
      .update({ assigned_to: null })
      .eq("id", customerId);
  },
};
