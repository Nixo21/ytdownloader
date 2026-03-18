// Netlify Function — proxy do backendu HTTP
const BACKEND = 'http://n9.tosthost.pl:5002';

exports.handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/proxy', '') || '/';
  const url  = BACKEND + path;

  const headers = { 'Content-Type': 'application/json' };

  try {
    const fetchOpts = {
      method: event.httpMethod,
      headers,
    };
    if (event.body) fetchOpts.body = event.body;

    const res  = await fetch(url, fetchOpts);
    const text = await res.text();

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Proxy error: ' + err.message }),
    };
  }
};
