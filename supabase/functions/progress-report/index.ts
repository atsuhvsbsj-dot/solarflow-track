import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProgressReport {
  customerId: string;
  customerName: string;
  overallProgress: string;
  phases: {
    documents: { total: number; completed: number; percentage: string };
    checklists: { total: number; completed: number; percentage: string };
    wiring: { status: string; completed: boolean };
    inspection: { status: string; completed: boolean };
    commissioning: { status: string; completed: boolean };
  };
  nextSteps: string[];
  blockers: string[];
  estimatedCompletion: string | null;
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
    const customerId = url.searchParams.get('customerId');

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'Customer ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: customer, error: custError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (custError || !customer) {
      return new Response(
        JSON.stringify({ error: 'Customer not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('customer_id', customerId);

    const totalDocs = documents?.length || 0;
    const completedDocs =
      documents?.filter((d) => d.status === 'completed').length || 0;
    const docPercentage =
      totalDocs > 0 ? ((completedDocs / totalDocs) * 100).toFixed(1) : '0.0';

    const { data: checklists } = await supabase
      .from('checklists')
      .select('*')
      .eq('customer_id', customerId);

    const totalChecklists = checklists?.length || 0;
    const completedChecklists =
      checklists?.filter((c) => c.status === 'completed').length || 0;
    const checklistPercentage =
      totalChecklists > 0
        ? ((completedChecklists / totalChecklists) * 100).toFixed(1)
        : '0.0';

    const { data: wiring } = await supabase
      .from('wiring_details')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    const { data: inspection } = await supabase
      .from('inspections')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: commissioning } = await supabase
      .from('commissioning')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    const phases = {
      documents: {
        total: totalDocs,
        completed: completedDocs,
        percentage: docPercentage + '%',
      },
      checklists: {
        total: totalChecklists,
        completed: completedChecklists,
        percentage: checklistPercentage + '%',
      },
      wiring: {
        status: wiring?.status || 'pending',
        completed: wiring?.status === 'completed',
      },
      inspection: {
        status: inspection?.status || 'pending',
        completed: inspection?.status === 'completed',
      },
      commissioning: {
        status: commissioning?.status || 'pending',
        completed: commissioning?.status === 'completed',
      },
    };

    const phaseWeights = {
      documents: 0.25,
      checklists: 0.25,
      wiring: 0.2,
      inspection: 0.15,
      commissioning: 0.15,
    };

    let overallScore = 0;
    overallScore += (completedDocs / (totalDocs || 1)) * phaseWeights.documents * 100;
    overallScore +=
      (completedChecklists / (totalChecklists || 1)) *
      phaseWeights.checklists *
      100;
    overallScore +=
      (phases.wiring.completed ? 1 : 0) * phaseWeights.wiring * 100;
    overallScore +=
      (phases.inspection.completed ? 1 : 0) * phaseWeights.inspection * 100;
    overallScore +=
      (phases.commissioning.completed ? 1 : 0) * phaseWeights.commissioning * 100;

    const nextSteps: string[] = [];
    const blockers: string[] = [];

    if (completedDocs < totalDocs) {
      nextSteps.push(`Upload ${totalDocs - completedDocs} pending documents`);
    }
    if (completedChecklists < totalChecklists) {
      nextSteps.push(
        `Complete ${totalChecklists - completedChecklists} checklist items`
      );
    }
    if (!phases.wiring.completed) {
      nextSteps.push('Complete wiring installation');
    }
    if (!phases.inspection.completed) {
      nextSteps.push('Schedule and complete inspection');
    }
    if (!phases.commissioning.completed) {
      nextSteps.push('Finalize system commissioning');
    }

    if (totalDocs === 0) {
      blockers.push('No documents created for this project');
    }
    if (totalChecklists === 0) {
      blockers.push('No checklist items defined');
    }

    const progressReport: ProgressReport = {
      customerId,
      customerName: customer.name,
      overallProgress: overallScore.toFixed(1) + '%',
      phases,
      nextSteps:
        nextSteps.length > 0 ? nextSteps : ['Project is complete'],
      blockers: blockers.length > 0 ? blockers : [],
      estimatedCompletion: customer.order_date || null,
    };

    return new Response(JSON.stringify(progressReport), {
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