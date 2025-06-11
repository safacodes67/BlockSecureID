
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentProcessRequest {
  documentUrl: string;
  documentType: string;
  userId: string;
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

    const { documentUrl, documentType, userId }: DocumentProcessRequest = await req.json();
    
    console.log('Processing document:', { documentUrl, documentType, userId });

    // TODO: Implement AWS S3 upload
    // const s3Client = new AWS.S3({
    //   accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
    //   secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY'),
    //   region: Deno.env.get('AWS_REGION')
    // });

    // TODO: Implement AWS Lambda invocation for document hashing
    // const lambdaClient = new AWS.Lambda({
    //   accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
    //   secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY'),
    //   region: Deno.env.get('AWS_REGION')
    // });

    // For now, create a simple hash as placeholder
    const documentHash = await generateSimpleHash(documentUrl);

    // Store document metadata in Supabase
    const { data: documentRecord, error: dbError } = await supabase
      .from('user_documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        document_url: documentUrl,
        document_hash: documentHash,
        s3_key: `documents/${userId}/${documentType}_${Date.now()}`,
        processed_at: new Date().toISOString(),
        status: 'processed'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to store document metadata');
    }

    console.log('Document processed and stored:', documentRecord);

    return new Response(
      JSON.stringify({
        success: true,
        documentId: documentRecord.id,
        documentHash: documentHash,
        message: 'Document processed successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process document',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Simple hash function as placeholder for AWS Lambda
async function generateSimpleHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(handler);
