import { Handler } from '@netlify/functions';
import axios from 'axios';

const handler: Handler = async (event, context) => {
  const query = event.queryStringParameters?.query;
  const page = event.queryStringParameters?.page || 1;
  const apiKey = process.env.VITE_SERPAPI_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SerpAPI key not set in environment variables.' })
    };
  }
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing query parameter "query".' })
    };
  }
  const url = `https://serpapi.com/search.json?engine=walmart&query=${encodeURIComponent(query)}&api_key=${apiKey}&page=${page}`;
  try {
    const response = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from SerpAPI', details: err?.toString() })
    };
  }
};

export { handler }; 