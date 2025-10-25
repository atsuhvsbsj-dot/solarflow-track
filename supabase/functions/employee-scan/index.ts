import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ScanResult {
  employeeId: string;
  employeeName: string;
  totalProjects: number;
  projectCompletion: string;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  uploadedDocuments: number;
  pendingDocuments: number;
  remarks: string[];
  lastActivity: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');

    if (!employeeId) {
      return new Response(
        JSON.stringify({ error: 'Employee ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: employee, error: empError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (empError || !employee) {
      return new Response(
        JSON.stringify({ error: 'Employee not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('id')
      .eq('assigned_to', employeeId);

    if (custError) throw custError;

    const customerIds = customers?.map((c) => c.id) || [];
    const totalProjects = customerIds.length;

    let completedTasks = 0;
    let pendingTasks = 0;
    let inProgressTasks = 0;
    let uploadedDocuments = 0;
    let pendingDocuments = 0;
    const remarks: string[] = [];

    for (const customerId of customerIds) {
      const { data: checklists } = await supabase
        .from('checklists')
        .select('status')
        .eq('customer_id', customerId);

      checklists?.forEach((item) => {
        if (item.status === 'completed') completedTasks++;
        else if (item.status === 'in_progress') inProgressTasks++;
        else pendingTasks++;
      });

      const { data: documents } = await supabase
        .from('documents')
        .select('uploaded')
        .eq('customer_id', customerId);

      documents?.forEach((doc) => {
        if (doc.uploaded) uploadedDocuments++;
        else pendingDocuments++;
      });
    }

    const totalTasks = completedTasks + pendingTasks + inProgressTasks;
    const completionPercentage =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : '0.0';

    if (pendingDocuments > 5) {
      remarks.push(`${pendingDocuments} documents pending upload`);
    }
    if (inProgressTasks > 3) {
      remarks.push(`${inProgressTasks} tasks in progress`);
    }
    if (pendingTasks > 5) {
      remarks.push(`${pendingTasks} tasks pending`);
    }
    if (completedTasks === 0 && totalProjects > 0) {
      remarks.push('No completed tasks yet');
    }

    const { data: lastActivity } = await supabase
      .from('activity_logs')
      .select('created_at')
      .eq('user_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const scanResult: ScanResult = {
      employeeId,
      employeeName: employee.name,
      totalProjects,
      projectCompletion: completionPercentage + '%',
      completedTasks,
      pendingTasks,
      inProgressTasks,
      uploadedDocuments,
      pendingDocuments,
      remarks: remarks.length > 0 ? remarks : ['All tasks on track'],
      lastActivity: lastActivity?.created_at || null,
    };

    return new Response(JSON.stringify(scanResult), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});