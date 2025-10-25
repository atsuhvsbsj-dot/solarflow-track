import { supabase } from "../lib/supabase";

export async function initializeDatabase() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to initialize data");
    }

    const { data: existingCustomers } = await supabase
      .from("customers")
      .select("id")
      .limit(1);

    if (existingCustomers && existingCustomers.length > 0) {
      return;
    }

    const employeesData = [
      {
        name: "Shreya Patil",
        email: "shreya@example.com",
        phone: "9123456780",
        status: "active",
        created_by: user.id,
      },
      {
        name: "Rahul Deshmukh",
        email: "rahul@example.com",
        phone: "9123456781",
        status: "active",
        created_by: user.id,
      },
      {
        name: "Priya Joshi",
        email: "priya@example.com",
        phone: "9123456782",
        status: "pending",
        created_by: user.id,
      },
    ];

    const { data: employees, error: empError } = await supabase
      .from("employees")
      .insert(employeesData)
      .select();

    if (empError) throw empError;

    const customersData = [
      {
        name: "Rajesh Kumar",
        consumer_number: "CN001234567",
        mobile: "9876543210",
        address: "123, Green Valley Society, Pune, Maharashtra - 411001",
        system_capacity: 5.5,
        order_amount: 325000,
        order_date: "2024-01-15",
        assigned_to: employees?.[0]?.id,
        approval_status: "verified",
        locked: false,
        created_by: user.id,
      },
      {
        name: "Priya Sharma",
        consumer_number: "CN002345678",
        mobile: "9765432109",
        address: "45, Sunrise Apartments, Mumbai, Maharashtra - 400052",
        system_capacity: 3.3,
        order_amount: 195000,
        order_date: "2024-02-10",
        assigned_to: employees?.[0]?.id,
        approval_status: "pending",
        locked: false,
        created_by: user.id,
      },
      {
        name: "Amit Patel",
        consumer_number: "CN003456789",
        mobile: "9654321098",
        address: "78, Laxmi Nagar, Nagpur, Maharashtra - 440001",
        system_capacity: 7.2,
        order_amount: 425000,
        order_date: "2024-01-28",
        assigned_to: employees?.[1]?.id,
        approval_status: "verified",
        locked: false,
        created_by: user.id,
      },
    ];

    const { data: customers, error: custError } = await supabase
      .from("customers")
      .insert(customersData)
      .select();

    if (custError) throw custError;

    const documentsData = [
      {
        customer_id: customers?.[0]?.id,
        name: "Aadhaar Card",
        uploaded: true,
        upload_date: new Date("2024-01-16").toISOString(),
        done_by: "Shreya Patil",
        submitted_to: "MSEDCL",
        verified: true,
        verified_by: "Admin",
        status: "completed",
        remark: "Document verified and submitted",
        start_date: "2024-01-15",
        end_date: "2024-01-16",
      },
      {
        customer_id: customers?.[0]?.id,
        name: "Light Bill",
        uploaded: true,
        upload_date: new Date("2024-01-16").toISOString(),
        done_by: "Shreya Patil",
        submitted_to: "MSEDCL",
        verified: true,
        verified_by: "Admin",
        status: "completed",
        remark: "Latest bill submitted",
        start_date: "2024-01-15",
        end_date: "2024-01-16",
      },
      {
        customer_id: customers?.[0]?.id,
        name: "7/12 & Index 2",
        uploaded: false,
        status: "pending",
        remark: "Awaiting customer submission",
      },
    ];

    await supabase.from("documents").insert(documentsData);

    const checklistData = [
      {
        customer_id: customers?.[0]?.id,
        task: "New Connection",
        status: "completed",
        done_by: "Admin",
        completed_date: new Date("2024-01-18").toISOString(),
        remark: "Connection approved",
        start_date: "2024-01-15",
        end_date: "2024-01-18",
      },
      {
        customer_id: customers?.[0]?.id,
        task: "Email & Mobile Update",
        status: "completed",
        done_by: "Admin",
        completed_date: new Date("2024-01-19").toISOString(),
      },
      {
        customer_id: customers?.[0]?.id,
        task: "Load Extension",
        status: "completed",
        done_by: "Admin",
        completed_date: new Date("2024-01-22").toISOString(),
      },
      {
        customer_id: customers?.[1]?.id,
        task: "New Connection",
        status: "in_progress",
        done_by: "Admin",
      },
    ];

    await supabase.from("checklists").insert(checklistData);

    if (customers?.[0]?.id) {
      await supabase.from("wiring_details").insert({
        customer_id: customers[0].id,
        technician_name: "Suresh Patil",
        start_date: "2024-02-01",
        end_date: "2024-02-05",
        pv_module_no: "PV550-72-M",
        aggregate_capacity: 5.5,
        inverter_type: "String Inverter 5kW",
        ac_voltage: "230V",
        mounting_structure: "Galvanized Steel",
        dcdb: "IP65 Enclosure",
        acdb: "IP65 Enclosure",
        cables: "4mm² DC, 6mm² AC",
        status: "completed",
        remark: "Wiring completed as per specifications",
      });

      await supabase.from("inspections").insert({
        customer_id: customers[0].id,
        document: "Work Completion Report",
        submitted: true,
        submission_date: new Date("2024-02-08").toISOString(),
        inward_no: "INW001",
        qc_name: "Quality Inspector A",
        inspection_date: "2024-02-10",
        approved: true,
        status: "completed",
        remark: "Inspection passed successfully",
        start_date: "2024-02-08",
        end_date: "2024-02-10",
      });

      await supabase.from("commissioning").insert({
        customer_id: customers[0].id,
        release_order_date: "2024-02-15",
        release_order_number: "RO001",
        meter_fitting_date: "2024-02-20",
        generation_meter_no: "GM12345",
        adani_meter_no: "AM67890",
        system_start_date: "2024-02-21",
        commissioning_report: "All systems operational",
        status: "completed",
        remark: "System commissioned successfully",
        start_date: "2024-02-15",
        end_date: "2024-02-21",
      });
    }

    if (customers?.[1]?.id) {
      await supabase.from("advising").insert({
        customer_id: customers[1].id,
        title: "Document Verification Pending",
        description: "Need to verify Aadhaar card and light bill before proceeding",
        priority: "high",
        remark: "Customer requested expedited processing",
        assigned_to: employees?.[0]?.id,
        status: "in_progress",
        start_date: "2024-03-10",
      });
    }

    const activityLogsData = [
      {
        user_name: "Shreya Patil",
        user_id: user.id,
        customer_id: customers?.[0]?.id,
        section: "Documents",
        action: "Uploaded Light Bill",
      },
      {
        user_name: "Admin",
        user_id: user.id,
        customer_id: customers?.[0]?.id,
        section: "Documents",
        action: "Verified Aadhaar Card",
      },
    ];

    await supabase.from("activity_logs").insert(activityLogsData);

    return { success: true, message: "Database initialized with sample data" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
