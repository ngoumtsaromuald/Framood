const { createClient } = require('@insforge/sdk');
const client = createClient({ baseUrl: 'https://xuamewz8.us-east.insforge.app', anonKey: '123' });

async function run() {
  try {
    const req = client.database.from('mood_entries').select('*');
    console.log(req.url.href);
    
    // Let's actually execute it and see the injected fetch URL
    // We will hook global fetch to see what happens, wait, the sdk uses its internal fetch wrapper.
    const originalFetch = global.fetch;
    global.fetch = async (input, init) => {
      console.log('Global fetch called with:', input);
      return new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
    
    await req;
  } catch(e) {
    console.log("Error:", e.message);
  }
}

run();
