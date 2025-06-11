
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FraudReportRequest {
  fraudType: string;
  upiId?: string;
  url?: string;
  description: string;
  evidenceFiles?: string[];
  reporterEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const reportData: FraudReportRequest = await req.json();
    
    console.log('Received fraud report:', reportData);

    // Store fraud report in Supabase
    const { data: fraudReport, error: dbError } = await supabase
      .from('fraud_reports')
      .insert({
        fraud_type: reportData.fraudType,
        upi_id: reportData.upiId,
        malicious_url: reportData.url,
        description: reportData.description,
        evidence_files: reportData.evidenceFiles || [],
        reporter_email: reportData.reporterEmail,
        status: 'pending',
        report_date: new Date().toISOString(),
        evidence_hash: `hash_${Date.now()}` // Placeholder for Lambda processing
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store fraud report');
    }

    console.log('Fraud report stored:', fraudReport);

    // TODO: Send email notification using AWS SES
    // This will be implemented once AWS credentials are configured
    console.log('Email notification would be sent to admin about new fraud report');

    // TODO: Process documents with AWS Lambda
    // This will hash and process any uploaded evidence files
    console.log('Document processing would be triggered via Lambda');

    return new Response(
      JSON.stringify({
        success: true,
        reportId: fraudReport.id,
        message: 'Fraud report submitted successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error processing fraud report:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process fraud report',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
