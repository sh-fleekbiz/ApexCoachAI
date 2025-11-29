const http = require('http');

const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  if (req.url === '/health') {
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'apexcoachai-search-api',
      version: '1.0.0',
    }));
  } else {
    res.end(JSON.stringify({
      service: 'apexcoachai-search-api',
      description: 'AI search service',
      version: '1.0.0',
    }));
  }
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
