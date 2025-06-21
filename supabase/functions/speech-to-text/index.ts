// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Example voice ID, change if needed

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Hello from Functions!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/speech-to-text`;
    
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('file', audioFile);

    const elevenLabsResponse = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: elevenLabsFormData,
    });

    if (!elevenLabsResponse.ok) {
      const errorBody = await elevenLabsResponse.text();
      console.error('ElevenLabs API Error:', errorBody);
      throw new Error(`ElevenLabs API failed with status ${elevenLabsResponse.status}: ${errorBody}`);
    }
    
    const { text } = await elevenLabsResponse.json();

    return new Response(JSON.stringify({ transcription: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/speech-to-text' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
