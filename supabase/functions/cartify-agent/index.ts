// @ts-ignore

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

// Helper: Call Groq API (Llama 3) to extract context, required items, and budget
async function extractShoppingMission(query: string) {
    // @ts-expect-error Deno is available in the Edge Function runtime
  const apiKey = Deno.env.get('GROQ_API_KEY')
  const llamaModel = 'llama3-70b-8192' // or your preferred model

  const prompt = `
You are a smart shopping assistant. Given a user query, respond ONLY with a valid JSON object with the following keys:
- intent (e.g. search, cook, party, clean, festival, etc.)
- mission (e.g. birthday party, Diwali, cleaning, biryani, etc.)
- required_items (a list of things needed for the mission)
- budget (if any, as a number)

DO NOT include any explanation or text outside the JSON. Only output the JSON object.

Example:
{"intent": "party", "mission": "birthday party", "required_items": ["cake", "balloons", "candles", "decorations"], "budget": 1000}

User: ${query}
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: llamaModel,
      messages: [{ role: 'user', content: prompt }]
    })
  })

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Groq API error:', response.status, errorBody);
    throw new Error(`Groq API error: ${response.status} ${errorBody}`);
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  let parsed;
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error('Groq response is not valid JSON:', content);
    throw new Error('Groq response is not valid JSON. Try rephrasing your request or check the prompt.');
  }
  return parsed
}

// Helper: Fetch Walmart products from SerpAPI
async function fetchWalmartProducts(query: string) {
    // @ts-expect-error Deno is available in the Edge Function runtime
  const apiKey = Deno.env.get('SERPAPI_KEY')
  const url = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(query)}&api_key=${apiKey}`
  const response = await fetch(url)
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('SerpAPI error:', response.status, errorBody);
    throw new Error(`SerpAPI error: ${response.status} ${errorBody}`);
  }
  const data = await response.json()
  // Return top 3 products for this query
  return (data.organic_results || []).slice(0, 3).map((item: any) => ({
    id: item.product_id,
    name: item.title,
    price: item.primary_offer?.offer_price ?? 0,
    image_url: item.thumbnail,
    brand: item.seller_name || 'Walmart',
    product_url: item.product_page_url,
  }))
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  console.log('cartify-agent function invoked');

  // Debug: Log presence of env vars
  // @ts-expect-error Deno is available in the Edge Function runtime
  console.log('GROQ_API_KEY present:', !!Deno.env.get('GROQ_API_KEY'));
  // @ts-expect-error Deno is available in the Edge Function runtime
  console.log('SERPAPI_KEY present:', !!Deno.env.get('SERPAPI_KEY'));

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid or missing JSON body' }), { status: 400, headers: corsHeaders });
  }
  const { query } = body || {};
  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400, headers: corsHeaders });
  }
  try {
    // 1. Extract mission/intent/items/budget
    const ai = await extractShoppingMission(query)
    const requiredItems = ai.required_items || []
    const budget = ai.budget || null

    // 2. For each required item, fetch Walmart products
    let allProducts: any[] = []
    for (const item of requiredItems) {
      const products = await fetchWalmartProducts(item)
      allProducts = allProducts.concat(products)
    }

    // 3. If budget, try to fit products under budget (simple greedy)
    let selectedProducts = allProducts
    if (budget) {
      let total = 0
      selectedProducts = []
      for (const p of allProducts) {
        if (total + p.price <= budget) {
          selectedProducts.push(p)
          total += p.price
        }
      }
    }

    return new Response(JSON.stringify({
      products: selectedProducts,
      ai,
      message: `Found ${selectedProducts.length} products for your mission.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (e) {
    // Debug: Log error details robustly
    console.error('Error in cartify-agent (string):', e && e.toString ? e.toString() : e);
    console.error('Error in cartify-agent (object):', e);
    if (e && e.stack) {
      console.error('Error stack:', e.stack);
    }
    return new Response(JSON.stringify({ error: e.message || e.toString() }), { status: 500, headers: corsHeaders })
  }
}) 