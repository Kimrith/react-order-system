const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

fetch('https://localhost:7293/api/Orders/1/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'In Kitchen' }),
  agent
})
.then(async res => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
})
.catch(err => console.error(err));
